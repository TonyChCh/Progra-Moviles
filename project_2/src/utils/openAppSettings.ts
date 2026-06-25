import { Linking, Platform } from 'react-native';

export function openAppSettings(): void {
  if (Platform.OS === 'ios') {
    void Linking.openURL('app-settings:');
    return;
  }
  void Linking.openSettings();
}
