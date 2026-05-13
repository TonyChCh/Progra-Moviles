import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  
  // Diccionario simple para mostrar contenido según ID
  const details: any = {
    '1': { name: 'Tienda Online', tech: 'HTML5, CSS3, JavaScript' },
    '2': { name: 'Sistema Biblioteca', tech: 'Java, MySQL' },
    '3': { name: 'Blog Personal', tech: 'React Native, Expo' },
  };

  const project = details[id as string] || { name: 'Proyecto', tech: 'N/A' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{project.name}</Text>
      <Text style={styles.subtitle}>ID del Proyecto: {id}</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Tecnologías usadas:</Text>
        <Text style={styles.tech}>{project.tech}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#999', marginBottom: 20 },
  content: { width: '100%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  tech: { fontSize: 16, color: '#007bff' }
});