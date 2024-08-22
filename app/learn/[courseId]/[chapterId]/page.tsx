import { db } from "@/lib/db";
import ChapterContent from "./button-disable";

type Props = {
  params: {
    chapterId: string;
  };
};

const Chapterpage = async ({ params }: Props) => {
  const chapter = await db.chapters.findFirst({
    where: {
      id: params.chapterId,
      is_published: true,
    },
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
