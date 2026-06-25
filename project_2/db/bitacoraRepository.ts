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

    let audioId: number | null = null;
    let audioKey = "";

    if (data.audioKey) {
      const [audioRow] = await tx
        .insert(audio)
        .values({ uri: data.audioKey })
        .returning();
      audioId = audioRow.id;
      audioKey = audioRow.uri;
    }

    const [bitacoraRow] = await tx
      .insert(bitacora)
      .values({
        imageId: imageRow.id,
        audioId,
        location: data.location,
      })
      .returning();

    return {
      id: bitacoraRow.id.toString(),
      uri: imageRow.uri,
      location: bitacoraRow.location,
      audioKey,
    };
  });
}

export async function deleteEntry(id: string): Promise<void> {
  const entryId = Number(id);

  await db.transaction(async (tx) => {
    const [row] = await tx
      .select({ imageId: bitacora.imageId, audioId: bitacora.audioId })
      .from(bitacora)
      .where(eq(bitacora.id, entryId));

    if (!row) return;

    await tx.delete(bitacora).where(eq(bitacora.id, entryId));
    await tx.delete(image).where(eq(image.id, row.imageId));
    if (row.audioId != null) {
      await tx.delete(audio).where(eq(audio.id, row.audioId));
    }
  });
}
