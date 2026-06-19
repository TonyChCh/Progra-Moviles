import { View, Image, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useBitacora } from '../../src/contexts/BitacoraContext';
import { useAppAudio } from '../../src/hooks/useAudio';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const { entries } = useBitacora();
  const audio = useAppAudio();

  const photo = entries.find(e => e.id === id);

  useEffect(() => {
    if (!photo || !photo.audioKey) return;

      audio.playNew(photo.audioKey); 
      
  }, [photo]);

  if (!photo) return <Text>Foto no encontrada</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.fullImage} />
      
      <View style={styles.locationBar}>
        <Text style={styles.locationText}>{photo.location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  fullImage: { flex: 1, resizeMode: 'contain' },
  locationBar: { padding: 20, backgroundColor: '#222' },
  locationText: { color: 'white', textAlign: 'center', fontSize: 18 }
});