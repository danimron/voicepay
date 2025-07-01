import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceIndicator } from '@/components/voice-indicator';
import { ArrowLeft } from 'lucide-react';

interface StaticQRProps {
  onBack: () => void;
  onPaymentSuccess: (amount: number) => void;
}

export function StaticQR({ onBack, onPaymentSuccess }: StaticQRProps) {
  const [qrData, setQrData] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Simple QR generation without hooks
  useEffect(() => {
    const staticData = {
      version: '01',
      type: '11',
      merchant: 'SMARTPAY_MERCHANT',
      id: 'ID.CO.QRIS.WWW',
      category: '5411',
      currency: '360',
      country: 'ID',
      name: 'SmartPay Merchant',
      city: 'Jakarta'
    };
    
    const qrString = JSON.stringify(staticData);
    setQrData(qrString);
  }, []);

  const handleSimulatePayment = useCallback(() => {
    const randomAmount = Math.floor(Math.random() * 100000) + 10000;
    onPaymentSuccess(randomAmount);
  }, [onPaymentSuccess]);

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  const startListening = useCallback(() => {
    setIsListening(true);
    // Simple timeout to simulate voice listening
    setTimeout(() => setIsListening(false), 3000);
  }, []);

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
              <div className="text-center">
                <div className="text-xs font-mono break-all p-2">
                  {qrData || 'Loading...'}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  QR Code Static
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