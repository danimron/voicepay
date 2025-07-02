import { useCallback, useRef, useEffect, useState } from 'react';

export interface SpeechSynthesisHook {
  speak: (text: string) => void;
  stop: () => void;
  isSupported: boolean;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const isSupported = 'speechSynthesis' in window;

  // Load voices asynchronously
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Listen for voices changed event (Chrome needs this)
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Basic settings that work reliably
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'en-US'; // Use English as it's more universally supported
      
      // Minimal error handling
      utterance.onerror = (event) => {
        console.warn('Speech failed:', event.error);
      };

      utterance.onstart = () => {
        console.log('Speaking:', text);
      };

      utteranceRef.current = utterance;
      
      // Simple delay to ensure previous speech finished
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
      
    } catch (error) {
      console.error('Speech synthesis error:', error);
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