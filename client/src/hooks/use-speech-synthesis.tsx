import { useCallback, useRef, useEffect } from 'react';

export interface SpeechSynthesisHook {
  speak: (text: string) => void;
  stop: () => void;
  isSupported: boolean;
  testSpeak: () => void;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = 'speechSynthesis' in window;
  const isInitialized = useRef(false);

  // Debug: check voices available
  useEffect(() => {
    if (isSupported) {
      const checkVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
        const indonesianVoices = voices.filter(v => v.lang.includes('id'));
        console.log('Indonesian voices:', indonesianVoices.length);
      };
      
      checkVoices();
      window.speechSynthesis.addEventListener('voiceschanged', checkVoices);
      
      return () => window.speechSynthesis.removeEventListener('voiceschanged', checkVoices);
    }
  }, [isSupported]);

  const testSpeak = useCallback(() => {
    if (!isSupported) {
      console.log('Speech synthesis not supported');
      return;
    }

    console.log('Activating voice feedback...');
    
    // Initialize speech synthesis with user interaction
    isInitialized.current = true;
    
    // Use simple English text for better compatibility
    const utterance = new SpeechSynthesisUtterance('Voice feedback activated');
    utterance.lang = 'en-US'; // Use English for better compatibility
    utterance.volume = 1;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => console.log('✓ Voice feedback is now working');
    utterance.onend = () => console.log('✓ Voice system ready');
    utterance.onerror = (e) => console.log('✗ Voice error:', e.error, e.type);
    
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      console.log('Speech not supported');
      return;
    }

    // Only speak if user has initialized speech synthesis first
    if (!isInitialized.current) {
      console.log('Speech not initialized. Click green mic button first to enable voice feedback.');
      return;
    }

    console.log('Attempting to speak:', text);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Use English for better compatibility
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1; // Max volume

    utterance.onstart = () => {
      console.log('✓ Speech started:', text);
    };

    utterance.onend = () => {
      console.log('✓ Speech ended');
    };

    utterance.onerror = (event) => {
      console.log('✗ Speech error:', event.error);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
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
    isSupported,
    testSpeak
  };
}