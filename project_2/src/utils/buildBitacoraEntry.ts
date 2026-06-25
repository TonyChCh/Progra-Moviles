import type { BitacoraEntry } from '../contexts/BitacoraContext';
import { resolveEntryWeather } from './fetchCurrentWeather';

type LocationData = {
  readableLocation: string;
  coords: { latitude: number; longitude: number } | null;
} | null | undefined;

export async function buildBitacoraEntry({
  uri,
  locationData,
  audioKey,
}: {
  uri: string;
  locationData: LocationData;
  audioKey: string;
}): Promise<Omit<BitacoraEntry, 'id'>> {
  const weather = await resolveEntryWeather(locationData?.coords ?? null);

  return {
    uri,
    location: locationData?.readableLocation ?? 'Ubicación desconocida',
    audioKey,
    weatherCode: weather.weatherCode,
    temperature: weather.temperature,
  };
}
