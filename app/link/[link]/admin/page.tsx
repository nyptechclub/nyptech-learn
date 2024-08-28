import { db } from "@/lib/db";
import { linkSync } from "fs";
import Link from "next/link";

interface Props {
  params: {
    link: string;
  };
}

const Page = async ({ params }: Props) => {

  const files = await db.link.findMany({
    where: {
      roomname: params.link,
    },
    orderBy: {
      userId: 'asc',  // Sorts files by userId in ascending order
    },
  });
  

  return (
    <div className="card bg-base-100 w-96 shadow-xl mx-auto">
      <div className="card-body">
        <h2 className="card-title">Files for this link</h2>
        <div>
          {files.map((links) => (
            <div key={links.id}>
              <p>User: {links.username}</p>
              <Link href={links.text} className="btn btn-link">Link: {links.filename}</Link>
              <p>{new Date(links.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
