import { 
    LocationObject, 
    getCurrentPositionAsync,
    LocationAccuracy,
    reverseGeocodeAsync, 
    getLastKnownPositionAsync
} from "expo-location";
import { useState } from "react";

interface AppLocationResult {
  coords: any;
  timestamp: number | null;
  readableLocation: string;
}

export function useLocation () {
  const [lastLocation, setLastLocation] = useState<LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = async () => {
    let locationInfo: AppLocationResult = {
      coords: null,
      timestamp: null,
      readableLocation: "Ubicación desconocida",
    };
    
    try {
      setIsLoading(true);

      let currentLocation = await getLastKnownPositionAsync({});

      if (!currentLocation) {
        currentLocation = await getCurrentPositionAsync({
          accuracy: LocationAccuracy.Balanced,
        });
      }
      setLastLocation(currentLocation);

      locationInfo.coords = currentLocation.coords;
      locationInfo.timestamp = currentLocation.timestamp;

      const response = await reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
    
      if (response && response.length > 0) {
        const place = response[0];
        const localidad = place.city || place.district || place.subregion || "Ubicación";
        
        locationInfo.readableLocation = place.country ? `${localidad}, ${place.country}` : localidad;
      }
    } catch (error) {
      console.log("Hubo un fallo en el proceso de ubicación:", error);
    } finally {
      setIsLoading(false);
    }
    return locationInfo;
  };

  return {
    lastLocation,
    isLoading,
    getLocation
  };
};