import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <Drawer screenOptions={{ headerShown: true}}>
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
          title: "Detalles",
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
  );
}