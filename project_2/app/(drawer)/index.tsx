import { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useBitacora } from '../../src/contexts/BitacoraContext';
import { useImageSelectionModal } from '../../src/hooks/useImageSelectionModal';
import { useAudioSelectionModal } from '../../src/hooks/useAudioSelectionModal';
import { ImageSelectionModal } from '../../src/components/ImageSelectionModal';
import { AudioSelectionModal } from '../../src/components/AudioSelectionModal';
import { useLocation } from '../../src/hooks/useLocation';
import { getAudioLabel } from '../../src/utils/audioResolver';
import { buildBitacoraEntry } from '../../src/utils/buildBitacoraEntry';
import { WeatherInfo } from '../../src/components/WeatherInfo';

export default function BodegaScreen() {
  const { entries, addEntry } = useBitacora();
  const router = useRouter();
  const imageModal = useImageSelectionModal();
  const audioModal = useAudioSelectionModal();
  const location = useLocation();

  const [pendingAudioKey, setPendingAudioKey] = useState<string | null>(null);
  const [pendingAudioLabel, setPendingAudioLabel] = useState<string | undefined>();

  const handleSaveImage = async (imageUri: string) => {
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

  const handleRequestAudio = () => {
    audioModal.open();
  };

  const handleAudioConfirm = (audioKey: string | null) => {
    setPendingAudioKey(audioKey);
    setPendingAudioLabel(audioKey ? getAudioLabel(audioKey) : 'Sin audio');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bodega</Text>
        <Button title="+ Agregar" onPress={imageModal.open} />
      </View>
      {entries.length === 0 ? <Text style={styles.empty}>Bodega vacía. ¡Toma una foto!</Text> : null}

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/photoDetail/${item.id}`)}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Text style={styles.label} numberOfLines={1}>{item.location}</Text>
            <WeatherInfo entry={item} style={styles.weatherRow} />
          </TouchableOpacity>
        )}
      />

      <ImageSelectionModal
        modal={imageModal}
        onSave={handleSaveImage}
        onRequestAudio={handleRequestAudio}
        onDismiss={() => {
          setPendingAudioKey(null);
          setPendingAudioLabel(undefined);
        }}
        selectedAudioLabel={pendingAudioLabel}
      />

      <AudioSelectionModal
        modal={audioModal}
        onConfirm={handleAudioConfirm}
        onDismiss={() => {
          setPendingAudioKey(null);
          setPendingAudioLabel(undefined);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f5f5f5' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  card: { flex: 1, margin: 5, backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden' },
  image: { height: 150, width: '100%' },
  label: { padding: 5, fontSize: 12, textAlign: 'center' },
  weatherRow: { paddingHorizontal: 5, paddingBottom: 5, justifyContent: 'center' },
});
