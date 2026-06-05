// src/hooks/useAppPermissions.ts
import { useState, useEffect } from 'react';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import { useCameraPermissions } from 'expo-camera';

export function useAppPermissions() {
  const [cameraStatus, setCameraStatus] = useState<boolean | null>(null);
  const [locationStatus, setLocationStatus] = useState<boolean | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  // Función interna para verificar el estado actual de los permisos del sistema
  const verifyPermissions = async () => {
    try {
      const [permission, requestPermission] = Camera();
      const locationCheck = await Location.g;

      // Guardamos true solo si el permiso fue explícitamente otorgado ('granted')
      setCameraStatus(cameraCheck.granted);
      setLocationStatus(locationCheck.granted);
    } catch (error) {
      console.error("Error al verificar permisos:", error);
    }
  };

  // Trigger público para solicitar ambos permisos en bloque (por ejemplo, al pulsar un botón)
  const requestAllPermissions = async () => {
    if (isRequesting) return; // 🔒 Escudo anti-spam de clics
    
    try {
      setIsRequesting(true);

      // Solicitamos permiso de la cámara
      const cameraResponse = await Camera.requestCameraPermissionsAsync();
      setCameraStatus(cameraResponse.granted);

      // Si el de la cámara se otorgó o denegó, procedemos con el GPS
      const locationResponse = await Location.requestForegroundPermissionsAsync();
      setLocationStatus(locationResponse.granted);

    } catch (error) {
      console.error("Error al solicitar permisos:", error);
    } finally {
      setIsRequesting(false); // Liberamos el escudo
    }
  };

  // Verificación pasiva automática apenas se monte el Hook en la pantalla
  useEffect(() => {
    verifyPermissions();
  }, []);

  return {
    hasCameraPermission: cameraStatus,
    hasLocationPermission: locationStatus,
    isRequestingPermissions: isRequesting,
    requestAllPermissions,
    verifyPermissions // Por si queremos refrescar manualmente
  };
}