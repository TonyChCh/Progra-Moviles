import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BitacoraProvider } from '../src/contexts/BitacoraContext';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { BitacoraDb } from '@/db/client';

export default function RootLayout() {
  const [init, setInit] = useState(false);
  useEffect(() => {
    try {
      BitacoraDb.execSync(
        `CREATE TABLE IF NOT EXISTS audio (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uri TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS image (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uri TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS bitacora (
          id TEXT PRIMARY KEY,
          uri TEXT NOT NULL,
          location TEXT NOT NULL REFERENCES image(id),
          audioKey TEXT REFERENCES audio(id)
        );`
      );
      setInit(true);
    } catch (error) {
      console.error("Error al iniciar", error);
    }
  }, []);

  if (!init) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando...</Text>
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BitacoraProvider>
        <Drawer>
          <Drawer.Screen 
            name="camera" 
            options={{ title: 'Tomar Foto' }} 
          />
          <Drawer.Screen 
            name="index" 
            options={{ title: 'Bodega de Fotos' }} 
          />
          <Drawer.Screen 
            name="photoDetail/[id]" 
            options={{ drawerItemStyle: { display: 'none' }, title: 'Detalle' }} 
          />
        </Drawer>
      </BitacoraProvider>
    </GestureHandlerRootView>
  );
}