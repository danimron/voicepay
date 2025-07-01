import { useEffect, useCallback } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useQRGenerator } from '@/hooks/use-qr-generator';
import { VoiceIndicator } from '@/components/voice-indicator';
import { useVoiceCommand } from '@/hooks/use-voice-command';

interface StaticQRProps {
  onBack: () => void;
  onPaymentSuccess: (amount: number) => void;
}

export function StaticQR({ onBack, onPaymentSuccess }: StaticQRProps) {
  const { generateStaticQR } = useQRGenerator();
  const { isListening, startListening, transcript } = useVoiceCommand();

  const handleSimulatePayment = useCallback(() => {
    // Simulate a random payment amount for static QR
    const randomAmount = Math.floor(Math.random() * 100000) + 10000;
    onPaymentSuccess(randomAmount);
  }, [onPaymentSuccess]);

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Small delay to prevent flickering
    setTimeout(() => {
      onBack();
    }, 50);
  }, [onBack]);

  useEffect(() => {
    generateStaticQR();
  }, [generateStaticQR]);

  useEffect(() => {
    if (!transcript) return;
    if (transcript.includes('bayar')) {
      handleSimulatePayment();
    }
  }, [transcript]);

  return (
    <div className="flex flex-col h-full text-center relative">
      <VoiceIndicator 
        isListening={isListening}
        onClick={startListening}
        instructionText="Ucapkan: bayar"
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
          <p className="text-blue-400 text-xs">🎤 Ucapkan "bayar" untuk simulasi</p>
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
