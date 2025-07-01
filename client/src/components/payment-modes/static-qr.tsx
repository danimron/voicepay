import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoiceCommand } from '@/hooks/use-voice-command';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { VoiceIndicator } from '@/components/voice-indicator';
import { ArrowLeft } from 'lucide-react';
import qrImagePath from '@assets/SAVE_20250701_171530_1751365050463.jpg';

interface StaticQRProps {
  onBack: () => void;
  onPaymentSuccess: (amount: number) => void;
}

export function StaticQR({ onBack, onPaymentSuccess }: StaticQRProps) {
  const [qrData, setQrData] = useState('');
  const { isListening, startListening, stopListening, transcript } = useVoiceCommand();
  const { speak, stop } = useSpeechSynthesis();

  // Generate static QRIS code and voice feedback
  useEffect(() => {
    const staticQRIS = 'QRIS.STATIC.ID.SMARTPAY.MERCHANT.001';
    setQrData(staticQRIS);
    
    // Voice feedback with a delay
    const timer = setTimeout(() => {
      if (speak) {
        speak('Kode QR static telah ditampilkan. Tunjukkan kepada pembeli atau ucapkan bayar untuk simulasi pembayaran.');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []); // No dependencies to prevent re-runs

  const handleSimulatePayment = useCallback(() => {
    const randomAmount = Math.floor(Math.random() * 100000) + 10000;
    onPaymentSuccess(randomAmount);
  }, [onPaymentSuccess]);

  const handleBack = useCallback(() => {
    stop();
    onBack();
  }, [onBack, stop]);

  // Handle voice commands
  useEffect(() => {
    if (!transcript) return;
    
    if (transcript.includes('kembali') || transcript.includes('back') || transcript.includes('home')) {
      stop();
      onBack();
      return;
    }
    
    if (transcript.includes('bayar')) {
      const randomAmount = Math.floor(Math.random() * 100000) + 10000;
      onPaymentSuccess(randomAmount);
    }
  }, [transcript, stop, onBack, onPaymentSuccess]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <button
          onClick={handleBack}
          className="text-gray-400 hover:text-white p-1 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-medium text-white">QRIS Static</h2>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
        {/* QR Code Display */}
        <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border-2 border-gray-600 p-2">
          <img 
            src={qrImagePath} 
            alt="QRIS Static Code" 
            className="w-full h-full object-contain rounded"
          />
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-green-400 text-xs font-medium">✓ Siap Menerima Pembayaran</p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSimulatePayment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Simulasi Pembayaran
        </button>

        {/* Voice Control */}
        <VoiceIndicator
          isListening={isListening}
          onStartListening={startListening}
          onStopListening={stopListening}
          showInstructions={false}
        />
        
        {isListening && (
          <p className="text-blue-400 text-xs text-center">
            🎤 Ucapkan "bayar" atau "kembali"
          </p>
        )}
      </div>
    </div>
  );
}