import { useState } from 'react';
import { useBitacora } from '../contexts/BitacoraContext';
import { useLocation } from './useLocation';
import { useModal } from './useModal';
import { buildBitacoraEntry } from '../utils/buildBitacoraEntry';
import { getAudioLabel } from '../utils/audioResolver';

export function useBitacoraImageFlow() {
  const { addEntry } = useBitacora();
  const location = useLocation();
  const imageModal = useModal();
  const audioModal = useModal();

  const [pendingAudioKey, setPendingAudioKey] = useState<string | null>(null);
  const [pendingAudioLabel, setPendingAudioLabel] = useState<string | undefined>();

  const clearPendingAudio = () => {
    setPendingAudioKey(null);
    setPendingAudioLabel(undefined);
  };

  const saveImage = async (imageUri: string) => {
    const locationData = await location.getLocation();
    const entry = await buildBitacoraEntry({
      uri: imageUri,
      locationData,
      audioKey: pendingAudioKey ?? '',
    });
    addEntry(entry);
    clearPendingAudio();
  };

  const selectAudio = (audioKey: string | null) => {
    setPendingAudioKey(audioKey);
    setPendingAudioLabel(audioKey ? getAudioLabel(audioKey) : 'Sin audio');
  };

  return {
    imageModal,
    audioModal,
    pendingAudioLabel,
    saveImage,
    selectAudio,
    clearPendingAudio,
    openImagePicker: imageModal.open,
    openAudioPicker: audioModal.open,
  };
}
