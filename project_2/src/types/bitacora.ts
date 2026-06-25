export interface BitacoraEntry {
  id: string;
  uri: string;
  location: string;
  audioKey: string;
  weatherCode: number | null;
  temperature: number | null;
}

export type NewBitacoraEntry = Omit<BitacoraEntry, 'id'>;
