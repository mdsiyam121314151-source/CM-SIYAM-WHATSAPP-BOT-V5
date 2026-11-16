import { AUTHOR } from "../config.js";

const cache = new Map();

export function setCache(key, value, ttl = 0) {
  const id = String(key);

  const expiresAt = ttl > 0
    ? Date.now() + ttl
    : null;

  cache.set(id, {
    value,
    expiresAt,
    author: AUTHOR
  });

  return true;
}

export function getCache(key) {
  const item = cache.get(String(key));

  if (!item) return null;

  if (item.expiresAt && Date.now() >= item.expiresAt) {
    cache.delete(String(key));
    return null;
  }

  return item.value;
}

export function hasCache(key) {
  return getCache(key) !== null;
}

export function deleteCache(key) {
  return cache.delete(String(key));
}

export function clearCache() {
  cache.clear();
}

export function getCacheStats() {
  return {
    size: cache.size,
    author: AUTHOR
  };
}
