import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BitacoraProvider } from '../src/contexts/BitacoraContext';

export default function RootLayout() {
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