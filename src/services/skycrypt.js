import axios from 'axios';
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: Number(process.env.CACHE_TTL||60) });

export async function fetchSkyCryptProfile(usernameOrUuid) {
  const key = `sky:${usernameOrUuid.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached) return cached;
  try {
    const url = `https://sky.shiiyu.moe/api/v2/profile/${encodeURIComponent(usernameOrUuid)}`;
    const r = await axios.get(url, { timeout: 10000 });
    cache.set(key, r.data);
    return r.data;
  } catch (err) {
    console.warn('SkyCrypt fetch failed:', err?.message?.slice(0,200));
    return null;
  }
}
