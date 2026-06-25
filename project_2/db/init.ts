import { BitacoraDb } from './client';

const SCHEMA_VERSION = 2;

export function initDatabase(): void {
  const result = BitacoraDb.getFirstSync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < 1) {
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
        location TEXT NOT NULL,
        weather_code INTEGER,
        temperature REAL
      );

      PRAGMA user_version = ${SCHEMA_VERSION};
    `);
    return;
  }

  if (currentVersion < SCHEMA_VERSION) {
    BitacoraDb.execSync(`
      ALTER TABLE bitacora ADD COLUMN weather_code INTEGER;
      ALTER TABLE bitacora ADD COLUMN temperature REAL;
      PRAGMA user_version = ${SCHEMA_VERSION};
    `);
  }
}
