import { useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import { useAppCamera } from './useCamera';
import { useLocation } from './useLocation';
import { useBitacora } from '../contexts/BitacoraContext';
import { useAppPermissions } from './usePermissions';
import { useModal } from './useModal';
import { buildBitacoraEntry } from '../utils/buildBitacoraEntry';
import { getAudioLabel } from '../utils/audioResolver';
import { openAppSettings } from '../utils/openAppSettings';

type AudioModalMode = 'capture' | 'picker';

export function useCameraScreen() {
  const camera = useAppCamera();
  const location = useLocation();
  const { addEntry } = useBitacora();
  const router = useRouter();
  const permissions = useAppPermissions(['camera', 'location']);
  const imageModal = useModal();
  const audioModal = useModal();

  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [pendingAudioKey, setPendingAudioKey] = useState<string | null>(null);
  const [pendingAudioLabel, setPendingAudioLabel] = useState<string | undefined>();
  const [audioModalMode, setAudioModalMode] = useState<AudioModalMode>('picker');
  const [isCaptureTransactionActive, setIsCaptureTransactionActive] = useState(false);

  const isControlsDisabled =
    isCaptureTransactionActive || imageModal.isVisible || audioModal.isVisible;

  const clearPendingAudio = () => {
    setPendingAudioKey(null);
    setPendingAudioLabel(undefined);
  };

  const endCaptureTransaction = () => {
    setIsCaptureTransactionActive(false);
    setCapturedImageUri(null);
  };

  const persistEntry = async (uri: string, audioKey: string) => {
    const locationData = await location.getLocation();
    const entry = await buildBitacoraEntry({ uri, locationData, audioKey });
    addEntry(entry);
  };

  const requestPermissions = async () => {
    if (!permissions.canAskAgain) {
      openAppSettings();
      return;
    }
    await permissions.requestAll();
  };

  const takePicture = async () => {
    if (isControlsDisabled) return;

    setIsCaptureTransactionActive(true);
    try {
      const uri = await camera.takePicture();
      if (!uri) {
        endCaptureTransaction();
        return;
      }

      setCapturedImageUri(uri);
      setAudioModalMode('capture');
      audioModal.open();
    } catch (error) {
      console.error('Error en flujo de captura:', error);
      endCaptureTransaction();
    }
  };

  const openImagePicker = () => {
    if (isControlsDisabled) return;
    setAudioModalMode('picker');
    imageModal.open();
  };

  const confirmCaptureAudio = async (audioKey: string | null) => {
    if (!capturedImageUri) {
      endCaptureTransaction();
      return;
    }

    await persistEntry(capturedImageUri, audioKey ?? '');
    endCaptureTransaction();
    router.replace('/' as Href);
  };

  const saveGalleryImage = async (imageUri: string) => {
    await persistEntry(imageUri, pendingAudioKey ?? '');
    clearPendingAudio();
  };

  const openAudioFromImage = () => {
    setAudioModalMode('picker');
    audioModal.open();
  };

  const confirmGalleryAudio = (audioKey: string | null) => {
    setPendingAudioKey(audioKey);
    setPendingAudioLabel(audioKey ? getAudioLabel(audioKey) : 'Sin audio');
  };

  const dismissAudioModal = () => {
    if (audioModalMode === 'capture') {
      endCaptureTransaction();
      return;
    }
    clearPendingAudio();
  };

  return {
    permissions,
    camera,
    isControlsDisabled,
    imageModal,
    audioModal,
    audioModalMode,
    pendingAudioLabel,
    requestPermissions,
    takePicture,
    openImagePicker,
    confirmCaptureAudio,
    saveGalleryImage,
    openAudioFromImage,
    confirmGalleryAudio,
    clearPendingAudio,
    dismissAudioModal,
  };
}
