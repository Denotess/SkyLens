import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
let instance;

export function initDb() {
  if (instance) return instance;
  const filepath = process.env.SQLITE_FILE || path.join(process.cwd(),'data','bot.db');
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  const db = new Database(filepath);
  db.pragma('journal_mode = WAL');
  db.prepare(`CREATE TABLE IF NOT EXISTS networth_watch (id INTEGER PRIMARY KEY, username TEXT, discord_id TEXT, created_at INTEGER DEFAULT (strftime('%s','now')));`).run();
  db.prepare(`CREATE TABLE IF NOT EXISTS ah_watches (id INTEGER PRIMARY KEY, query TEXT, channel_id TEXT, min_price INTEGER, created_at INTEGER DEFAULT (strftime('%s','now')));`).run();
  db.prepare(`CREATE TABLE IF NOT EXISTS flips (id INTEGER PRIMARY KEY, item TEXT, profit INTEGER, time TEXT);`).run();

  instance = {
    registerNetworthWatch: (username, discordId)=> db.prepare('INSERT INTO networth_watch (username, discord_id) VALUES (?,?)').run(username, discordId),
    getNetworthWatches: ()=> db.prepare('SELECT * FROM networth_watch').all(),
    registerAhWatch: (q,ch,mp)=> db.prepare('INSERT INTO ah_watches (query, channel_id, min_price) VALUES (?,?,?)').run(q,ch,mp||0),
    getAhWatches: ()=> db.prepare('SELECT * FROM ah_watches').all(),
    recordFlip: (item,profit)=> db.prepare('INSERT INTO flips (item,profit,time) VALUES (?,?,datetime("now"))').run(item,profit),
    getLastFlips: ()=> db.prepare('SELECT * FROM flips ORDER BY id DESC LIMIT 20').all()
  };
  return instance;
}

export default {
  initDb,
  registerNetworthWatch: (u,id)=> initDb().registerNetworthWatch(u,id),
  getNetworthWatches: ()=> initDb().getNetworthWatches(),
  registerAhWatch: (q,ch,mp)=> initDb().registerAhWatch(q,ch,mp),
  getAhWatches: ()=> initDb().getAhWatches(),
  recordFlip: (item,profit)=> initDb().recordFlip(item,profit),
  getLastFlips: ()=> initDb().getLastFlips()
};
