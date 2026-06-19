import * as DocumentPicker from 'expo-document-picker';

export type AssetFilterType = 'image' | 'audio';

export const pickAsset = async (type: AssetFilterType) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: type === 'image' ? 'image/*' : 'audio/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }
    
    return result.assets[0].uri;

  } catch (error) {
    console.error(`Error al seleccionar archivo de tipo ${type}:`, error);
    return null;
  }
};