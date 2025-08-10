import { fetchBazaarAll } from './hypixel.js';
export async function fetchBazaar(itemName) {
  const all = await fetchBazaarAll();
  const key = Object.keys(all).find(k=>k.toLowerCase()===itemName.toLowerCase()) || Object.keys(all).find(k=>k.toLowerCase().includes(itemName.toLowerCase()));
  if (!key) return null;
  const pr = all[key];
  const buy = pr?.buy_summary?.[0]?.pricePerUnit || 0;
  const sell = pr?.sell_summary?.[0]?.pricePerUnit || 0;
  return { name: key, buy, sell };
}
