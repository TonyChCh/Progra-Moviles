import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../../src/hooks/useWeather';
import { getWeatherDescription } from '../../src/constants/weatherCodes';
import { getWeatherIcon } from '../../src/constants/weatherIcons';
import { formatTemperature } from '../../src/utils/fetchCurrentWeather';

const TEST_COORDS = {
  latitude: 10.00,
  longitude: 180.00,
};

export default function TestScreen() {
  const { weather, isLoading, error } = useWeather(TEST_COORDS);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (isLoading || !weather) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>Cargando pronóstico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Open-Meteo test</Text>
      {weather.weatherCode != null ? (
        <Ionicons
          name={getWeatherIcon(weather.weatherCode)}
          size={64}
          color="#007AFF"
          style={styles.icon}
        />
      ) : null}
      {weather.weatherCode != null ? (
        <Text style={styles.weatherDescription}>
          {getWeatherDescription(weather.weatherCode)}
        </Text>
      ) : null}
      {weather.temperature != null ? (
        <Text style={styles.temperature}>{formatTemperature(weather.temperature)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  icon: {
    marginVertical: 16,
  },
  temperature: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '600',
  },
  loading: {
    marginTop: 12,
    color: '#666',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  weatherDescription: {
    marginTop: 4,
    fontSize: 16,
    color: '#333',
  },
});
