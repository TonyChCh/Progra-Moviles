import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  AppState,
  Alert,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBitacora } from '../../src/contexts/BitacoraContext';
import { useAppAudio } from '../../src/hooks/useAudio';
import { WeatherInfo } from '../../src/components/WeatherInfo';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, deleteEntry } = useBitacora();
  const router = useRouter();
  const navigation = useNavigation();
  const audio = useAppAudio();

  const playNewRef = useRef(audio.playNew);
  const stopAudioRef = useRef(audio.stopAudio);
  playNewRef.current = audio.playNew;
  stopAudioRef.current = audio.stopAudio;

  const initialIndex = Math.max(0, entries.findIndex((entry) => entry.id === id));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentEntry = entries[currentIndex];

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      const nextIndex = viewableItems[0]?.index;
      if (nextIndex != null) setCurrentIndex(nextIndex);
    }
  ).current;

  useEffect(() => {
    if (entries.length === 0) {
      router.back();
      return;
    }
    if (currentIndex >= entries.length) {
      setCurrentIndex(entries.length - 1);
    }
  }, [entries.length, currentIndex, router]);

  const handleDelete = useCallback(() => {
    if (!currentEntry) return;

    Alert.alert('Eliminar foto', '¿Estás seguro de que deseas eliminar esta entrada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          void stopAudioRef.current();
          void deleteEntry(currentEntry.id)
            .then(() => {
              if (entries.length <= 1) router.back();
            })
            .catch(() => Alert.alert('Error', 'No se pudo eliminar la foto.'));
        },
      },
    ]);
  }, [currentEntry, deleteEntry, entries.length, router]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleDelete} style={styles.headerButton} hitSlop={8}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </Pressable>
      ),
    });
  }, [navigation, handleDelete]);

  useFocusEffect(
    useCallback(() => {
      if (currentEntry?.audioKey) void playNewRef.current(currentEntry.audioKey);
      return () => {
        void stopAudioRef.current();
      };
    }, [currentEntry?.audioKey])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') void stopAudioRef.current();
    });
    return () => subscription.remove();
  }, []);

  if (!currentEntry) {
    return <Text style={styles.notFound}>Foto no encontrada</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <Image source={{ uri: item.uri }} style={styles.fullImage} />
          </View>
        )}
      />

      <View style={styles.locationBar}>
        <Text style={styles.locationText}>{currentEntry.location}</Text>
        <WeatherInfo
          entry={currentEntry}
          iconSize={18}
          textStyle={styles.weatherText}
          style={styles.weatherRow}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  page: { width: SCREEN_WIDTH, flex: 1 },
  fullImage: { flex: 1, resizeMode: 'contain' },
  locationBar: { padding: 20, backgroundColor: '#222' },
  locationText: { color: 'white', textAlign: 'center', fontSize: 18 },
  weatherRow: { justifyContent: 'center', marginTop: 8 },
  weatherText: { color: '#ddd', fontSize: 14 },
  notFound: { flex: 1, textAlign: 'center', marginTop: 50, fontSize: 16 },
  headerButton: { marginHorizontal: 8, padding: 4 },
});
