import { View, Text, StyleSheet, ScrollView, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVA_HrQLjkHiJ2Ag5RGuwbFeDKRLfldnDasw&s' }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <Text style={styles.title}>Hola, soy{"\n"}Tony Chang{"\n"}</Text>
        <Text style={styles.subtitle}>Desarrollador Web & Diseñador</Text>
        <Pressable
          style={styles.contactButton}
          onPress={() => router.push({ pathname: '/contact' } as any)}
        >
          <Text style={styles.contactButtonText}>Contáctame</Text>
        </Pressable>
      </ImageBackground>
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
  heroImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 12,
    top: 20,
    opacity: 0.12,
  },

  title: { fontSize: 32, fontWeight: '700', color: 'white', textAlign: 'center' },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 10, fontWeight: '700' },
  description: {
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.8,
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: '500'
  },
  contactButton: {
    marginTop: 30,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
  contactButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  }
});