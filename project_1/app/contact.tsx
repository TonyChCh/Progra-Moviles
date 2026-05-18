import { View, Text, StyleSheet } from 'react-native';

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contacto</Text>
      <View style={styles.card}>
        <Text style={styles.info}>✉️ example@gmail.com</Text>
        <Text style={styles.info}>📱 +506 1234 5678</Text>
      </View>
      <View style={styles.socials}>
        <Text style={styles.link}>LinkedIn</Text>
        <Text style={styles.link}>GitHub</Text>
        <Text style={styles.link}>WhatsApp</Text>
      </View>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 3 },
  info: { fontSize: 16, marginBottom: 10, color: '#333' },
  socials: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 },
  link: { color: '#007bff', fontWeight: '600' }
});