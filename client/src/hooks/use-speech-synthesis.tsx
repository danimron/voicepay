import { useCallback, useRef, useEffect, useState } from 'react';

export interface SpeechSynthesisHook {
  speak: (text: string) => void;
  stop: () => void;
  isSupported: boolean;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const isSupported = 'speechSynthesis' in window;

  // Initialize audio context on first user interaction
  const initializeAudio = useCallback(() => {
    if (!isSupported || audioInitialized) return;

    try {
      // Speak a silent utterance to initialize the audio context
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
      setAudioInitialized(true);
      console.log('Audio context initialized');
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
    }
  }, [isSupported, audioInitialized]);

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

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [initializeAudio]);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;

    // Initialize audio on first speak attempt if not already done
    if (!audioInitialized) {
      initializeAudio();
    }

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
      
      // Wait a bit longer for audio initialization if needed
      const delay = audioInitialized ? 100 : 500;
      setTimeout(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        window.speechSynthesis.speak(utterance);
      }, delay);
      
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  }, [isSupported, audioInitialized, initializeAudio]);

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