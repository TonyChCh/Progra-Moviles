import { useCallback, useEffect, useState } from 'react';
import { fetchWeatherApi } from 'openmeteo';
import { getWeatherDescription } from '../constants/weatherCodes';
import { getWeatherIcon, WeatherIconName } from '../constants/weatherIcons';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export interface WeatherCoords {
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  latitude: number;
  longitude: number;
  elevation: number;
  weatherCode: number;
  description: string;
  icon: WeatherIconName;
  temperature: number | null;
  observedAt: Date;
}

async function fetchCurrentWeather(coords: WeatherCoords): Promise<CurrentWeather> {
  const responses = await fetchWeatherApi(FORECAST_URL, {
    latitude: coords.latitude,
    longitude: coords.longitude,
    current: 'weather_code,temperature_2m',
  });

  const response = responses[0];
  const current = response.current();

  if (!current) {
    throw new Error('No current weather data available');
  }

  const utcOffsetSeconds = response.utcOffsetSeconds();
  const weatherCode = current.variables(0)!.value();
  const temperature = current.variables(1)?.value() ?? null;

  return {
    latitude: response.latitude(),
    longitude: response.longitude(),
    elevation: response.elevation(),
    weatherCode,
    description: getWeatherDescription(weatherCode),
    icon: getWeatherIcon(weatherCode),
    temperature,
    observedAt: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
  };
}

export function useWeather(coords: WeatherCoords | null) {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
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
