import { fetchWeatherApi } from 'openmeteo';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export interface WeatherCoords {
  latitude: number;
  longitude: number;
}

export interface WeatherSnapshot {
  weatherCode: number | null;
  temperature: number | null;
}

export function roundTemperature(temperature: number | null): number | null {
  return temperature == null ? null : Math.round(temperature);
}

export function formatTemperature(temperature: number): string {
  return `${Math.round(temperature)}°C`;
}

export async function fetchCurrentWeather(
  coords: WeatherCoords
): Promise<WeatherSnapshot> {
  const responses = await fetchWeatherApi(FORECAST_URL, {
    latitude: coords.latitude,
    longitude: coords.longitude,
    current: 'weather_code,temperature_2m',
  });

  const current = responses[0].current();
  if (!current) {
    throw new Error('No current weather data available');
  }

  return {
    weatherCode: current.variables(0)!.value(),
    temperature: roundTemperature(current.variables(1)?.value() ?? null),
  };
}

export async function resolveEntryWeather(
  coords: { latitude: number; longitude: number } | null | undefined
): Promise<WeatherSnapshot> {
  if (coords == null) {
    return { weatherCode: null, temperature: null };
  }

  try {
    return await fetchCurrentWeather(coords);
  } catch (error) {
    console.error('Error resolving entry weather:', error);
    return { weatherCode: null, temperature: null };
  }
}
