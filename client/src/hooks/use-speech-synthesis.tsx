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
    if (!isSupported) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use Indonesian language
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        console.log('Voice feedback:', text);
      };

      // Remove error logging to avoid console spam
      utterance.onerror = () => {
        // Silent fail - don't log errors
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      // Silent fail
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      // Silent fail
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSupported
  };
}