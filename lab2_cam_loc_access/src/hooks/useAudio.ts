import { useState, useRef, useEffect } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import { SOUND_EFFECTS } from '../constants/data';

export function useAppAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);


  // PLAY NEW SOUND
  const playNew = async (id: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      await stopAudio();

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: SOUND_EFFECTS[id].uri },
        { shouldPlay: true }
      );

      soundRef.current = newSound;
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          stopAudio();
        }
      });

    } catch (error) {
      console.error("Error en playNew al cargar el archivo:", error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  // PLAY / PAUSE
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
      console.error("Error al pausar/reanudar el audio:", error);
    }
  };

  // STOP AND CLEANUP
  const stopAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.error("Error al liberar el hardware de audio:", error);
      } finally {
        soundRef.current = null;
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return {
    isPlaying: isPlaying || isLoading,
    playNew,
    togglePlayPause,
    stopAudio
  };
}