import db from "@/db/drizzle";
import { userSubcription } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { error } from "console";
import { eq } from "drizzle-orm";
import { headers } from "next/headers"
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("Stipe-Signature") as string;
    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        )
    } catch(error: any) {
        return new NextResponse(`webhook error  ${error.message}`, {
            status: 400
        })
    }
    const session = event.data.object as Stripe.Checkout.Session
    if (event.type === "checkout.session.completed"){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )
        if (!session?.metadata?.userId){
            return new NextResponse("User ID is required", {status: 400})
        }
        await db.insert(userSubcription).values({
            userId: session.metadata.userId,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeEnd: new Date(
                subscription.current_period_end * 1000,
            )
        })
    }
    if (event.type === "invoice.payment_succeeded"){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )
        await db.update(userSubcription).set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeEnd: new Date(
                subscription.current_period_end * 1000,
            )
        }).where(eq(userSubcription.stripeSubscriptionId, subscription.id))
    }
    return new NextResponse(null, { status: 200 })
}