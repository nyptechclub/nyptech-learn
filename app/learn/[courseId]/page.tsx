import db from "@/db/drizzle";
import { attachments, cCourses, categories } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
    params: {
        courseId: string
    }
}

const Learningpage = async ({ params }: Props) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }

    const course = await db.query.cCourses.findFirst({
        where: eq(cCourses.id, params.courseId)
    });

    if (!course) {
        return redirect("/courses");
    }

    const categoryId = course.categoryId;

    if (!categoryId) {
        return redirect("/courses");
    }

    const category = await db.query.categories.findFirst({
        where: eq(categories.id, categoryId)
    });

    const attachmentsList = await db.query.attachments.findMany({
        where: eq(attachments.courseId, params.courseId)
    });

    return (
        <div className="container">
            <img src={course.imageSrc || "boy.png"} className="rounded-xl mt-6" alt="Course Image" />
            <h3 className="font-bold">Category:</h3>
            <div>{category?.name}</div>
            <h3 className="font-bold">Description:</h3>
            <div>{course.description}</div>
            <h3 className="font-bold">Attachments:</h3>
            <div>
                {attachmentsList.map((attachment: any) => (
                    <Link href={attachment.url} key={attachment.id} className="btn-link btn">
                        {attachment.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Learningpage;
