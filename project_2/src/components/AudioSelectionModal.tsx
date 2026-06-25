import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import { pickAsset } from '../utils/assetPicker';
import { SOUND_EFFECTS } from '../constants/data';
import { getAudioLabel } from '../utils/audioResolver';
import { useAudioSelectionModal } from '../hooks/useAudioSelectionModal';

interface AudioSelectionModalProps {
  modal: ReturnType<typeof useAudioSelectionModal>;
  onConfirm: (audioKey: string | null) => void;
  onDismiss?: () => void;
}

interface ModalActionButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'selected';
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
        variant === 'selected' && styles.actionButtonSelected,
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

export function AudioSelectionModal({ modal, onConfirm, onDismiss }: AudioSelectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedAudioKey, setSelectedAudioKey] = useState<string | null>(null);

  useEffect(() => {
    if (modal.isVisible) {
      setSelectedAudioKey(null);
      setLoading(false);
    }
  }, [modal.isVisible]);

  const handlePickAudioFile = async () => {
    try {
      setLoading(true);
      const uri = await pickAsset('audio');
      if (uri) {
        setSelectedAudioKey(uri);
      }
    } catch (error) {
      console.error('Error picking audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedAudioKey);
    modal.close();
  };

  const handleSkip = () => {
    onConfirm(null);
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
          <Text style={styles.title}>Seleccionar Audio</Text>
          <Text style={styles.subtitle}>Elige un efecto integrado o tu propio archivo</Text>

          {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

          <ScrollView style={styles.scrollArea}>
            {Object.entries(SOUND_EFFECTS).map(([key, effect]) => (
              <View key={key} style={styles.builtinButton}>
                <ModalActionButton
                  title={effect.title}
                  onPress={() => setSelectedAudioKey(key)}
                  variant={selectedAudioKey === key ? 'selected' : 'primary'}
                />
              </View>
            ))}
          </ScrollView>

          {selectedAudioKey ? (
            <Text style={styles.infoLabel}>
              Seleccionado: {getAudioLabel(selectedAudioKey)}
            </Text>
          ) : null}

          <View style={styles.buttonGroup}>
            <ModalActionButton
              title="Seleccionar archivo de audio"
              onPress={handlePickAudioFile}
              disabled={loading}
            />
            <ModalActionButton title="Continuar sin audio" onPress={handleSkip} disabled={loading} />
            <ModalActionButton title="Confirmar" onPress={handleConfirm} disabled={loading} />
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
    maxHeight: '85%',
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
    marginBottom: 12,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 12,
  },
  scrollArea: {
    maxHeight: 220,
    marginBottom: 12,
  },
  builtinButton: {
    marginBottom: 8,
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
  actionButtonSelected: {
    backgroundColor: '#0051A8',
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
