import { useCallback } from 'react';

export interface SpeechSynthesisHook {
  speak: (text: string) => void;
  stop: () => void;
  isSupported: boolean;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    // Voice feedback disabled - just silent
    return;
  }, []);

  const stop = useCallback(() => {
    // Voice feedback disabled - just silent
    return;
  }, []);

  return {
    speak,
    stop,
    isSupported
  };
}