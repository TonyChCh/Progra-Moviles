import { desc, eq } from "drizzle-orm";
import type { BitacoraEntry } from "../src/contexts/BitacoraContext";
import { db } from "./client";
import { audio, bitacora, image } from "./schema";

export async function fetchAllEntries(): Promise<BitacoraEntry[]> {
  const rows = await db
    .select({
      id: bitacora.id,
      location: bitacora.location,
      imageUri: image.uri,
      audioUri: audio.uri,
    })
    .from(bitacora)
    .innerJoin(image, eq(bitacora.imageId, image.id))
    .leftJoin(audio, eq(bitacora.audioId, audio.id))
    .orderBy(desc(bitacora.id));

  return rows.map((row) => ({
    id: row.id.toString(),
    uri: row.imageUri,
    location: row.location,
    audioKey: row.audioUri ?? "",
  }));
}

export async function insertEntry(
  data: Omit<BitacoraEntry, "id">
): Promise<BitacoraEntry> {
  return db.transaction(async (tx) => {
    const [imageRow] = await tx
      .insert(image)
      .values({ uri: data.uri })
      .returning();

    const [audioRow] = await tx
      .insert(audio)
      .values({ uri: data.audioKey })
      .returning();

    const [bitacoraRow] = await tx
      .insert(bitacora)
      .values({
        imageId: imageRow.id,
        audioId: audioRow.id,
        location: data.location,
      })
      .returning();

    return {
      id: bitacoraRow.id.toString(),
      uri: imageRow.uri,
      location: bitacoraRow.location,
      audioKey: audioRow.uri,
    };
  });
}
