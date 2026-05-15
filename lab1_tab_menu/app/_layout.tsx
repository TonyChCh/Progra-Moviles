import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
      <Drawer screenOptions={{ headerShown: true}} initialRouteName="profile">
        <Drawer.Screen 
          name="profile" 
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
  );
}