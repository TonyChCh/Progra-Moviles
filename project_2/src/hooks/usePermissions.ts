import { useCameraPermissions } from "expo-camera";
import { useForegroundPermissions } from "expo-location";
import { AppState } from "react-native";
import { useEffect, useCallback } from "react";

type PermissionType = 'camera' | 'location' | 'audio' | 'gallery';

export function useAppPermissions(requiredPermissions: PermissionType[]) {
  const [cam, reqCam] = useCameraPermissions();
  const [loc, reqLoc] = useForegroundPermissions();

  const refreshPermissions = useCallback(async () => {
    await reqCam();
    await reqLoc();
  }, [reqCam, reqLoc]);

  // Refresh permissions when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshPermissions();
    });
    return () => subscription.remove?.();
  }, [refreshPermissions]);

  // Detect permission status changes and trigger refresh
  useEffect(() => {
    refreshPermissions();
  }, [cam?.granted, loc?.granted, refreshPermissions]);

  const getPermissionStatus = (type: PermissionType) => {
    switch (type) {
      case 'camera': return cam;
      case 'location': return loc;
      default: return null;
    }
  };

  const isAllGranted = requiredPermissions.every(p => getPermissionStatus(p)?.granted);
  const canAskAgain = requiredPermissions.every(p => getPermissionStatus(p)?.canAskAgain !== false);

  const requestAll = async () => {
    let allGranted = true;
    for (const type of requiredPermissions) {
      let result;
      if (type === 'camera') result = await reqCam();
      if (type === 'location') result = await reqLoc();

      if (!result?.granted) allGranted = false;
    }
    return allGranted;
  };

  return { isAllGranted, canAskAgain, requestAll };
}