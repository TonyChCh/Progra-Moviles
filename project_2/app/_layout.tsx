import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BitacoraProvider } from '../src/contexts/BitacoraContext';
import { initDatabase } from '@/db/init';

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <Text>Cargando...</Text>
    </View>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      initDatabase();
      setReady(true);
    } catch (error) {
      console.error('Error al iniciar la base de datos:', error);
    }
  }, []);

  if (!ready) return <LoadingScreen />;

  return (
    <GestureHandlerRootView style={styles.root}>
      <BitacoraProvider>
        <Stack>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen
            name="photoDetail/[id]"
            options={{ title: 'Detalle', headerBackTitle: 'Bodega' }}
          />
        </Stack>
      </BitacoraProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
