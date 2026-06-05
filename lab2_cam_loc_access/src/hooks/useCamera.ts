import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";

export function useAppCamera() {
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // TOGGLE CAMERA FACING
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // TAKE PICTURE
  const takePicture = async () => {
    if (!cameraRef.current) return null;

    const status = await requestPermission();
    if (!status.granted) {
      console.warn("Permiso de cámara denegado.");
      return null; 
    }

    try {
      const photo = await cameraRef.current.takePictureAsync();

      if (photo && photo.uri) {
        setPhotoUri(photo.uri);
        return photo.uri; 
      }
    } catch (error) {
      console.error("Error al capturar la fotografía", error);
    } 
    return null;
  };

  // DELETE CURRENT PHOTO
  const resetPhoto = () => setPhotoUri(null);

  return {
    facing,
    cameraRef,
    photoUri,
    hasCameraPermission: permission?.granted ?? null,
    toggleCameraFacing,
    takePicture,
    resetPhoto
  };
}