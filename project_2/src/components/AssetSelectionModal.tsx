import React, { useState } from 'react';
import { View, Modal, Button, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { pickAsset } from '../utils/assetPicker';
import { SOUND_EFFECTS } from '../constants/data';
import { useAssetSelectionModal, AssetSelectionStep } from '../hooks/useAssetSelectionModal';

interface AssetSelectionModalProps {
    modal: ReturnType<typeof useAssetSelectionModal>;
    onSave: (imageUri: string, audioKey: string) => void;
    onDismiss?: () => void;
}

export function AssetSelectionModal({ modal, onSave, onDismiss }: AssetSelectionModalProps) {
    const [loading, setLoading] = useState(false);

    const handlePickImage = async () => {
        try {
            setLoading(true);
            const imageUri = await pickAsset('image');
            if (imageUri) {
                modal.setImageUri(imageUri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePickAudio = async () => {
        try {
            setLoading(true);
            const audioUri = await pickAsset('audio');
            if (audioUri) {
                modal.setAudioKey(audioUri);
            }
        } catch (error) {
            console.error('Error picking audio:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        if (modal.selectedAssets.imageUri && modal.selectedAssets.audioKey) {
            onSave(modal.selectedAssets.imageUri, modal.selectedAssets.audioKey);
            modal.close();
        }
    };

    const handleDismiss = () => {
        modal.close();
        onDismiss?.();
    };

    const renderImageSelectionStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title}>Seleccionar Imagen</Text>
            <Text style={styles.subtitle}>
                {loading ? 'Cargando imagen...' : 'Presiona para seleccionar una imagen'}
            </Text>
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
            {modal.selectedAssets.imageUri && (
                <Image
                    source={{ uri: modal.selectedAssets.imageUri }}
                    style={styles.previewImage}
                />
            )}
            <Button
                title={modal.selectedAssets.imageUri ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                onPress={handlePickImage}
                disabled={loading}
            />
        </View>
    );

    const renderAudioSelectionStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title}>Seleccionar Audio</Text>
            <Text style={styles.subtitle}>
                {loading ? 'Cargando audio...' : 'Presiona para seleccionar un audio'}
            </Text>
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
            {modal.selectedAssets.audioKey && (
                <Text style={styles.infoLabel}>
                    Audio seleccionado: {SOUND_EFFECTS[modal.selectedAssets.audioKey as keyof typeof SOUND_EFFECTS]?.title || 'Desconocido'}
                </Text>
            )}
            <Button
                title={modal.selectedAssets.audioKey ? 'Cambiar Audio' : 'Seleccionar Audio'}
                onPress={handlePickAudio}
                disabled={loading}
            />
        </View>
    );

    const renderReviewStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title}>Confirmar Selección</Text>
            {modal.selectedAssets.imageUri && (
                <Image
                    source={{ uri: modal.selectedAssets.imageUri }}
                    style={styles.previewImage}
                />
            )}
            <View style={styles.reviewInfo}>
                <Text style={styles.infoLabel}>Imagen seleccionada: ✓</Text>
                <Text style={styles.infoLabel}>
                    Audio: {SOUND_EFFECTS[modal.selectedAssets.audioKey as keyof typeof SOUND_EFFECTS]?.title || 'No seleccionado'}
                </Text>
            </View>
            <View style={styles.actionButtonsContainer}>
                <Button
                    title="Guardar"
                    onPress={handleSave}
                    disabled={loading || !modal.selectedAssets.imageUri || !modal.selectedAssets.audioKey}
                />
                <Button
                    title="Cancelar"
                    color="red"
                    onPress={handleDismiss}
                    disabled={loading}
                />
            </View>
        </View>
    );

    const renderStep = () => {
        switch (modal.currentStep) {
            case 'image':
                return renderImageSelectionStep();
            case 'audio':
                return renderAudioSelectionStep();
            case 'review':
                return renderReviewStep();
            default:
                return null;
        }
    };

    return (
        <Modal
            visible={modal.isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleDismiss}
        >
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    {renderStep()}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 12,
        padding: 24,
        minHeight: 400,
        justifyContent: 'space-between',
    },
    stepContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    loader: {
        marginVertical: 20,
    },
    previewImage: {
        width: '100%',
        height: 250,
        borderRadius: 8,
        marginBottom: 20,
    },
    thumbnailImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 20,
    },
    audioButtonsContainer: {
        gap: 10,
        marginBottom: 20,
    },
    reviewInfo: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    infoLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    actionButtonsContainer: {
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
