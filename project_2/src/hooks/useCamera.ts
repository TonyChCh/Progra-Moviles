import { CameraView } from 'expo-camera';
import { useRef, useState } from 'react';

export function useAppCamera() {
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const cameraRef = useRef<CameraView>(null);
  const isCapturingRef = useRef(false);

  const toggleCameraFacing = () => {
    if (isCapturingRef.current) return;
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async (): Promise<string | null> => {
    if (isCapturingRef.current || !cameraRef.current) return null;

    isCapturingRef.current = true;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      return photo?.uri ?? null;
    } catch (error) {
      console.error('Error al capturar la fotografía:', error);
      return null;
    } finally {
      isCapturingRef.current = false;
    }
  };

  return { facing, cameraRef, toggleCameraFacing, takePicture };
}
