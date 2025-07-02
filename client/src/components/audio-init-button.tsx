import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface AudioInitButtonProps {
  onAudioInitialized?: () => void;
}

export function AudioInitButton({ onAudioInitialized }: AudioInitButtonProps) {
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeAudio = async () => {
    setIsInitializing(true);
    
    try {
      // Try to initialize speech synthesis
      const utterance = new SpeechSynthesisUtterance('Audio activated');
      utterance.volume = 0.5;
      utterance.rate = 0.8;
      utterance.lang = 'en-US';
      
      utterance.onstart = () => {
        console.log('Audio successfully initialized');
        onAudioInitialized?.();
      };
      
      utterance.onerror = (event) => {
        console.warn('Audio initialization failed:', event.error);
      };
      
      window.speechSynthesis.speak(utterance);
      
      // Hide button after attempt
      setTimeout(() => {
        setIsInitializing(false);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setIsInitializing(false);
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Button
        onClick={handleInitializeAudio}
        disabled={isInitializing}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-sm"
      >
        <Volume2 className="w-4 h-4" />
        {isInitializing ? 'Activating...' : 'Enable Voice Feedback'}
      </Button>
    </div>
  );
}