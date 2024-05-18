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
        <section className="h-full max-w-[912px] px-3 mx-auto m-5">
            <div className="text-2xl font-bol">
                All courses
            </div>
            <div className="flex items-center flex-col rounded-xl bg-base-200 m-5 p-5">
            Intrigued and bewildered, he began to wander through the town, seeking answers. The streets were lined with quaint pixelated buildings, their bright colors contrasting with the dark mystery of his situation. He approached a group of townsfolk gathered by a fountain. 
            <br/><br/>
            "Excuse me," he said, trying to keep his voice steady, "can you tell me where I am?"
            <br/><br/>
            A friendly-looking villager turned to him and smiled. "Welcome to Pixeltown, young wizard. You&apos;re here just in time for the grand Wizard Tournament."
            <br/><br/>
            "The Wizard Tournament?" he repeated, curiosity piqued. "How can I get in?"
            <br/><br/>
            "Yes," another villager chimed in. "Every year, wizards from all around compete to prove their skills. The winner is granted a single wish. Many believe it holds the power to transcend realms."A spark of hope ignited within him. "If I win this tournament, I might be able to return home," he thought, clenching his fists as the chakras in his palms flared brighter.
            <br/><br/>
            "The wizard tower seems like a good place to start, I saw many wizards going up that tower!" said a nearby girl.
            <img src="/girl.png" className="w-20 h-20" />

            </div>
            <List
            courses={courses}
            activeCourseId={userProgress?.activeCourseId}
            />
            
        </section>
     );
}
 
export default Cources;