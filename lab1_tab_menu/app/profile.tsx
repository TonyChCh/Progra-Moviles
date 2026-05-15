import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function LandingPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Hola, soy{"\n"}Tony Chang</Text>
        <Text style={styles.subtitle}>Desarrollador Web & Diseñador</Text>
        <Text style={styles.description}>
          Desarrollador de software apasionado por crear soluciones digitales innovadoras.
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
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 10 },
  description: { fontSize: 16, color: 'white', textAlign: 'center', marginTop: 20, opacity: 0.8 }
});