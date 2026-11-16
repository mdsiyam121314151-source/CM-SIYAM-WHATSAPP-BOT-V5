
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import { readData, writeData } from "./index.js";

const DB_NAME = "users";

export async function getUsers() {
  return readData(DB_NAME, {});
}

export async function getUser(id) {
  const users = await getUsers();

  return users[id] || null;
}

export async function createUser(id, data = {}) {
  const users = await getUsers();

  if (!users[id]) {
    users[id] = {
      id,
      name: data.name || "Unknown",
      role: data.role || "USER",
      banned: false,
      createdAt: Date.now(),
      ...data
    };
  }

  await writeData(DB_NAME, users);

  return users[id];
}

export async function updateUser(id, data = {}) {
  const users = await getUsers();

  users[id] = {
    ...(users[id] || { id, createdAt: Date.now() }),
    ...data,
    updatedAt: Date.now()
  };

  await writeData(DB_NAME, users);

  return users[id];
}

export async function deleteUser(id) {
  const users = await getUsers();

  delete users[id];

  await writeData(DB_NAME, users);

  return true;
}
