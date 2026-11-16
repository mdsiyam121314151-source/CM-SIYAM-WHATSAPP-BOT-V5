import { readData, writeData } from "./index.js";
import { AUTHOR } from "../config.js";

const FILE = "groups";

function normalize(id) {
  return String(id || "").trim();
}

export async function getGroup(id) {
  const groups = await readData(FILE, {});
  return groups[normalize(id)] || null;
}

export async function createGroup(id, data = {}) {
  const groups = await readData(FILE, {});
  const groupId = normalize(id);

  if (!groupId) return false;

  if (!groups[groupId]) {
    groups[groupId] = {
      id: groupId,
      name: data.name || "Unknown Group",
      prefix: data.prefix || null,
      mode: data.mode || "all",
      welcome: data.welcome ?? true,
      goodbye: data.goodbye ?? true,
      banned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      author: AUTHOR
    };
  }

  return writeData(FILE, groups);
}

export async function updateGroup(id, updates = {}) {
  const groups = await readData(FILE, {});
  const groupId = normalize(id);

  if (!groups[groupId]) return false;

  groups[groupId] = {
    ...groups[groupId],
    ...updates,
    id: groupId,
    updatedAt: Date.now(),
    author: AUTHOR
  };

  return writeData(FILE, groups);
}

export async function deleteGroup(id) {
  const groups = await readData(FILE, {});
  const groupId = normalize(id);

  if (!groups[groupId]) return false;

  delete groups[groupId];

  return writeData(FILE, groups);
}

export async function getAllGroups() {
  return readData(FILE, {});
      }
