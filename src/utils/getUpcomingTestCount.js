export async function getUpcomingTestCount(files) {
  const now = new Date();

  const loaded = await Promise.all(
    files.map(async (file) => {
      const parts = file.replace(/\\/g, "/").split("/");
      const batch = parts.at(-2);
      const testName = parts.at(-1).replace(".json", "");

      try {
        const filePath = path.join(
          process.cwd(),
          "src/data",
          batch,
          `${testName}.json`
        );
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        return new Date(data.startDate) > now ? 1 : 0;
      } catch (err) {
        return 0;
      }
    })
  );

  return loaded.reduce((sum, val) => sum + val, 0);
}
