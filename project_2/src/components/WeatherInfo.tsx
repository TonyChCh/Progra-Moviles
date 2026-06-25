import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getWeatherDescription } from '../constants/weatherCodes';
import { getWeatherIcon } from '../constants/weatherIcons';
import { formatTemperature } from '../utils/fetchCurrentWeather';
import type { BitacoraEntry } from '../contexts/BitacoraContext';

interface WeatherInfoProps {
  entry: Pick<BitacoraEntry, 'weatherCode' | 'temperature'>;
  iconSize?: number;
  textStyle?: object;
  style?: object;
}

export function WeatherInfo({
  entry,
  iconSize = 14,
  textStyle,
  style,
}: WeatherInfoProps) {
  if (entry.weatherCode == null && entry.temperature == null) {
    return null;
  }

  return (
    <View style={[styles.row, style]}>
      {entry.weatherCode != null ? (
        <Ionicons name={getWeatherIcon(entry.weatherCode)} size={iconSize} color="#007AFF" />
      ) : null}
      {entry.weatherCode != null ? (
        <Text style={[styles.text, textStyle]} numberOfLines={1}>
          {getWeatherDescription(entry.weatherCode)}
        </Text>
      ) : null}
      {entry.temperature != null ? (
        <Text style={[styles.text, textStyle]}>{formatTemperature(entry.temperature)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 12,
    color: '#333',
  },
});
