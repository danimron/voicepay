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
      // Cancel any current speech
      window.speechSynthesis.cancel();
      
      // Small delay to ensure clean start
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Use Indonesian language like in original working version
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        utterance.onstart = () => {
          console.log('Voice feedback:', text);
        };

        utterance.onerror = (event) => {
          console.warn('Voice feedback error:', event.error);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }, 100);
      
    } catch (error) {
      console.warn('Voice feedback failed:', error);
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