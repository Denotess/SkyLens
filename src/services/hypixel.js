import axios from 'axios';
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 30 });

export async function fetchAuctions() {
  const key = 'hyp:auctions';
  const c = cache.get(key);
  if (c) return c;
  const res = await axios.get('https://api.hypixel.net/skyblock/auctions', { timeout: 20000 });
  cache.set(key, res.data?.auctions||[], 30);
  return res.data?.auctions||[];
}

export async function fetchBazaarAll() {
  const key = 'hyp:bz';
  const c = cache.get(key);
  if (c) return c;
  const res = await axios.get('https://api.hypixel.net/skyblock/bazaar');
  cache.set(key, res.data?.products||{}, 60);
  return res.data?.products||{};
}
