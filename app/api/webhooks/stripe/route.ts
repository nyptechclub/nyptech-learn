import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook error: ${error.message}`, {
            status: 400,
        });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        await db.user_subscription.create({
            data: {
                user_Id: session.metadata.userId,
                stripe_customer_id: subscription.customer as string,
                stripe_subscription_id: subscription.id,
                stripe_price_id: subscription.items.data[0].price.id,
                stripe_end: new Date(subscription.current_period_end * 1000),
            },
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        await db.user_subscription.update({
            where: { stripe_subscription_id: subscription.id },
            data: {
                stripe_price_id: subscription.items.data[0].price.id,
                stripe_end: new Date(subscription.current_period_end * 1000),
            },
        });
    }

    return new NextResponse(null, { status: 200 });
}
