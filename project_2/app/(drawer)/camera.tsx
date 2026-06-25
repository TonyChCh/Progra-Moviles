import React, { useState } from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  Platform,
  Linking,
  Pressable,
} from 'react-native';
import { CameraView } from 'expo-camera';import { useRouter, type Href } from 'expo-router';
import { useAppCamera } from '../../src/hooks/useCamera';
import { useLocation } from '../../src/hooks/useLocation';
import { useBitacora } from '../../src/contexts/BitacoraContext';
import { useAppPermissions } from '../../src/hooks/usePermissions';
import { useImageSelectionModal } from '../../src/hooks/useImageSelectionModal';
import { useAudioSelectionModal } from '../../src/hooks/useAudioSelectionModal';
import { ImageSelectionModal } from '../../src/components/ImageSelectionModal';
import { AudioSelectionModal } from '../../src/components/AudioSelectionModal';
import { getAudioLabel } from '../../src/utils/audioResolver';
import { buildBitacoraEntry } from '../../src/utils/buildBitacoraEntry';

interface CameraControlButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

function CameraControlButton({ title, onPress, disabled = false }: CameraControlButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.controlButton,
        disabled && styles.controlButtonDisabled,
        pressed && !disabled && styles.controlButtonPressed,
      ]}
    >
      <Text style={[styles.controlButtonText, disabled && styles.controlButtonTextDisabled]}>
        {title}
      </Text>
    </Pressable>
  );
}

export default function CameraScreen() {
  const camera = useAppCamera();  const location = useLocation();
  const { addEntry } = useBitacora();
  const router = useRouter();
  const permissions = useAppPermissions(['camera', 'location']);
  const imageModal = useImageSelectionModal();
  const audioModal = useAudioSelectionModal();

  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
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

  const handleAudioConfirm = async (audioKey: string | null) => {
    if (!capturedImageUri) {
      endCaptureTransaction();
      return;
    }

    const locData = await location.getLocation();
    const entry = await buildBitacoraEntry({
      uri: capturedImageUri,
      locationData: locData,
      audioKey: audioKey ?? '',
    });

    addEntry({ id: '', ...entry });
    endCaptureTransaction();
    router.replace('/' as Href);
  };

  const handleImageSave = async (imageUri: string) => {
    const locData = await location.getLocation();
    const entry = await buildBitacoraEntry({
      uri: imageUri,
      locationData: locData,
      audioKey: pendingAudioKey ?? '',
    });

    addEntry({ id: '', ...entry });
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
      <CameraView style={styles.camera} facing={camera.facing} ref={camera.cameraRef} />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topRightButton}>
          <CameraControlButton
            title="+ Seleccionar"
            onPress={handleOpenImageModal}
            disabled={isCameraControlsDisabled}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CameraControlButton
            title="Voltear"
            onPress={camera.toggleCameraFacing}
            disabled={isCameraControlsDisabled}
          />
          <CameraControlButton
            title="Capturar"
            onPress={handleTakePicture}
            disabled={isCameraControlsDisabled}
          />
        </View>
      </View>

      <ImageSelectionModal        modal={imageModal}
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
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  topRightButton: { position: 'absolute', top: 20, right: 20 },  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 50,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: 12,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 153, 255, 0.92)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 100,
    alignItems: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: 'rgba(180, 180, 180, 0.75)',
  },
  controlButtonPressed: {
    opacity: 0.85,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  controlButtonTextDisabled: {
    color: '#666',
  },
});