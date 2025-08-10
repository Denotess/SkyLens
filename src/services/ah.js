import { fetchAuctions } from './hypixel.js';
import NodeCache from 'node-cache';
import nbt from 'nbt';
const cache = new NodeCache({ stdTTL: 30 });

function parseQuery(q) {
  const parts = q.split(/\s+/);
  const base = [];
  const filters = {};
  for (const p of parts) {
    const m = p.match(/^(stars|fpb|recomb|skin|price|enchants):(.+)$/i);
    if (m) filters[m[1].toLowerCase()] = m[2];
    else base.push(p);
  }
  return { name: base.join(' '), filters };
}

function decodeItemBytes(item_bytes_b64) {
  try {
    const buf = Buffer.from(item_bytes_b64, 'base64');
    const parsed = nbt.parseUncompressedSync ? nbt.parseUncompressedSync(buf) : nbt.parse(buf);
    return parsed;
  } catch (e) {
    return null;
  }
}

export async function searchAH(query) {
  const { name, filters } = parseQuery(query);
  const cacheKey = `ah:${query}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const auctions = await fetchAuctions();
  let list = auctions.filter(a => (a?.item_name || '').toLowerCase().includes(name.toLowerCase()));

  if (filters.price) {
    const m = filters.price.match(/(\d+)(?:-(\d+))?/);
    if (m) {
      const min = Number(m[1]);
      const max = m[2] ? Number(m[2]) : Infinity;
      list = list.filter(a => {
        const p = a.starting_bid || a.highest_bid || 0;
        return p >= min && p <= max;
      });
    }
  }

  if (filters.stars || filters.recomb || filters.enchants || filters.skin) {
    list = list.filter(a => {
      const lore = a?.item_lore ? a.item_lore.join('\n').toLowerCase() : '';
      const nameLower = (a.item_name || '').toLowerCase();
      if (filters.stars) {
        const want = Number(filters.stars);
        const starCount = (nameLower.match(/★/g)||[]).length;
        if (starCount < want) return false;
      }
      if (filters.recomb && filters.recomb.toLowerCase()==='true') {
        if (!/recombobulated|recombobulate/i.test(lore)) return false;
      }
      if (filters.enchants) {
        const want = filters.enchants.toLowerCase().split(',');
        const ok = want.every(w=>lore.includes(w.trim()));
        if (!ok) return false;
      }
      if (filters.skin) {
        if (!nameLower.includes(filters.skin.toLowerCase())) return false;
      }
      return true;
    });
  }

  const mapped = list.map(a=>({
    name: a.item_name,
    price: a.starting_bid || a.highest_bid || 0,
    priceStr: `${(a.starting_bid||0).toLocaleString()} ${a.bin ? '(BIN)' : ''}`,
    raw: a
  }));
  cache.set(cacheKey, mapped, 30);
  return mapped;
}
