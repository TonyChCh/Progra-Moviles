import { CameraView } from "expo-camera";
import { useRef, useState } from "react";

export function useAppCamera() {
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const isCapturingRef = useRef(false);

  const toggleCameraFacing = () => {
    if (isCapturingRef.current) return;
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (isCapturingRef.current || !cameraRef.current) return null;

    isCapturingRef.current = true;
    try {
      const photo = await cameraRef.current.takePictureAsync();

      if (photo?.uri) {
        setPhotoUri(photo.uri);
        return photo.uri;
      }
    } catch (error) {
      console.error("Error al capturar la fotografía", error);
    } finally {
      isCapturingRef.current = false;
    }
    return null;
  };

  // DELETE CURRENT PHOTO
  const resetPhoto = () => setPhotoUri(null);

  return {
    facing,
    cameraRef,
    photoUri,
    toggleCameraFacing,
    takePicture,
    resetPhoto
  };
}