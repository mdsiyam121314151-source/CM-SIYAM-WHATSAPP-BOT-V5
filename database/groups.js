
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

import { readData, writeData } from "./index.js";

const DB_NAME = "groups";

export async function getGroups() {
  return readData(DB_NAME, {});
}

export async function getGroup(id) {
  const groups = await getGroups();

  return groups[id] || {
    id,
    mode: null,
    welcome: true,
    goodbye: true,
    createdAt: null
  };
}

export async function createGroup(id, data = {}) {
  const groups = await getGroups();

  if (!groups[id]) {
    groups[id] = {
      id,
      mode: null,
      welcome: true,
      goodbye: true,
      createdAt: Date.now(),
      ...data
    };
  }

  await writeData(DB_NAME, groups);

  return groups[id];
}

export async function updateGroup(id, data = {}) {
  const groups = await getGroups();

  groups[id] = {
    ...(groups[id] || {
      id,
      createdAt: Date.now()
    }),
    ...data,
    updatedAt: Date.now()
  };

  await writeData(DB_NAME, groups);

  return groups[id];
}

export async function deleteGroup(id) {
  const groups = await getGroups();

  delete groups[id];

  await writeData(DB_NAME, groups);

  return true;
}
