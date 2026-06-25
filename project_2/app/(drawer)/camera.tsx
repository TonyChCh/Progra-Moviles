import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Platform, Linking } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter, type Href } from 'expo-router';
import { useAppCamera } from '../../src/hooks/useCamera';
import { useLocation } from '../../src/hooks/useLocation';
import { useBitacora } from '../../src/contexts/BitacoraContext';
import { useAppPermissions } from '../../src/hooks/usePermissions';
import { useImageSelectionModal } from '../../src/hooks/useImageSelectionModal';
import { useAudioSelectionModal } from '../../src/hooks/useAudioSelectionModal';
import { ImageSelectionModal } from '../../src/components/ImageSelectionModal';
import { AudioSelectionModal } from '../../src/components/AudioSelectionModal';
import { getAudioLabel } from '../../src/utils/audioResolver';

export default function CameraScreen() {
  const camera = useAppCamera();
  const location = useLocation();
  const { addEntry } = useBitacora();
  const router = useRouter();
  const permissions = useAppPermissions(['camera', 'location']);
  const imageModal = useImageSelectionModal();
  const audioModal = useAudioSelectionModal();

  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [tempLocation, setTempLocation] = useState('Buscando ubicación...');
  const [pendingAudioKey, setPendingAudioKey] = useState<string | null>(null);
  const [pendingAudioLabel, setPendingAudioLabel] = useState<string | undefined>();
  const [audioModalMode, setAudioModalMode] = useState<'capture' | 'picker'>('picker');
  const [isCaptureTransactionActive, setIsCaptureTransactionActive] = useState(false);

  const isCameraControlsDisabled =
    isCaptureTransactionActive || imageModal.isVisible || audioModal.isVisible;

  const endCaptureTransaction = () => {
    setIsCaptureTransactionActive(false);
    setCapturedImageUri(null);
  };

  const handleRequestPermissions = async () => {
    if (!permissions.canAskAgain) {
      if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:');
      } else {
        Linking.openSettings();
      }
      return;
    }
    await permissions.requestAll();
  };

  const handleTakePicture = async () => {
    if (isCameraControlsDisabled) return;

    setIsCaptureTransactionActive(true);
    try {
      const uri = await camera.takePicture();
      if (!uri) {
        setIsCaptureTransactionActive(false);
        return;
      }
      
      const locData = await location.getLocation();
      setTempLocation(locData ? locData.readableLocation : 'Ubicación desconocida');
      setCapturedImageUri(uri);
      setAudioModalMode('capture');
      audioModal.open();
    } catch (error) {
      console.error('Error en flujo de captura:', error);
      setIsCaptureTransactionActive(false);
    }
  };

  const handleOpenImageModal = () => {
    if (isCameraControlsDisabled) return;
    setAudioModalMode('picker');
    imageModal.open();
  };

  const handleAudioConfirm = (audioKey: string | null) => {
    if (!capturedImageUri) {
      endCaptureTransaction();
      return;
    }

    addEntry({
      id: '',
      uri: capturedImageUri,
      location: tempLocation,
      audioKey: audioKey ?? '',
    });
    endCaptureTransaction();
    router.replace('/' as Href);
  };

  const handleImageSave = async (imageUri: string) => {
    const locData = await location.getLocation();
    addEntry({
      id: '',
      uri: imageUri,
      location: locData ? locData.readableLocation : 'Ubicación desconocida',
      audioKey: pendingAudioKey ?? '',
    });
    setPendingAudioKey(null);
    setPendingAudioLabel(undefined);
  };

  const handleRequestAudioFromImage = () => {
    setAudioModalMode('picker');
    audioModal.open();
  };

  const handleAudioConfirmFromImage = (audioKey: string | null) => {
    setPendingAudioKey(audioKey);
    setPendingAudioLabel(audioKey ? getAudioLabel(audioKey) : 'Sin audio');
  };

  if (!permissions.isAllGranted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>Configuración del Permisos</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20, color: '#555' }}>
          {!permissions.canAskAgain
            ? 'El acceso ha sido denegado permanentemente por el sistema. Es necesario autorizarlo manualmente desde los ajustes.'
            : 'Para construir la bitácora automatizada, necesitamos que concedas los siguientes accesos'}
        </Text>
        <Button
          title={!permissions.canAskAgain ? 'Abrir Ajustes del Teléfono' : 'Conceder Permisos Necesarios'}
          onPress={handleRequestPermissions}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={camera.facing} ref={camera.cameraRef}>
        <View style={styles.topRightButton}>
          <Button
            title="+ Seleccionar"
            onPress={handleOpenImageModal}
            disabled={isCameraControlsDisabled}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Voltear"
            onPress={camera.toggleCameraFacing}
            disabled={isCameraControlsDisabled}
          />
          <Button
            title="Capturar"
            onPress={handleTakePicture}
            disabled={isCameraControlsDisabled}
          />
        </View>
      </CameraView>

      <ImageSelectionModal
        modal={imageModal}
        onSave={handleImageSave}
        onRequestAudio={handleRequestAudioFromImage}
        onDismiss={() => {
          setPendingAudioKey(null);
          setPendingAudioLabel(undefined);
        }}
        selectedAudioLabel={pendingAudioLabel}
      />

      <AudioSelectionModal
        modal={audioModal}
        onConfirm={audioModalMode === 'capture' ? handleAudioConfirm : handleAudioConfirmFromImage}
        onDismiss={() => {
          if (audioModalMode === 'capture') {
            endCaptureTransaction();
          } else {
            setPendingAudioKey(null);
            setPendingAudioLabel(undefined);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, justifyContent: 'flex-end' },
  topRightButton: { position: 'absolute', top: 20, right: 20 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 50,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
