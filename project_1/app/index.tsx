import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Hola, soy{"\n"}Tony Chang{"\n"}</Text>
        <Text style={styles.subtitle}>Desarrollador Web & Diseñador</Text>
      </View>
      <View>
        <Text style={styles.description}>
          Bienvenido a mi portafolio digital, donde comparto mis proyectos y habilidades en desarrollo de software y aplicaciones.{"\n"}
          Aquí encontrarás una selección de mis trabajos más destacados, desde aplicaciones web hasta diseños creativos.{"\n"}
          Explora mi perfil para conocer más sobre mi experiencia.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff' },
  hero: { 
    padding: 60, 
    alignItems: 'center', 
    backgroundColor: '#667eea',
    minHeight: 400,
    justifyContent: 'center'
  },
  title: { fontSize: 32, fontWeight: '700', color: 'white', textAlign: 'center' },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 10, fontWeight: '700' },
  description: { 
    fontSize: 16, 
    color: 'black', 
    textAlign: 'center', 
    marginTop: 20, 
    opacity: 0.8, 
    lineHeight: 24, 
    paddingHorizontal: 20, 
    fontWeight: '500' 
  }
});