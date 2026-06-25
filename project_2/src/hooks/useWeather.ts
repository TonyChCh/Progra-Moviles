import { useCallback, useEffect, useState } from 'react';
import {
  fetchCurrentWeather,
  WeatherCoords,
  WeatherSnapshot,
} from '../utils/fetchCurrentWeather';

export type { WeatherCoords, WeatherSnapshot };

export function useWeather(coords: WeatherCoords | null) {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latitude = coords?.latitude;
  const longitude = coords?.longitude;

  const loadWeather = useCallback(async (targetCoords: WeatherCoords) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCurrentWeather(targetCoords);
      setWeather(data);
      return data;
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('No se pudo cargar el pronóstico.');
      setWeather(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      setWeather(null);
      setError(null);
      return;
    }

    void loadWeather({ latitude, longitude });
  }, [latitude, longitude, loadWeather]);

  return {
    weather,
    isLoading,
    error,
    refetch: () =>
      latitude != null && longitude != null
        ? loadWeather({ latitude, longitude })
        : Promise.resolve(null),
  };
}
