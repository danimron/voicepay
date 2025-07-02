import { useState, useCallback } from 'react';

export interface SpeechSynthesisHook {
  speak: (text: string) => void;
  stop: () => void;
  isSupported: boolean;
  isEnabled: boolean;
  enableVoice: () => Promise<boolean>;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [isEnabled, setIsEnabled] = useState(false);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const enableVoice = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.log('Speech synthesis not supported');
      return false;
    }

    try {
      // Test speech to activate voices
      const test = new SpeechSynthesisUtterance('Voice enabled');
      test.volume = 0.1; // Very quiet test
      test.rate = 2; // Very fast test
      
      return new Promise((resolve) => {
        test.onstart = () => {
          console.log('✓ Voice system activated');
          setIsEnabled(true);
          resolve(true);
        };
        
        test.onerror = () => {
          console.log('✗ Voice activation failed');
          resolve(false);
        };
        
        test.onend = () => {
          if (!isEnabled) {
            setIsEnabled(true);
            resolve(true);
          }
        };
        
        window.speechSynthesis.speak(test);
        
        // Fallback timeout
        setTimeout(() => {
          if (!isEnabled) {
            console.log('✓ Voice activated (fallback)');
            setIsEnabled(true);
            resolve(true);
          }
        }, 1000);
      });
    } catch (error) {
      console.log('Voice activation error:', error);
      return false;
    }
  }, [isSupported, isEnabled]);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;
    if (!isEnabled) {
      console.log('Voice not enabled. Click green button first.');
      return;
    }

    try {
      // Clear any existing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 0.8;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.log('Speech error:', error);
    }
  }, [isSupported, isEnabled]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      // Silent fail
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSupported,
    isEnabled,
    enableVoice
  };
}