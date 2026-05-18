import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MY_SKILLS } from '../../src/constants/data';

export default function AboutScreen() {

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mi Historia</Text>
      <Text style={styles.text}> 
        Soy un desarrollador de software y aplicaciones apasionado por crear soluciones digitales innovadoras.
        {"\n"}Me especializo en desarrollo de programas digitales y disfruto transformar ideas en experiencias digitales atractivas.
      </Text>
      
      <Text style={styles.subtitle}>Habilidades</Text>
      <View style={styles.skillsGrid}>
        {MY_SKILLS.map((skill) => (
          <View key={skill.name} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill.name}</Text>
            <Text style={styles.skillLevel}>{skill.level}</Text>
          </View>
        ))}
      </View>
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 26, fontWeight: '600', marginTop: 30, marginBottom: 15 },
  text: { fontSize: 19, color: '#666', lineHeight: 24 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skillBadge: { backgroundColor: '#e9ecef', padding: 10, borderRadius: 5, minWidth: '48%' },
  skillText: { textAlign: 'center', fontSize: 20, fontWeight: '500' },
  skillLevel: { textAlign: 'center', fontSize: 17, color: '#999' }
});