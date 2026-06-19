import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBitacora } from '../src/contexts/BitacoraContext';

export default function BodegaScreen() {
  const { entries } = useBitacora();
  const router = useRouter();

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  card: { flex: 1, margin: 5, backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden' },
  image: { height: 150, width: '100%' },
  label: { padding: 5, fontSize: 12, textAlign: 'center' }
});