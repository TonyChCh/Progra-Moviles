import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{ headerShown: true }}>
        <Drawer.Screen 
          name="index" 
          options={{ 
            drawerLabel: "Mi Perfil", 
            title: "Portafolio Personal" 
          }} 
        />
        <Drawer.Screen 
          name="(tabs)" 
          options={{ 
            drawerLabel: "Detalles", 
            title: "Mi Perfil",
          }} 
        />
        <Drawer.Screen 
          name="contact" 
          options={{ 
            drawerLabel: "Contacto", 
            title: "Contacto" 
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}