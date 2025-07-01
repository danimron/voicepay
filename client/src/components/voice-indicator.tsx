import { Mic } from 'lucide-react';

interface VoiceIndicatorProps {
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  showInstructions?: boolean;
  instructionText?: string;
}

export function VoiceIndicator({ 
  isListening = false, 
  onStartListening, 
  onStopListening,
  showInstructions = true,
  instructionText = "Tekan mic atau ucapkan perintah"
}: VoiceIndicatorProps) {
  const handleClick = () => {
    if (isListening && onStopListening) {
      onStopListening();
    } else if (!isListening && onStartListening) {
      onStartListening();
    }
  };

  return (
    <div className={isListening ? "voice-indicator-floating" : "voice-indicator-normal"}>
      <button
        onClick={handleClick}
        className={`p-1 rounded-full transition-all duration-200 ${
          isListening ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        title={instructionText}
      >
        <Mic className={`w-3 h-3 text-white ${isListening ? 'voice-indicator' : ''}`} />
      </button>
      {showInstructions && (
        <div className="absolute top-full right-0 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {instructionText}
        </div>
      )}
    </div>
  );
}