import { getCourses } from "@/db/queries";

const Cources = async () => {
    const data = await getCourses();
    return ( 
        <section className="h-full max-w-[912px] px-3 mx-auto">
            <div className="text-2xl font-bol">
                All courses
            </div>
            {JSON.stringify(data)}
        </section>
     );
}
 
export default Cources;