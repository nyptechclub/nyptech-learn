import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";

const Cources = async () => {
    const coursesData =  getCourses();
    const userProgressData =  getUserProgress();
    const [courses, userProgress] = await Promise.all([
        coursesData,
        userProgressData,
    ]);
    return ( 
        <section className="h-full max-w-[912px] px-3 mx-auto">
            <div className="text-2xl font-bol">
                All courses
            </div>
            <List
            courses={courses}
            activeCourseId={userProgress?.activeCourseId}
            />
            
        </section>
     );
}
 
export default Cources;