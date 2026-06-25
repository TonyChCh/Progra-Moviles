import { SOUND_EFFECTS } from '../constants/data';

export function resolveAudioUri(audioKey: string): string | null {
  if (!audioKey) return null;
  if (SOUND_EFFECTS[audioKey]) return SOUND_EFFECTS[audioKey].uri;
  return audioKey;
}

export function getAudioLabel(audioKey: string): string {
  if (!audioKey) return 'Sin audio';
  if (SOUND_EFFECTS[audioKey]) return SOUND_EFFECTS[audioKey].title;
  return 'Audio personalizado';
}
