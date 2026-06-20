import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useBitacora } from '../src/contexts/BitacoraContext';
import { useAssetSelectionModal } from '../src/hooks/useAssetSelectionModal';
import { AssetSelectionModal } from '../src/components/AssetSelectionModal';
import { useLocation } from '../src/hooks/useLocation';

export default function BodegaScreen() {
  const { entries, addEntry } = useBitacora();
  const router = useRouter();
  const assetModal = useAssetSelectionModal();
  const location = useLocation();

  const handleSaveAssets = async (imageUri: string, audioKey: string) => {
    const locData = await location.getLocation();
    addEntry({
      id: Date.now().toString(),
      uri: imageUri,
      location: locData ? locData.readableLocation : "Ubicación desconocida",
      audioKey: audioKey
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bodega</Text>
        <Button title="+ Agregar" onPress={assetModal.open} />
      </View>
      {entries.length === 0 ? <Text style={styles.empty}>Bodega vacía. ¡Toma una foto!</Text> : null}

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/photoDetail/${item.id}`)}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Text style={styles.label} numberOfLines={1}>{item.location}</Text>
          </TouchableOpacity>
        )}
      />

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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f5f5f5' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  card: { flex: 1, margin: 5, backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden' },
  image: { height: 150, width: '100%' },
  label: { padding: 5, fontSize: 12, textAlign: 'center' }
});