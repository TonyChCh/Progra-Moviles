export interface LocationResult {
  coords: { latitude: number; longitude: number } | null;
  timestamp: number | null;
  readableLocation: string;
}
