// src/app/api/read/route.ts
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url"); 

  if (!url) {
    return new Response("Missing 'url' query parameter", { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "src/data", url);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(fileContent);

    return Response.json(json);
  } catch (err) {
    return new Response("Error reading file: " + err.message, { status: 500 });
  }
}
