import { useEffect } from 'react';
import { Check, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { VoiceIndicator } from '@/components/voice-indicator';
import { useVoiceCommand } from '@/hooks/use-voice-command';

interface SuccessScreenProps {
  amount: number;
  onBack: () => void;
}

export function SuccessScreen({ amount, onBack }: SuccessScreenProps) {
  const { isListening, startListening, transcript } = useVoiceCommand();

  useEffect(() => {
    // Auto return to home after 3 seconds
    const timer = setTimeout(() => {
      onBack();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onBack]);

  useEffect(() => {
    if (transcript && (transcript.includes('home') || transcript.includes('menu') || transcript.includes('kembali'))) {
      onBack();
    }
  }, [transcript, onBack]);

  return (
    <div className="flex flex-col h-full text-center relative">
      <VoiceIndicator 
        isListening={isListening}
        onClick={startListening}
        instructionText="Ucapkan: kembali"
      />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="success-animation mb-3">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Check className="text-white w-6 h-6" />
          </div>
        </div>
        <h2 className="text-white font-bold text-base mb-2">Pembayaran Berhasil!</h2>
        <p className="text-gray-300 text-xs mb-3">Transaksi telah selesai</p>
        <p className="text-gray-400 text-xs mb-2">
          Nominal: <span className="text-white font-bold">{formatCurrency(amount)}</span>
        </p>
        
        {isListening && (
          <p className="text-blue-400 text-xs">🎤 Ucapkan "kembali" untuk ke menu</p>
        )}
      </div>

      <button
        onClick={onBack}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center"
      >
        <Home className="w-4 h-4 mr-2" />
        Kembali ke Menu
      </button>
    </div>
  );
}
