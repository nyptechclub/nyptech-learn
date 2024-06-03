import { IconBadge } from "@/components/general/icon-badge";
import db from "@/db/drizzle";
import { cCourses } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { LayoutDashboardIcon } from "lucide-react";
import { redirect } from "next/navigation";

const CourseIdPage = async({
    params
}: {
    params:{courseId: string}
}) => {
    const {userId} = auth()
    if (!userId){
        return redirect("/")
    }
    const course = await db.query.cCourses.findFirst({
        where: eq(cCourses.id, params.courseId)
    })
    if (!course){
        return redirect("/lesson")
    }
    const requiredFields =[
        course.title,
        course.description,
        course.imageSrc,
        course.categoryId
    ]
    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completetionText = `(${completedFields}/${totalFields})`
    return ( 
        <div className="p-6">

            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                Course setup
                </h1>
                <span className="text-sm">
                    Complete all fields {completetionText}
                </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboardIcon}/>
                <h2 className="text-xl">
                Customize your course
                </h2>
                </div>
            </div>
        </div>
     );
}
 
export default CourseIdPage;