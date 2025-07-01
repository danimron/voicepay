import { useState, useEffect } from 'react';
import { SmartwatchContainer } from '@/components/smartwatch-container';
import { StaticQR } from '@/components/payment-modes/static-qr';
import { DynamicQR } from '@/components/payment-modes/dynamic-qr';
import { TapPayment } from '@/components/payment-modes/tap-payment';
import { SuccessScreen } from '@/components/success-screen';
import { TransactionList } from '@/components/transaction-list';
import { VoiceIndicator } from '@/components/voice-indicator';
import { useVoiceCommand } from '@/hooks/use-voice-command';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { QrCode, DollarSign, Wifi, Mic, Receipt } from 'lucide-react';

type PaymentMode = 'home' | 'static' | 'dynamic' | 'tap' | 'success' | 'transactions';

export default function Home() {
  const [currentMode, setCurrentMode] = useState<PaymentMode>('home');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<'static' | 'dynamic' | 'tap'>('static');
  const { isListening, startListening, transcript } = useVoiceCommand();
  const { speak } = useSpeechSynthesis();

  // Handle voice commands
  useEffect(() => {
    if (transcript && currentMode === 'home') {
      const command = transcript.toLowerCase();
      if (command.includes('static') || command.includes('statik')) {
        setCurrentPaymentMethod('static');
        setCurrentMode('static');
      } else if (command.includes('dynamic') || command.includes('dinamik')) {
        setCurrentPaymentMethod('dynamic');
        setCurrentMode('dynamic');
      } else if (command.includes('tap') || command.includes('nfc')) {
        setCurrentPaymentMethod('tap');
        setCurrentMode('tap');
      } else if (command.includes('transaksi') || command.includes('riwayat') || command.includes('history')) {
        setCurrentMode('transactions');
      }
    }
  }, [transcript, currentMode]);

  const handlePaymentSuccess = (amount: number) => {
    setPaymentAmount(amount);
    setCurrentMode('success');
  };

  const goHome = () => {
    setCurrentMode('home');
    setPaymentAmount(0);
  };

  // Voice feedback for home page
  useEffect(() => {
    if (currentMode === 'home') {
      const timer = setTimeout(() => {
        if (speak) {
          speak('Pilih metode pembayaran. Ucapkan static, dynamic, atau tap untuk memilih mode pembayaran.');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentMode]);

  const renderContent = () => {
    switch (currentMode) {
      case 'static':
        return <StaticQR onBack={goHome} onPaymentSuccess={handlePaymentSuccess} />;
      case 'dynamic':
        return <DynamicQR onBack={goHome} onPaymentSuccess={handlePaymentSuccess} />;
      case 'tap':
        return <TapPayment onBack={goHome} onPaymentSuccess={handlePaymentSuccess} />;
      case 'success':
        return <SuccessScreen amount={paymentAmount} onBack={goHome} />;
      default:
        return <HomeScreen />;
    }
  };

  const HomeScreen = () => (
    <div className="flex flex-col h-full relative">
      <VoiceIndicator 
        isListening={isListening}
        onClick={startListening}
        instructionText="Ucapkan: static, dynamic, atau tap"
      />
      
      <div className="text-center mb-3">
        <h1 className="text-white text-base font-bold mb-1">SmartPay</h1>
        <p className="text-gray-400 text-xs">Pilih metode pembayaran</p>
      </div>

      {/* Voice Command Indicator */}
      {isListening && (
        <div className="text-center mb-2">
          <p className="text-blue-400 text-xs">🎤 Mendengarkan perintah...</p>
        </div>
      )}

      {/* Payment Mode Buttons */}
      <div className="flex-1 flex flex-col space-y-2">
        <button
          onClick={() => setCurrentMode('static')}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-xl flex items-center space-x-2.5 transition-all duration-200 border border-gray-600"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <QrCode className="text-white w-4 h-4" />
          </div>
          <div className="text-left flex-1">
            <div className="font-medium text-sm">QRIS Static</div>
            <div className="text-gray-400 text-xs">Kode QR tetap</div>
          </div>
        </button>

        <button
          onClick={() => setCurrentMode('dynamic')}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-xl flex items-center space-x-2.5 transition-all duration-200 border border-gray-600"
        >
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <DollarSign className="text-white w-4 h-4" />
          </div>
          <div className="text-left flex-1">
            <div className="font-medium text-sm">QRIS Dynamic</div>
            <div className="text-gray-400 text-xs">MPM dengan nominal</div>
          </div>
        </button>

        <button
          onClick={() => setCurrentMode('tap')}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-xl flex items-center space-x-2.5 transition-all duration-200 border border-gray-600"
        >
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Wifi className="text-white w-4 h-4" />
          </div>
          <div className="text-left flex-1">
            <div className="font-medium text-sm">QRIS Tap</div>
            <div className="text-gray-400 text-xs">Pembayaran NFC</div>
          </div>
        </button>
      </div>

      {/* Voice Command Text Hint */}
      <div className="text-center mt-2">
        <p className="text-gray-500 text-xs">💬 Katakan "static", "dynamic", atau "tap"</p>
      </div>
    </div>
  );

  return (
    <SmartwatchContainer>
      {renderContent()}
    </SmartwatchContainer>
  );
}
