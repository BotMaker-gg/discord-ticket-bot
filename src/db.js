// Generated with BotMaker.gg — AI-Powered Discord Bot Builder
// https://botmaker.gg

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'bot.db');

// Ensure data directory exists
import fs from 'fs';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');

// Helper: run a query (INSERT, UPDATE, DELETE, CREATE TABLE)
export function run(sql, ...params) {
  return db.prepare(sql).run(...params);
}

// Helper: get one row
export function get(sql, ...params) {
  return db.prepare(sql).get(...params);
}

// Helper: get all rows
export function all(sql, ...params) {
  return db.prepare(sql).all(...params);
}

// Helper: run multiple statements (for migrations)
export function exec(sql) {
  return db.exec(sql);
}

export default db;
