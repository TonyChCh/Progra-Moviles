import { View, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { AppButton } from '../../src/components/AppButton';
import { AudioSelectionModal } from '../../src/components/AudioSelectionModal';
import { ImageSelectionModal } from '../../src/components/ImageSelectionModal';
import { PermissionsScreen } from '../../src/components/PermissionsScreen';
import { useCameraScreen } from '../../src/hooks/useCameraScreen';

export default function CameraScreen() {
  const screen = useCameraScreen();

  if (!screen.permissions.isAllGranted) {
    return (
      <PermissionsScreen
        canAskAgain={screen.permissions.canAskAgain}
        onRequest={screen.requestPermissions}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={screen.camera.facing}
        ref={screen.camera.cameraRef}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topRight}>
          <AppButton
            title="+ Seleccionar"
            onPress={screen.openImagePicker}
            disabled={screen.isControlsDisabled}
            variant="overlay"
          />
        </View>

        <View style={styles.controls}>
          <AppButton
            title="Voltear"
            onPress={screen.camera.toggleCameraFacing}
            disabled={screen.isControlsDisabled}
            variant="overlay"
          />
          <AppButton
            title="Capturar"
            onPress={screen.takePicture}
            disabled={screen.isControlsDisabled}
            variant="overlay"
          />
        </View>
      </View>

      <ImageSelectionModal
        modal={screen.imageModal}
        onSave={screen.saveGalleryImage}
        onRequestAudio={screen.openAudioFromImage}
        onDismiss={screen.clearPendingAudio}
        selectedAudioLabel={screen.pendingAudioLabel}
      />

      <AudioSelectionModal
        modal={screen.audioModal}
        onConfirm={
          screen.audioModalMode === 'capture'
            ? screen.confirmCaptureAudio
            : screen.confirmGalleryAudio
        }
        onDismiss={screen.dismissAudioModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { ...StyleSheet.absoluteFillObject },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  topRight: { position: 'absolute', top: 20, right: 20 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: 12,
  },
});
