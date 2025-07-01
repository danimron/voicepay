import { useCallback } from 'react';

export interface VibrationHook {
  vibrate: (pattern?: number | number[]) => void;
  isSupported: boolean;
}

export function useVibration(): VibrationHook {
  const isSupported = 'vibrate' in navigator;

  const vibrate = useCallback((pattern: number | number[] = 200) => {
    if (isSupported) {
      navigator.vibrate(pattern);
    }
  }, [isSupported]);

  return { vibrate, isSupported };
}

// Predefined vibration patterns
export const VIBRATION_PATTERNS = {
  success: [100, 50, 100, 50, 200], // Two short bursts followed by a longer one
  error: [500], // Single long vibration
  tap: [50], // Quick tap
  notification: [200, 100, 200], // Double pulse
  payment: [150, 75, 150, 75, 300], // Payment success pattern
};