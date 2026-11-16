
// AUTHOR: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

const cache = new Map();

export function setCache(key, value, ttl = 60000) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl
  });

  return value;
}

export function getCache(key) {
  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

export function hasCache(key) {
  const item = cache.get(key);

  if (!item) return false;

  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return false;
  }

  return true;
}

export function deleteCache(key) {
  return cache.delete(key);
}

export function clearCache() {
  cache.clear();
}

export function cacheSize() {
  return cache.size;
}
