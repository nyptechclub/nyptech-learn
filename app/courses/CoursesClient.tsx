"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { List } from "./list";
import Link from "next/link";

interface Props {
  courses: any[];
  userProgress: any;
  categories: any[];
  listcourse: any[];
  userId: string
}

const CoursesClient = ({ courses, userProgress, categories, listcourse, userId }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredCourses, setFilteredCourses] = useState(listcourse);

  useEffect(() => {
    const filtered = listcourse.filter((course: any) =>
      course.title.toLowerCase().includes(searchInput.toLowerCase()) &&
      (!selectedCategory || course.categoryId === selectedCategory)
    );
    setFilteredCourses(filtered);
  }, [searchInput, selectedCategory, listcourse]);

  return (
    <section className="h-full max-w-[912px] px-3 mx-auto m-5">
      <div className="text-2xl font-bold m-5">All courses</div>
      <div className="flex items-center flex-col rounded-xl bg-base-200 m-5 p-5">
        Intrigued and bewildered, he began to wander through the town, seeking answers. The streets were lined with quaint pixelated buildings, their bright colors contrasting with the dark mystery of his situation. He approached a group of townsfolk gathered by a fountain.
        <br /><br />
        &quot;Excuse me,&quot; he said, trying to keep his voice steady, &quot;can you tell me where I am?&quot;
        <br /><br />
        A friendly-looking villager turned to him and smiled. &quot;Welcome to Pixeltown, young wizard. You&apos;re here just in time for the grand Wizard Tournament.&quot;
        <br /><br />
        &quot;The Wizard Tournament?&quot; he repeated, curiosity piqued. &quot;How can I get in?&quot;
        <br /><br />
        &quot;Yes,&quot; another villager chimed in. &quot;Every year, wizards from all around compete to prove their skills. The winner is granted a single wish. Many believe it holds the power to transcend realms.&quot;A spark of hope ignited within him. &quot;If I win this tournament, I might be able to return home,&quot; he thought, clenching his fists as the chakras in his palms flared brighter.
        <br /><br />
        &quot;The wizard tower seems like a good place to start, I saw many wizards going up that tower!&quot; said a nearby girl.
        <img src="/girl.png" className="w-20 h-20" />
      </div>
      <List
        courses={courses}
        activeCourse={userProgress?.activeCourse}
      />
      <h1 className="m-5 font-bold text-xl">Other Courses</h1>
      <div className="relative mb-5">
        <Search className="size-4 absolute top-3 left-3" />
        <Input
          className="pl-9 input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mb-4">
        {categories.map((item: any) => (
          <Button key={item.id} onClick={() => setSelectedCategory(item.id)} >
            {item.name}
          </Button>
        ))}
        <Button onClick={() => setSelectedCategory(null)} >All</Button>
      </div>
      <div className="pt-6 flex gap-4 flex-wrap items-center">
        {filteredCourses.map((item: any) => (
          <div key={item.id}>
            <Link href={`/learn/${item.id}`}
              className="h-full border-2 rounded-xl border-b-4 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[180px] max-w-[200]"
              
            >
              <img
                src={item.imageSrc}
                width={200}
                className="rounded-lg drop-shadow-md border object-cover"
              />
              <p className="text-center font-bold mt-3">
                {item.title}
              </p>

            </Link>
            {item.userId === userId && (
              <Link href={`/teacher/courses/${item.id}`} className="btn">
                Edit
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoursesClient;
