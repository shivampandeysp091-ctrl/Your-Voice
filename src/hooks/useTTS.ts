import { useState, useEffect } from 'react';
import { speak as routeSpeak } from '@/lib/ttsRouter';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string, lang: string, speed?: number, gender?: string) => {
    try {
      setIsPlaying(true);
      setError(null);
      
      const finalSpeed = speed !== undefined ? speed : (Number(localStorage.getItem('yv-speed')) || 1);
      const finalGender = gender !== undefined ? gender : (localStorage.getItem('yv-gender') || 'Female');

      await routeSpeak(text, lang, finalSpeed, finalGender);
    } catch (e: any) {
      setError(e.message || 'TTS Error');
    } finally {
      setIsPlaying(false);
    }
  };

  return { speak, isPlaying, error };
}
