import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";
import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cCourses } from "@/db/schema";
import { eq } from "drizzle-orm";
import CoursesClient from "./CoursesClient";



const Courses = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const coursesData = getCourses();
  const userProgressData = getUserProgress();
  const [courses, userProgress] = await Promise.all([coursesData, userProgressData]);
  const categories = await db.query.categories.findMany();
  const listcourse = await db.query.cCourses.findMany({
    where: eq(cCourses.isPublished, true),
  });

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
