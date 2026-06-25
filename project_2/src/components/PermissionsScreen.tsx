import { View, Text, Button, StyleSheet } from 'react-native';

interface PermissionsScreenProps {
  canAskAgain: boolean;
  onRequest: () => void;
}

export function PermissionsScreen({ canAskAgain, onRequest }: PermissionsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de permisos</Text>
      <Text style={styles.message}>
        {canAskAgain
          ? 'Para construir la bitácora automatizada, necesitamos acceso a la cámara y ubicación.'
          : 'El acceso fue denegado. Autorízalo manualmente desde los ajustes del teléfono.'}
      </Text>
      <Button
        title={canAskAgain ? 'Conceder permisos' : 'Abrir ajustes'}
        onPress={onRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
});
