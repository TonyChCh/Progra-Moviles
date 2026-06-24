import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

export const BitacoraDb = openDatabaseSync("todo-app.db", {
  enableChangeListener: true,
});

export const db = drizzle(BitacoraDb, { schema });
