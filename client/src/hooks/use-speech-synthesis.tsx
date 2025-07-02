import { useCallback, useRef, useState } from "react";

export interface SpeechSynthesisHook {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSupported: boolean;
  isPaused: boolean;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pausedText = useRef<string>("");

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return;

      try {
        // Stop any current speech
        if (currentUtterance.current) {
          window.speechSynthesis.cancel();
        }

        // Store text for potential resume
        pausedText.current = text;
        setIsPaused(false);

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice properties for better compatibility
        utterance.volume = 0.8;
        utterance.rate = 0.8;
        utterance.pitch = 1;

        // Try Indonesian first, fallback to default
        const voices = window.speechSynthesis.getVoices();
        const indonesianVoice = voices.find(
          (voice) => voice.lang.includes("id") || voice.lang.includes("ID"),
        );

        if (indonesianVoice) {
          utterance.voice = indonesianVoice;
          utterance.lang = "id-ID";
        } else {
          utterance.lang = "en-US";
        }

        currentUtterance.current = utterance;

        // Speak with a small delay to ensure browser is ready
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 20);
      } catch (error) {
        // Fallback: try with minimal settings
        try {
          const simpleUtterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(simpleUtterance);
        } catch (fallbackError) {
          // Silent fail - don't show errors to user
        }
      }
    },
    [isSupported],
  );

  const stop = useCallback(() => {
    if (!isSupported) return;

    try {
      window.speechSynthesis.cancel();
      currentUtterance.current = null;
      setIsPaused(false);
      pausedText.current = "";
    } catch (error) {
      // Silent fail
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;

    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsPaused(true);
      }
    } catch (error) {
      // Silent fail
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported || !isPaused || !pausedText.current) return;

    try {
      // Re-speak the paused text
      const textToResume = pausedText.current;
      speak(textToResume);
    } catch (error) {
      // Silent fail
    }
  }, [isSupported, isPaused, speak]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSupported,
    isPaused,
  };
}
