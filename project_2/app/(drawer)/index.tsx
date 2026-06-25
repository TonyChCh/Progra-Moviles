import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBitacora } from '../../src/contexts/BitacoraContext';
import { useBitacoraImageFlow } from '../../src/hooks/useBitacoraImageFlow';
import { ImageSelectionModal } from '../../src/components/ImageSelectionModal';
import { AudioSelectionModal } from '../../src/components/AudioSelectionModal';
import { WeatherInfo } from '../../src/components/WeatherInfo';
import { AppButton } from '../../src/components/AppButton';
import type { BitacoraEntry } from '../../src/types/bitacora';

function EntryCard({ entry, onPress }: { entry: BitacoraEntry; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: entry.uri }} style={styles.image} />
      <Text style={styles.label} numberOfLines={1}>
        {entry.location}
      </Text>
      <WeatherInfo entry={entry} style={styles.weatherRow} />
    </TouchableOpacity>
  );
}

export default function BodegaScreen() {
  const { entries } = useBitacora();
  const router = useRouter();
  const flow = useBitacoraImageFlow();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bodega</Text>
        <AppButton title="+ Agregar" onPress={flow.openImagePicker} />
      </View>

      {entries.length === 0 ? (
        <Text style={styles.empty}>Bodega vacía. ¡Toma una foto!</Text>
      ) : null}

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <EntryCard entry={item} onPress={() => router.push(`/photoDetail/${item.id}`)} />
        )}
      />

      <ImageSelectionModal
        modal={flow.imageModal}
        onSave={flow.saveImage}
        onRequestAudio={flow.openAudioPicker}
        onDismiss={flow.clearPendingAudio}
        selectedAudioLabel={flow.pendingAudioLabel}
      />

      <AudioSelectionModal
        modal={flow.audioModal}
        onConfirm={flow.selectAudio}
        onDismiss={flow.clearPendingAudio}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: { height: 150, width: '100%' },
  label: { padding: 5, fontSize: 12, textAlign: 'center' },
  weatherRow: { paddingHorizontal: 5, paddingBottom: 5, justifyContent: 'center' },
});
