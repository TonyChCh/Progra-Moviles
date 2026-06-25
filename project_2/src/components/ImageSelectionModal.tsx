import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { pickAsset } from '../utils/assetPicker';
import { useImageSelectionModal } from '../hooks/useImageSelectionModal';

interface ImageSelectionModalProps {
  modal: ReturnType<typeof useImageSelectionModal>;
  onSave: (imageUri: string) => void;
  onRequestAudio: () => void;
  onDismiss?: () => void;
  selectedAudioLabel?: string;
}

interface ModalActionButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
}

function ModalActionButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
}: ModalActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.actionButton,
        variant === 'danger' && styles.actionButtonDanger,
        disabled && styles.actionButtonDisabled,
        pressed && !disabled && styles.actionButtonPressed,
      ]}
    >
      <Text
        style={[
          styles.actionButtonText,
          variant === 'danger' && styles.actionButtonTextDanger,
          disabled && styles.actionButtonTextDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
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
    if (modal.isVisible) {
      setImageUri(null);
      setLoading(false);
    }
  }, [modal.isVisible]);

  const hasImage = imageUri !== null;

  const handlePickImage = async () => {
    try {
      setLoading(true);
      const uri = await pickAsset('image');
      if (uri) {
        setImageUri(uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!imageUri) return;
    onSave(imageUri);
    modal.close();
  };

  const handleDismiss = () => {
    modal.close();
    onDismiss?.();
  };

  return (
    <Modal
      visible={modal.isVisible}
      animationType="slide"
      transparent
      onRequestClose={handleDismiss}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Seleccionar Imagen</Text>
          <Text style={styles.subtitle}>
            {loading ? 'Cargando imagen...' : 'Presiona para seleccionar una imagen'}
          </Text>
          {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
          {hasImage && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}
          {selectedAudioLabel ? (
            <Text style={styles.infoLabel}>Audio: {selectedAudioLabel}</Text>
          ) : null}
          <View style={styles.buttonGroup}>
            <ModalActionButton
              title={hasImage ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              onPress={handlePickImage}
              disabled={loading}
            />
            <ModalActionButton
              title="Seleccionar audio"
              onPress={onRequestAudio}
              disabled={loading || !hasImage}
            />
            <ModalActionButton
              title="Guardar"
              onPress={handleSave}
              disabled={loading || !hasImage}
            />
            <ModalActionButton
              title="Cancelar"
              onPress={handleDismiss}
              disabled={loading}
              variant="danger"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
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
  loader: {
    marginVertical: 20,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonDanger: {
    backgroundColor: '#FF3B30',
  },
  actionButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextDanger: {
    color: '#FFFFFF',
  },
  actionButtonTextDisabled: {
    color: '#8E8E93',
  },
});
