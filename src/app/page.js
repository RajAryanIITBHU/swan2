import Image from "next/image";
import fs from "fs";
import path from "path";
import { auth } from "@/auth";

export default async function Home() {

  const dataDir = path.join(process.cwd(), "src/data"); // Absolute path to the 'data' folder
  const files = fs.readdirSync(dataDir); // Read files and folders
  const session = await auth()
  return (
    <div>
      <h1>Files & Folders in /src/data</h1>
      <ul>
        {files.map((file, index) => {
          if(session?.user?.batches.includes(file)){
            return <li key={index}>{file}</li>;
          }
        })}
      </ul>
    </div>
  );
}
