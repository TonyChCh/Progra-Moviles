import React, { useState } from 'react';
import { View, Button, Modal, Text, StyleSheet, Platform, Linking} from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useAppCamera } from '../src/hooks/useCamera';
import { useLocation } from '../src/hooks/useLocation';
import { useBitacora } from '../src/contexts/BitacoraContext';
import { SOUND_EFFECTS } from '../src/constants/data';
import { pickAsset } from '../src/utils/assetPicker';
import {useAppPermissions} from '../src/hooks/usePermissions';

export default function CameraScreen() {
  const camera = useAppCamera();
  const location = useLocation();
  const { addEntry } = useBitacora();
  const router = useRouter();
  const permissions = useAppPermissions(['camera', 'location']);

  const [modalVisible, setModalVisible] = useState(false);
  const [tempPhotoUri, setTempPhotoUri] = useState<string | null>(null);
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
    // Take picture with camera
    const uri = await camera.takePicture();
    if (!uri) return;
    
    setTempPhotoUri(uri);
    setModalVisible(true);
    // Get location after taking picture
    const locData = await location.getLocation();
    setTempLocation(locData ? locData.readableLocation : "Ubicación desconocida");
  };

  // Save entry to bitácora with selected audio
  const handleSave = (selectedAudioKey: string) => {
    if (tempPhotoUri) {
      addEntry({
        id: Date.now().toString(),
        uri: tempPhotoUri,
        location: tempLocation,
        audioKey: selectedAudioKey
      });
    }
    setModalVisible(false);
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
        <View style={styles.buttonContainer}>
          <Button title="Voltear" onPress={camera.toggleCameraFacing} />
          <Button title="Capturar" onPress={handleTakePicture} />
        </View>
      </CameraView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text>Ubicación actual: {tempLocation}</Text>
            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Elige un audio:</Text>
            
            {Object.entries(SOUND_EFFECTS).map(([key, value]) => (
              <Button 
                key={key} 
                title={value.title}
                onPress={() => handleSave(key)} 
              />
            ))}
            
            <Button title="Descartar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, justifyContent: 'flex-end' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 50, padding: 20, backgroundColor: 'rgba(0,0,0,0.5)', },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalBox: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 }
});