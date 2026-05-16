import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  const skills = ["HTML/CSS", "Python", "Java", "Base de datos"]; //

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mi Historia</Text>
      <Text style={styles.text}>
        Soy un desarrollador de software y aplicaciones apasionado por crear soluciones digitales innovadoras.
      </Text>
      <Text style={styles.text}>
        Me especializo en desarrollo de programas digitales y disfruto transformar ideas en experiencias digitales atractivas.
      </Text>
      
      <Text style={styles.subtitle}>Habilidades</Text>
      <View style={styles.skillsGrid}>
        {skills.map(skill => (
          <View key={skill} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 30, marginBottom: 15 },
  text: { fontSize: 16, color: '#666', lineHeight: 24 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skillBadge: { backgroundColor: '#e9ecef', padding: 10, borderRadius: 5, minWidth: '45%' },
  skillText: { textAlign: 'center', fontWeight: '500' }
});