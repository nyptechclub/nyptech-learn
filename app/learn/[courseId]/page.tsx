//@ts-nocheck
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
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

    const course = await db.cCourses.findUnique({
        where: { id: params.courseId },
    });

    if (!course) {
        return redirect("/courses");
    }

    const categoryId = course.category_id;

    if (!categoryId) {
        return redirect("/courses");
    }

    const category = await db.categories.findUnique({
        where: { id: categoryId },
    });

    const attachmentsList = await db.attachments.findMany({
        where: { course_id: params.courseId },
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
                {attachmentsList.map((attachment) => (
                    <Link href={attachment.url} key={attachment.id} className="btn-link btn">
                        {attachment.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Learningpage;
