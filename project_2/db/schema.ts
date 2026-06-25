import {sqliteTable, integer, text, real} from "drizzle-orm/sqlite-core";

export const audio = sqliteTable("audio", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uri: text("uri").notNull()
});

export const image = sqliteTable("image", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uri: text("uri").notNull()
});

export const bitacora = sqliteTable("bitacora", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  audioId: integer("audio_id").references(() => audio.id),
  imageId: integer("image_id").notNull().references(() => image.id),
  location: text("location").notNull(),
  weatherCode: integer("weather_code"),
  temperature: real("temperature"),
});
