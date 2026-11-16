import { readData, writeData } from "./index.js";
import { AUTHOR } from "../config.js";

const FILE = "users";

function normalize(id) {
  return String(id || "").trim();
}

export async function getUser(id) {
  const users = await readData(FILE, {});
  return users[normalize(id)] || null;
}

export async function createUser(id, data = {}) {
  const users = await readData(FILE, {});
  const userId = normalize(id);

  if (!userId) return false;

  if (!users[userId]) {
    users[userId] = {
      id: userId,
      name: data.name || "Unknown",
      role: "USER",
      banned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      author: AUTHOR
    };
  }

  return writeData(FILE, users);
}

export async function updateUser(id, updates = {}) {
  const users = await readData(FILE, {});
  const userId = normalize(id);

  if (!users[userId]) return false;

  users[userId] = {
    ...users[userId],
    ...updates,
    id: userId,
    updatedAt: Date.now(),
    author: AUTHOR
  };

  return writeData(FILE, users);
}

export async function deleteUser(id) {
  const users = await readData(FILE, {});
  const userId = normalize(id);

  if (!users[userId]) return false;

  delete users[userId];

  return writeData(FILE, users);
}

export async function getAllUsers() {
  return readData(FILE, {});
}
