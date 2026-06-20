import { useState, useCallback } from 'react';

export type AssetSelectionStep = 'image' | 'audio' | 'review';

interface SelectedAssets {
    imageUri: string | null;
    audioKey: string | null;
}

export function useAssetSelectionModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState<AssetSelectionStep>('image');
    const [selectedAssets, setSelectedAssets] = useState<SelectedAssets>({
        imageUri: null,
        audioKey: null,
    });

    const open = useCallback(() => {
        setIsVisible(true);
        setCurrentStep('image');
        setSelectedAssets({ imageUri: null, audioKey: null });
    }, []);

    const close = useCallback(() => {
        setIsVisible(false);
        setSelectedAssets({ imageUri: null, audioKey: null });
    }, []);

    const setImageUri = useCallback((uri: string) => {
        setSelectedAssets(prev => ({ ...prev, imageUri: uri }));
        setCurrentStep('audio');
    }, []);

    const setAudioKey = useCallback((audioKey: string) => {
        setSelectedAssets(prev => ({ ...prev, audioKey }));
        setCurrentStep('review');
    }, []);

    const reset = useCallback(() => {
        setCurrentStep('image');
        setSelectedAssets({ imageUri: null, audioKey: null });
    }, []);

    return {
        isVisible,
        currentStep,
        selectedAssets,
        open,
        close,
        setImageUri,
        setAudioKey,
        reset,
    };
}
