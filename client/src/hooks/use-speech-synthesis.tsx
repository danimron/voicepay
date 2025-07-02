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
      // Simple and direct approach
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Basic settings that work reliably across browsers
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';
      
      // Simple error handling without recursion
      utterance.onerror = () => {
        // Silently fail - voice feedback is nice to have but not critical
      };

      utteranceRef.current = utterance;
      
      // Speak immediately without complex initialization
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      // Silently fail - voice feedback is optional
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