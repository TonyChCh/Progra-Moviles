import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type WeatherIconName = ComponentProps<typeof Ionicons>['name'];

export const WEATHER_ICONS: Record<number, WeatherIconName> = {
  0: 'sunny',
  1: 'sunny-outline',
  2: 'partly-sunny',
  3: 'cloud',
  45: 'cloudy-night',
  48: 'cloudy-night',
  51: 'rainy-outline',
  53: 'rainy-outline',
  55: 'rainy',
  56: 'snow-outline',
  57: 'snow',
  61: 'rainy-outline',
  63: 'rainy',
  65: 'thunderstorm-outline',
  66: 'snow-outline',
  67: 'snow',
  71: 'snow-outline',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'rainy-outline',
  81: 'rainy',
  82: 'thunderstorm',
  85: 'snow-outline',
  86: 'snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};

export const DEFAULT_WEATHER_ICON: WeatherIconName = 'help-circle-outline';

export function getWeatherIcon(code: number): WeatherIconName {
  return WEATHER_ICONS[code] ?? DEFAULT_WEATHER_ICON;
}
