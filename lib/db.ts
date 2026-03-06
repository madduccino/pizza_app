import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'students.db');

declare global {
  // eslint-disable-next-line no-var
  var __studentsDb: Database.Database | undefined;
}

export function getDb(): Database.Database {
  if (!global.__studentsDb) {
    global.__studentsDb = new Database(DB_PATH);
    global.__studentsDb.pragma('journal_mode = WAL');
    initDb(global.__studentsDb);
  }
  return global.__studentsDb;
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      proxy_password_hash TEXT NOT NULL,
      real_password_encrypted TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export interface Student {
  id: number;
  name: string;
  email: string;
  proxy_password_hash: string;
  real_password_encrypted: string;
  created_at: string;
}

export interface StudentPublic {
  id: number;
  name: string;
  email: string;
  created_at: string;
}
