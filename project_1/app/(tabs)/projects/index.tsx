import { Text, Pressable, StyleSheet, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProjectsList() {
  const router = useRouter();

  const projects = [
    { id: '1', title: 'Tienda Online', desc: 'Interfaz E-commerce en HTML/CSS' },
    { id: '2', title: 'Sistema Biblioteca', desc: 'Gestión de datos de libros' },
    { id: '3', title: 'Blog Personal', desc: 'Diseño responsivo' }
  ];

  const renderProjectItem = ({ item }: { item: typeof projects[0] }) => (
    <Pressable 
      style={styles.card}
      onPress={() => router.push({ pathname: '/projects/[id]', params: { id: item.id } } as any)}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.desc}</Text>
      <Text style={styles.more}>Ver más →</Text>
    </Pressable>
  );


  return ( 
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  listPadding: { 
    padding: 20 
  },
  card: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 10, 
    marginBottom: 15, 
    elevation: 4,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  cardDesc: { 
    color: '#666', 
    marginVertical: 5 
  },
  more: { 
    color: '#007bff', 
    fontWeight: 'bold', 
    marginTop: 5 
  }
});