import fs from "fs-extra";
import path from "path";

import { AUTHOR } from "../config.js";

const DATA_DIR = path.resolve("./database/data");

await fs.ensureDir(DATA_DIR);

export async function readData(file, fallback = {}) {
  const filePath = path.join(DATA_DIR, `${file}.json`);

  try {
    if (!(await fs.pathExists(filePath))) {
      await writeData(file, fallback);
      return fallback;
    }

    return await fs.readJson(filePath);

  } catch (error) {
    console.error(`[RJ-SIYAM] Database read error: ${file}`, error);
    return fallback;
  }
}

export async function writeData(file, data) {
  const filePath = path.join(DATA_DIR, `${file}.json`);

  try {
    await fs.ensureDir(DATA_DIR);

    await fs.writeJson(filePath, data, {
      spaces: 2
    });

    return true;

  } catch (error) {
    console.error(`[RJ-SIYAM] Database write error: ${file}`, error);
    return false;
  }
}

export async function deleteData(file) {
  const filePath = path.join(DATA_DIR, `${file}.json`);

  try {
    await fs.remove(filePath);
    return true;
  } catch (error) {
    console.error(`[RJ-SIYAM] Database delete error: ${file}`, error);
    return false;
  }
}

export function getDatabaseInfo() {
  return {
    author: AUTHOR,
    directory: DATA_DIR
  };
}
