import { getCourses, getUserProgress } from "@/lib/queries";
import { List } from "./list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CoursesClient from "./CoursesClient";
import { db } from "@/lib/db";

const Courses = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  // Fetch courses and user progress using the existing functions
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  // Fetch categories and published courses using db
  const [courses, userProgress, categories, listcourse] = await Promise.all([
    coursesData,
    userProgressData,
    db.categories.findMany(),
    db.cCourses.findMany({
      where: { is_published: true },
    }),
  ]);

  return (
    <CoursesClient
      courses={courses}
      userProgress={userProgress}
      categories={categories}
      listcourse={listcourse}
      userId={userId}
    />
  );
};

export default Courses;
