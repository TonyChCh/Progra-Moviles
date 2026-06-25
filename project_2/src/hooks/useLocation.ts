import {
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
  LocationAccuracy,
  reverseGeocodeAsync,
} from 'expo-location';
import { useState } from 'react';
import type { LocationResult } from '../types/location';

const UNKNOWN_LOCATION = 'Ubicación desconocida';

function buildReadableLocation(place: {
  city?: string | null;
  district?: string | null;
  subregion?: string | null;
  country?: string | null;
}): string {
  const locality = place.city || place.district || place.subregion || 'Ubicación';
  return place.country ? `${locality}, ${place.country}` : locality;
}

export function useLocation() {
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = async (): Promise<LocationResult> => {
    const fallback: LocationResult = {
      coords: null,
      timestamp: null,
      readableLocation: UNKNOWN_LOCATION,
    };

    try {
      setIsLoading(true);

      let position = await getLastKnownPositionAsync({});
      if (!position) {
        position = await getCurrentPositionAsync({ accuracy: LocationAccuracy.Balanced });
      }

      const result: LocationResult = {
        coords: position.coords,
        timestamp: position.timestamp,
        readableLocation: UNKNOWN_LOCATION,
      };

      const places = await reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (places.length > 0) {
        result.readableLocation = buildReadableLocation(places[0]);
      }

      return result;
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      return fallback;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getLocation };
}
