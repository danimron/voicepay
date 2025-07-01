import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoiceCommand } from '@/hooks/use-voice-command';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { VoiceIndicator } from '@/components/voice-indicator';
import { ArrowLeft } from 'lucide-react';

interface StaticQRProps {
  onBack: () => void;
  onPaymentSuccess: (amount: number) => void;
}

export function StaticQR({ onBack, onPaymentSuccess }: StaticQRProps) {
  const [qrData, setQrData] = useState('');
  const { isListening, startListening, transcript } = useVoiceCommand();
  const { speak, stop } = useSpeechSynthesis();

  // Generate static QRIS code
  useEffect(() => {
    const staticQRIS = 'QRIS.STATIC.ID.SMARTPAY.MERCHANT.001';
    setQrData(staticQRIS);
    
    // Voice feedback
    const timer = setTimeout(() => {
      speak('Kode QR static telah ditampilkan. Tunjukkan kepada pembeli atau ucapkan bayar untuk simulasi pembayaran.');
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
      handleBack();
      return;
    }
    
    if (transcript.includes('bayar')) {
      handleSimulatePayment();
    }
  }, [transcript, handleBack, handleSimulatePayment]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">QRIS Static</CardTitle>
            <div className="w-8" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white dark:bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-2xl font-bold mb-2">📱</div>
                <div className="text-sm font-semibold mb-2">QRIS Static</div>
                <div className="text-xs text-gray-600 break-all">
                  {qrData || 'Loading...'}
                </div>
                <div className="text-xs text-green-600 mt-2 font-medium">
                  Siap Menerima Pembayaran
                </div>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="space-y-3">
            <Button 
              onClick={handleSimulatePayment}
              className="w-full"
              size="lg"
            >
              Simulasi Pembayaran
            </Button>
            
            {/* Voice Control */}
            <VoiceIndicator
              isListening={isListening}
              onClick={startListening}
              showInstructions={true}
              instructionText="Ucapkan 'bayar' untuk simulasi atau 'kembali' untuk kembali ke menu"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}