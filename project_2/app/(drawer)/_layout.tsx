import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="camera" options={{ title: 'Tomar Foto' }} />
      <Drawer.Screen name="index" options={{ title: 'Bodega de Fotos' }} />
    </Drawer>
  );
}
