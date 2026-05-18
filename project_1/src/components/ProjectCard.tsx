import { Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// Definimos qué datos recibe la tarjeta
type Props = {
  project: { id: string, title: string, desc: string };
};

export default function ProjectCard({ project }: Props) {
  const router = useRouter();

  return (
    <Pressable 
      style={styles.card} 
      onPress={() => router.push({ pathname: '/projects/[id]', params: { id: project.id } } as any)}
    >
      <Text style={styles.cardTitle}>{project.title}</Text>
      <Text style={styles.cardDesc}>{project.desc}</Text>
      <Text style={styles.more}>Ver más →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDesc: { color: '#666', marginVertical: 5 },
  more: { color: '#007bff', fontWeight: 'bold', marginTop: 5 }
});