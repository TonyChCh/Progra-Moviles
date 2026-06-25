import { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AppButton } from './AppButton';
import { pickAsset } from '../utils/assetPicker';
import type { ModalController } from '../hooks/useModal';

interface ImageSelectionModalProps {
  modal: ModalController;
  onSave: (imageUri: string) => void;
  onRequestAudio: () => void;
  onDismiss?: () => void;
  selectedAudioLabel?: string;
}

export function ImageSelectionModal({
  modal,
  onSave,
  onRequestAudio,
  onDismiss,
  selectedAudioLabel,
}: ImageSelectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (!modal.isVisible) return;
    setImageUri(null);
    setLoading(false);
  }, [modal.isVisible]);

  const hasImage = imageUri !== null;

  const pickImage = async () => {
    setLoading(true);
    try {
      const uri = await pickAsset('image');
      if (uri) setImageUri(uri);
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    modal.close();
    onDismiss?.();
  };

  const save = () => {
    if (!imageUri) return;
    onSave(imageUri);
    modal.close();
  };

  return (
    <Modal visible={modal.isVisible} animationType="slide" transparent onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <Text style={styles.title}>Seleccionar imagen</Text>
          <Text style={styles.subtitle}>
            {loading ? 'Cargando imagen...' : 'Presiona para seleccionar una imagen'}
          </Text>

          {loading ? <ActivityIndicator size="large" color="#007AFF" style={styles.loader} /> : null}
          {hasImage ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
          {selectedAudioLabel ? (
            <Text style={styles.info}>Audio: {selectedAudioLabel}</Text>
          ) : null}

          <View style={styles.actions}>
            <AppButton
              title={hasImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
              onPress={pickImage}
              disabled={loading}
            />
            <AppButton
              title="Seleccionar audio"
              onPress={onRequestAudio}
              disabled={loading || !hasImage}
            />
            <AppButton title="Guardar" onPress={save} disabled={loading || !hasImage} />
            <AppButton title="Cancelar" onPress={close} disabled={loading} variant="danger" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 24,
    minHeight: 400,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: { marginVertical: 20 },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  actions: { gap: 10 },
});
