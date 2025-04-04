import path from "path";
import fs from "fs/promises";

export async function getTestDataFromId(id) {
  try {
    const [batch, ...testParts] = id.split("-");
    const testName = testParts.join("-");
    const filePath = path.join(
      process.cwd(),
      "src/data",
      batch,
      `${testName}.json`
    );

    // ✅ Check if file exists
    await fs.access(filePath);

    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const durationMins = Math.round((end.getTime() - start.getTime()) / 60000);

    const allSubjects = ["mathematics", "physics", "chemistry"];
    const totalMarks = allSubjects.reduce((sum, subject) => {
      if (!Array.isArray(data[subject])) return sum;
      return (
        sum +
        data[subject].reduce((secSum, section) => {
          const count = section.questions?.length || 0;
          return secSum + count * section.marks;
        }, 0)
      );
    }, 0);

    return {
      batch,
      testName,
      url: `/t/${id}`,
      name: data.testName,
      duration: `${durationMins} mins`,
      marks: `${totalMarks} Marks`,
      date: start.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }),
      startDate: data.startDate,
      endDate: data.endDate,
      start,
      end,
      raw: data,
    };
  } catch (err) {
    if (err.code === "ENOENT") {
      // File doesn't exist
      return null;
    }

    console.error("Failed to load test:", err);
    return null;
  }
}
