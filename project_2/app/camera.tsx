import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Platform, Linking } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useAppCamera } from '../src/hooks/useCamera';
import { useLocation } from '../src/hooks/useLocation';
import { useBitacora } from '../src/contexts/BitacoraContext';
import { useAppPermissions } from '../src/hooks/usePermissions';
import { useAssetSelectionModal } from '../src/hooks/useAssetSelectionModal';
import { AssetSelectionModal } from '../src/components/AssetSelectionModal';
import {pickAsset} from '../src/utils/assetPicker';

export default function CameraScreen() {
  const camera = useAppCamera();
  const location = useLocation();
  const { addEntry } = useBitacora();
  const router = useRouter();
  const permissions = useAppPermissions(['camera', 'location']);
  const assetModal = useAssetSelectionModal();

  const [tempLocation, setTempLocation] = useState("Buscando ubicación...");

  const handleRequestPermissions = async () => {
    if (!permissions.canAskAgain) {
      // If we can't ask again, direct the user to the app settings to manually enable permissions
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
    const uri = await camera.takePicture();
    if (!uri) return;

    // Get location after taking picture
    const locData = await location.getLocation();
    setTempLocation(locData ? locData.readableLocation : "Ubicación desconocida");

    // Open the asset selection modal with the captured image
    assetModal.setImageUri(uri);
  };

  const handleSaveAssets = async (imageUri: string, audioKey: string) => {
    addEntry({
      id: Date.now().toString(),
      uri: imageUri,
      location: tempLocation,
      audioKey: audioKey
    });
    router.push('/');
  };

  // Show permissions request screen if we don't have all permissions yet
  if (!permissions.isAllGranted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>Configuración del Permisos</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20, color: '#555' }}>
          {!permissions.canAskAgain
            ? "El acceso ha sido denegado permanentemente por el sistema. Es necesario autorizarlo manualmente desde los ajustes."
            : "Para construir la bitácora automatizada, necesitamos que concedas los siguientes accesos"}
        </Text>
        <Button
          title={!permissions.canAskAgain ? "Abrir Ajustes del Teléfono" : "Conceder Permisos Necesarios"}
          onPress={handleRequestPermissions}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={camera.facing} ref={camera.cameraRef}>
        <View style={styles.topRightButton}>
          <Button title="+ Seleccionar" onPress={assetModal.open} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Voltear" onPress={camera.toggleCameraFacing} />
          <Button title="Capturar" onPress={handleTakePicture} />
        </View>
      </CameraView>

      <AssetSelectionModal
        modal={assetModal}
        onSave={handleSaveAssets}
        onDismiss={() => assetModal.reset()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, justifyContent: 'flex-end' },
  topRightButton: { position: 'absolute', top: 20, right: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 50, padding: 20, backgroundColor: 'rgba(0,0,0,0.5)', },
});