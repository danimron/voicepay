import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { isListening, startListening, stopListening, transcript } = useVoiceCommand();
  const { speak, stop, pause, resume } = useSpeechSynthesis();

  // Generate static QRIS code with loading animation
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let completed = false;

    // Simulate loading progress
    progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + Math.random() * 20 + 10; // Random increment between 10-30
        
        if (newProgress >= 100 && !completed) {
          completed = true;
          clearInterval(progressInterval);
          
          // Complete loading after a short delay
          setTimeout(() => {
            const staticQRIS = 'QRIS.STATIC.ID.SMARTPAY.MERCHANT.001';
            setQrData(staticQRIS);
            setIsLoading(false);
            
            // Voice feedback after QR is loaded
            if (speak) {
              speak('Kode QR static telah ditampilkan. Tunjukkan kepada pembeli atau ucapkan bayar untuk simulasi pembayaran.');
            }
          }, 500);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 200);
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [speak]);

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
      stopListening();
      onBack();
      return;
    }
    
    if (transcript.includes('bayar')) {
      stopListening(); // Stop listening before proceeding to payment
      const randomAmount = Math.floor(Math.random() * 100000) + 10000;
      onPaymentSuccess(randomAmount);
    }
  }, [transcript, stop, stopListening, onBack, onPaymentSuccess]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      stopListening();
    };
  }, [stop, stopListening]);

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
        {isLoading ? (
          // Loading State
          <>
            <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-400 text-xs">Memuat QR...</p>
              </div>
            </div>
            
            {/* Loading Progress Bar */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Memuat QRIS</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <Progress value={loadingProgress} className="h-2" />
            </div>
            
            <div className="text-center">
              <p className="text-yellow-400 text-xs font-medium">⏳ Sedang memuat kode QR...</p>
            </div>
          </>
        ) : (
          // Loaded State
          <>
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
              onSpeechStop={pause}
              onSpeechResume={resume}
              showInstructions={false}
            />
            
            {isListening && (
              <p className="text-blue-400 text-xs text-center">
                🎤 Ucapkan "bayar" atau "kembali"
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}