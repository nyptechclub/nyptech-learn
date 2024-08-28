import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Upload from "./Upload";
import Link from "next/link";

interface Props {
  params: {
    link: string;
  };
}

const Page = async ({ params }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return notFound();
  }

  // Fetch the user's files and order them by createdAt
  const files = await db.link.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Group files by roomname
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.roomname]) {
      acc[file.roomname] = [];
    }
    acc[file.roomname].push(file);
    return acc;
  }, {} as Record<string, typeof files>);

  return (
    <div>
      <Upload link={params.link} />
      <div className="m-5 p-5 mx-auto">
      <h1 className="font-bold text-xl">Past Uploaded Files:</h1>
      <div>
        {Object.keys(groupedFiles).map((roomname) => (
          <div key={roomname} >
            <h2 className="font-semibold text-lg">Link Name:{roomname}</h2>
            {groupedFiles[roomname].map((file) => (
              <Link key={file.id} href={file.text} className="btn btn-link">
                <div>
                  {file.filename} - {new Date(file.createdAt).toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
      </div>
      
    </div>
  );
};

export default Page;
