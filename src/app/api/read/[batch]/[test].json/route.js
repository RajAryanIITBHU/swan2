// src/app/api/read/[batch]/[test].json/route.ts

import fs from "fs";
import path from "path";

export async function GET(
  req,
  { params }
) {
  const { batch, test } = params;

  try {
    const filePath = path.join(process.cwd(), "src/data", batch, `${test}${process.env.NEXT_PUBLIC_DEV === "Development" ? ".json": ""}`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(fileContent);

    return Response.json(json);
  } catch (err) {
    return new Response("Error reading file: " + err.message, { status: 500 });
  }
}
