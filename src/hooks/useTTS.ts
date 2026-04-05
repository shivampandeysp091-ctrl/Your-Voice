import { useState, useEffect } from 'react';
import { speak as routeSpeak } from '@/lib/ttsRouter';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string, lang: string, speed: number = 1, gender: string = 'Female') => {
    try {
      setIsPlaying(true);
      setError(null);
      await routeSpeak(text, lang, speed, gender);
    } catch (e: any) {
      setError(e.message || 'TTS Error');
    } finally {
      setIsPlaying(false);
    }
  };

  return { speak, isPlaying, error };
}
