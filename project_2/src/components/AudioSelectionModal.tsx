import { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { AppButton } from './AppButton';
import { pickAsset } from '../utils/assetPicker';
import { SOUND_EFFECTS } from '../constants/data';
import { getAudioLabel } from '../utils/audioResolver';
import type { ModalController } from '../hooks/useModal';

interface AudioSelectionModalProps {
  modal: ModalController;
  onConfirm: (audioKey: string | null) => void;
  onDismiss?: () => void;
}

export function AudioSelectionModal({ modal, onConfirm, onDismiss }: AudioSelectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedAudioKey, setSelectedAudioKey] = useState<string | null>(null);

  useEffect(() => {
    if (!modal.isVisible) return;
    setSelectedAudioKey(null);
    setLoading(false);
  }, [modal.isVisible]);

  const pickAudioFile = async () => {
    setLoading(true);
    try {
      const uri = await pickAsset('audio');
      if (uri) setSelectedAudioKey(uri);
    } catch (error) {
      console.error('Error picking audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    modal.close();
    onDismiss?.();
  };

  const confirm = (audioKey: string | null) => {
    onConfirm(audioKey);
    modal.close();
  };

  return (
    <Modal visible={modal.isVisible} animationType="slide" transparent onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <Text style={styles.title}>Seleccionar audio</Text>
          <Text style={styles.subtitle}>Elige un efecto integrado o tu propio archivo</Text>

          {loading ? <ActivityIndicator size="large" color="#007AFF" style={styles.loader} /> : null}

          <ScrollView style={styles.scrollArea}>
            {Object.entries(SOUND_EFFECTS).map(([key, effect]) => (
              <View key={key} style={styles.builtinRow}>
                <AppButton
                  title={effect.title}
                  onPress={() => setSelectedAudioKey(key)}
                  variant={selectedAudioKey === key ? 'selected' : 'primary'}
                />
              </View>
            ))}
          </ScrollView>

          {selectedAudioKey ? (
            <Text style={styles.info}>Seleccionado: {getAudioLabel(selectedAudioKey)}</Text>
          ) : null}

          <View style={styles.actions}>
            <AppButton
              title="Seleccionar archivo de audio"
              onPress={pickAudioFile}
              disabled={loading}
            />
            <AppButton
              title="Continuar sin audio"
              onPress={() => confirm(null)}
              disabled={loading}
            />
            <AppButton title="Confirmar" onPress={() => confirm(selectedAudioKey)} disabled={loading} />
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
  loader: { marginVertical: 12 },
  scrollArea: { maxHeight: 220, marginBottom: 12 },
  builtinRow: { marginBottom: 8 },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  actions: { gap: 10 },
});
