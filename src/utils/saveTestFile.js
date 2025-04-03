import { clsx} from "clsx";
import { twMerge } from "tailwind-merge";
import fs from "fs";
import path from "path";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function saveTestBatch(batchName, testData) {
  const sanitizedBatchName = batchName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const batchDir = path.join(process.cwd(), "data", sanitizedBatchName);

  // Create directories if they don't exist
  if (!fs.existsSync(path.join(process.cwd(), "data"))) {
    fs.mkdirSync(path.join(process.cwd(), "data"));
  }
  if (!fs.existsSync(batchDir)) {
    fs.mkdirSync(batchDir);
  }

  // Get the next test number
  const files = fs.readdirSync(batchDir);
  const testNumber = files.length + 1;
  const fileName = `test${testNumber}.json`;

  // Add unique IDs to questions
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

  // Save the file
  fs.writeFileSync(
    path.join(batchDir, fileName),
    JSON.stringify(dataWithIds, null, 2)
  );

  return { fileName, filePath: path.join(batchDir, fileName) };
}
