import { useCallback, useRef } from 'react';

export interface SpeechSynthesisHook {
  speak: (text: string) => void;
  stop: () => void;
  isSupported: boolean;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      console.warn('Speech synthesis not supported');
      return;
    }

    try {
      // Stop any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; // Indonesian language
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Add error handling
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
      };

      utterance.onstart = () => {
        console.log('Speech started:', text);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Failed to speak:', error);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
  }, [isSupported]);

  return {
    speak,
    stop,
    isSupported
  };
}