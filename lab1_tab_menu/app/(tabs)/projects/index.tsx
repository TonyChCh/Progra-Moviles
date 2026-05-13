import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProjectsList() {
  const router = useRouter();
  const projects = [
    { id: '1', title: 'Tienda Online', desc: 'Interfaz E-commerce en HTML/CSS' },
    { id: '2', title: 'Sistema Biblioteca', desc: 'Gestión de datos de libros' },
    { id: '3', title: 'Blog Personal', desc: 'Diseño responsivo' }
  ]; //

  return (
    <ScrollView style={styles.container}>
      {projects.map((p) => (
        <Pressable 
          key={p.id} 
          style={styles.card} 
          onPress={() => router.push({ pathname: '/projects/[id]', params: { id: p.id } } as any)}
        >
          <Text style={styles.cardTitle}>{p.title}</Text>
          <Text style={styles.cardDesc}>{p.desc}</Text>
          <Text style={styles.more}>Ver más →</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDesc: { color: '#666', marginVertical: 5 },
  more: { color: '#007bff', fontWeight: 'bold', marginTop: 5 }
});