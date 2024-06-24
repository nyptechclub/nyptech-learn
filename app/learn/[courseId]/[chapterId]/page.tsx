import db from "@/db/drizzle";
import { chapters } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import ChapterContent from "./button-disable";

type Props = {
  params: {
    chapterId: string;
  };
};

const Chapterpage = async ({ params }: Props) => {
  const chapter = await db.query.chapters.findFirst({
    where: and(eq(chapters.id, params.chapterId), eq(chapters.isPublished, true)),
  });

  if (!chapter) {
    return (
      <div className="flex flex-col p-5">
        <h3>Chapter not found</h3>
      </div>
    );
  }

  return <ChapterContent chapter={chapter as { id: string; videoUrl?: string; description?: string }} />;
};

export default Chapterpage;
