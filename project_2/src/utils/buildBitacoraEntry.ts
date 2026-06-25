import type { NewBitacoraEntry } from '../types/bitacora';
import { resolveEntryWeather } from './fetchCurrentWeather';
import type { LocationResult } from '../types/location';

interface BuildEntryParams {
  uri: string;
  locationData: LocationResult;
  audioKey: string;
}

export async function buildBitacoraEntry({
  uri,
  locationData,
  audioKey,
}: BuildEntryParams): Promise<NewBitacoraEntry> {
  const weather = await resolveEntryWeather(locationData.coords);

  return {
    uri,
    location: locationData.readableLocation,
    audioKey,
    weatherCode: weather.weatherCode,
    temperature: weather.temperature,
  };
}
