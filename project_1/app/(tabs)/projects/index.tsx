import { View, FlatList, StyleSheet } from 'react-native';
import ProjectCard from '../../../src/components/ProjectCard';
import { PROJECTS_LIST } from '../../../src/constants/data';
export default function ProjectsList() {
  return (
    <View style={styles.container}>
      <FlatList
        data={PROJECTS_LIST}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  listPadding: { padding: 20 },
});