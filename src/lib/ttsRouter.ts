export async function speak(
  text: string,
  lang: string,
  speed: number = 1,
  gender: string = 'Female'
): Promise<void> {
  if (!text || text.trim() === '') return;

  const isOnline = typeof window !== 'undefined' && window.navigator.onLine;

  if (isOnline) {
    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang, speed, gender }),
      });

      if (!response.ok) {
        throw new Error('API route returned error status');
      }

      const data = await response.json();

      if (data.fallback) {
        throw new Error('Sarvam returned fallback');
      }

      if (!data.audio) {
        throw new Error('No audio in response');
      }

      // ✅ FIXED — blob approach instead of data URI
      const byteCharacters = atob(data.audio);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Audio element failed to play'));
        };
        audio.play().catch(reject);
      });

      return; // ✅ Sarvam played successfully — stop here

    } catch (e) {
      console.warn('Sarvam TTS failed, using Web Speech fallback:', e);
      fallbackSpeak(text, lang, speed);
    }
  } else {
    console.log('Offline — using Web Speech API');
    fallbackSpeak(text, lang, speed);
  }
}

function fallbackSpeak(text: string, lang: string, speed: number): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.error('Web Speech API not supported in this browser');
    return;
  }

  window.speechSynthesis.cancel();

  const trySpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = speed;

    // Try to find a matching voice for the language
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v =>
      v.lang === lang ||
      v.lang.startsWith(lang.split('-')[0])
    );
    if (match) {
      utterance.voice = match;
      console.log('Web Speech using voice:', match.name);
    }

    window.speechSynthesis.speak(utterance);
  };

  // Voices load asynchronously — wait if not ready yet
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = trySpeak;
  } else {
    trySpeak();
  }
}