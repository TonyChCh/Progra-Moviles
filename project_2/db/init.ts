import { BitacoraDb } from './client';

const SCHEMA_VERSION = 1;

export function initDatabase(): void {
  const result = BitacoraDb.getFirstSync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < SCHEMA_VERSION) {
    BitacoraDb.execSync(`
      DROP TABLE IF EXISTS bitacora;
      DROP TABLE IF EXISTS image;
      DROP TABLE IF EXISTS audio;

      CREATE TABLE audio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL
      );
      CREATE TABLE image (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL
      );
      CREATE TABLE bitacora (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        audio_id INTEGER REFERENCES audio(id),
        image_id INTEGER NOT NULL REFERENCES image(id),
        location TEXT NOT NULL
      );

      PRAGMA user_version = ${SCHEMA_VERSION};
    `);
  }
}
