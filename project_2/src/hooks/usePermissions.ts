import { useCameraPermissions } from "expo-camera";
import { useForegroundPermissions } from "expo-location";

type PermissionType = 'camera' | 'location' | 'audio' | 'gallery';

export function useAppPermissions(requiredPermissions: PermissionType[]) {
  const [cam, reqCam] = useCameraPermissions();
  const [loc, reqLoc] = useForegroundPermissions();

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