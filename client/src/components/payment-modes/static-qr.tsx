import { useEffect, useCallback } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useQRGenerator } from '@/hooks/use-qr-generator';
import { VoiceIndicator } from '@/components/voice-indicator';
import { useVoiceCommand } from '@/hooks/use-voice-command';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';

interface StaticQRProps {
  onBack: () => void;
  onPaymentSuccess: (amount: number) => void;
}

export function StaticQR({ onBack, onPaymentSuccess }: StaticQRProps) {
  const { generateStaticQR } = useQRGenerator();
  const { isListening, startListening, transcript } = useVoiceCommand();
  const { speak, stop } = useSpeechSynthesis();

  const handleSimulatePayment = useCallback(() => {
    // Simulate a random payment amount for static QR
    const randomAmount = Math.floor(Math.random() * 100000) + 10000;
    onPaymentSuccess(randomAmount);
  }, [onPaymentSuccess]);

  const handleBack = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Stop any ongoing speech
    stop();
    // Navigate back immediately
    onBack();
  }, [onBack, stop]);

  useEffect(() => {
    generateStaticQR();
  }, []);

  // Voice feedback when component loads (only once)
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted && speak) {
        speak('Kode QR static telah ditampilkan. Siap menerima pembayaran. Ucapkan bayar untuk simulasi.');
      }
    }, 500);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!transcript) return;
    
    // Voice command to go back
    if (transcript.includes('kembali') || transcript.includes('back') || transcript.includes('home')) {
      onBack();
      return;
    }
    
    if (transcript.includes('bayar')) {
      handleSimulatePayment();
    }
  }, [transcript, onBack, handleSimulatePayment]);

  // Cleanup effect to stop speech and clear any timers on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <div className="flex flex-col h-full text-center relative">
      <VoiceIndicator 
        isListening={isListening}
        onClick={startListening}
        instructionText="Ucapkan: bayar atau kembali"
      />
      
      <div className="flex items-center justify-between mb-3">
        <button onClick={handleBack} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-white font-bold text-sm">QRIS Static</h2>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* QR Code placeholder */}
        <div className="qr-code w-24 h-24 rounded-lg mb-3 border-2 border-gray-600"></div>
        <p className="text-gray-300 text-xs leading-relaxed mb-2">
          Silakan scan QRIS<br />untuk melakukan pembayaran
        </p>
        
        {isListening && (
          <p className="text-blue-400 text-xs">🎤 Ucapkan "bayar" atau "kembali"</p>
        )}
      </div>

      <button
        onClick={handleSimulatePayment}
        className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center"
      >
        <Check className="w-4 h-4 mr-2" />
        Simulasi Bayar
      </button>
    </div>
  );
}
