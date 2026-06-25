import { useCameraPermissions } from 'expo-camera';
import { useForegroundPermissions } from 'expo-location';
import { AppState } from 'react-native';
import { useCallback, useEffect } from 'react';

type PermissionType = 'camera' | 'location';

export function useAppPermissions(required: PermissionType[]) {
  const [camera, requestCamera] = useCameraPermissions();
  const [location, requestLocation] = useForegroundPermissions();

  const refresh = useCallback(async () => {
    await requestCamera();
    await requestLocation();
  }, [requestCamera, requestLocation]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  useEffect(() => {
    void refresh();
  }, [camera?.granted, location?.granted, refresh]);

  const statusFor = (type: PermissionType) => (type === 'camera' ? camera : location);

  const isAllGranted = required.every((type) => statusFor(type)?.granted);
  const canAskAgain = required.every((type) => statusFor(type)?.canAskAgain !== false);

  const requestAll = async () => {
    let granted = true;

    for (const type of required) {
      const result = type === 'camera' ? await requestCamera() : await requestLocation();
      if (!result?.granted) granted = false;
    }

    return granted;
  };

  return { isAllGranted, canAskAgain, requestAll };
}
