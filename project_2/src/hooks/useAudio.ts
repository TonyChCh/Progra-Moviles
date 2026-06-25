import { useEffect, useRef, useState } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { resolveAudioUri } from '../utils/audioResolver';

export function useAppAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const stopAudio = async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.unloadAsync();
    } catch (error) {
      console.error('Error al liberar el audio:', error);
    } finally {
      soundRef.current = null;
      setIsPlaying(false);
    }
  };

  const playNew = async (audioKey: string) => {
    if (isLoading) return;

    const uri = resolveAudioUri(audioKey);
    if (!uri) return;

    try {
      setIsLoading(true);
      await stopAudio();

      const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
      soundRef.current = sound;
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          void stopAudio();
        }
      });
    } catch (error) {
      console.error('Error reproduciendo audio:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current || isLoading) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error al pausar/reanudar:', error);
    }
  };

  useEffect(() => {
    return () => {
      void soundRef.current?.unloadAsync();
    };
  }, []);

  return {
    isPlaying: isPlaying || isLoading,
    playNew,
    togglePlayPause,
    stopAudio,
  };
}
