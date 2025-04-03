import fs from "fs";
import path from "path";

export const getFilesFromSelectedFolders = (selectedFolders) => {
  const dataDir = path.join(process.cwd(), "src/data"); // Absolute path to the 'data' folder

  return selectedFolders.flatMap((folder) => {
    const folderPath = path.join(dataDir, folder);

    // Check if folder exists
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      console.warn(`Skipping: ${folder} (Not a valid folder)`);
      return [];
    }

    // Read and return full paths of files inside the folder
    return fs
      .readdirSync(folderPath)
      .map((file) => path.join(folderPath, file));
  });
};

