import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { batchName, testData } = await req.json();
    const sanitizedBatchName = batchName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");

    const dataDir = path.join(process.cwd(), "src", "data");
    const batchDir = path.join(dataDir, sanitizedBatchName);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(batchDir)) {
      fs.mkdirSync(batchDir);
    }
    const files = fs.readdirSync(batchDir);
    const testNumber = files.length + 1;
    const fileName = `test${testNumber}.json`;

    const dataWithIds = {
      ...testData,
      sections: testData.sections.map((section) => ({
        ...section,
        questions: section.questions.map((question) => ({
          ...question,
          id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })),
      })),
    };

    const filePath = path.join(batchDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(dataWithIds, null, 2));

    return NextResponse.json({ success: true, fileName, filePath });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save batch" },
      { status: 500 }
    );
  }
}
