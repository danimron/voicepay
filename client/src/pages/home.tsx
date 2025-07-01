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
import { useIsSmartwatch } from '@/hooks/use-mobile';
import { QrCode, DollarSign, Wifi, Mic, Receipt } from 'lucide-react';

type PaymentMode = 'home' | 'static' | 'dynamic' | 'tap' | 'success' | 'transactions';

export default function Home() {
  const [currentMode, setCurrentMode] = useState<PaymentMode>('home');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<'static' | 'dynamic' | 'tap'>('static');
  const { isListening, startListening, transcript } = useVoiceCommand();
  const { speak } = useSpeechSynthesis();
  const isSmartwatch = useIsSmartwatch();

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
          speak('Pilih metode pembayaran. Ucapkan static, dynamic, tap, atau transaksi untuk melihat riwayat.');
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
        return <SuccessScreen amount={paymentAmount} paymentMethod={currentPaymentMethod} onBack={goHome} />;
      case 'transactions':
        return <TransactionList onBack={goHome} />;
      default:
        return <HomeScreen />;
    }
  };

  const HomeScreen = () => (
    <div className="flex flex-col h-full relative">
      <VoiceIndicator 
        isListening={isListening}
        onClick={startListening}
        instructionText="Ucapkan: static, dynamic, tap, atau transaksi"
      />
      
      <div className="text-center mb-2">
        <h1 className="text-white text-sm font-bold mb-0.5">SmartPay</h1>
        <p className="text-gray-400 text-[10px]">Pilih metode pembayaran</p>
      </div>

      {/* Voice Command Indicator */}
      {isListening && (
        <div className="text-center mb-2">
          <p className="text-blue-400 text-xs">🎤 Mendengarkan perintah...</p>
        </div>
      )}

      {/* Payment Mode Buttons */}
      <div className="flex-1 flex flex-col space-y-1">
        <button
          onClick={() => {
            setCurrentPaymentMethod('static');
            setCurrentMode('static');
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white p-1.5 rounded-md flex items-center space-x-1.5 transition-all duration-200 border border-gray-600"
        >
          <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
            <QrCode className="text-white w-2.5 h-2.5" />
          </div>
          <div className="text-left flex-1">
            <div className="font-medium text-[10px]">QRIS Static</div>
            <div className="text-gray-400 text-[8px]">Kode QR tetap</div>
          </div>
        </button>

        <button
          onClick={() => {
            setCurrentPaymentMethod('dynamic');
            setCurrentMode('dynamic');
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white p-1.5 rounded-md flex items-center space-x-1.5 transition-all duration-200 border border-gray-600"
        >
          <div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center">
            <DollarSign className="text-white w-2.5 h-2.5" />
          </div>
          <div className="text-left flex-1">
            <div className="font-medium text-[10px]">QRIS Dynamic</div>
            <div className="text-gray-400 text-[8px]">MPM dengan nominal</div>
          </div>
        </button>

        <button
          onClick={() => {
            setCurrentPaymentMethod('tap');
            setCurrentMode('tap');
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white p-1.5 rounded-md flex items-center space-x-1.5 transition-all duration-200 border border-gray-600"
        >
          <div className="w-5 h-5 bg-green-600 rounded-sm flex items-center justify-center">
            <Wifi className="text-white w-2.5 h-2.5" />
          </div>
          <div className="text-left flex-1">
            <div className="font-medium text-[10px]">QRIS Tap</div>
            <div className="text-gray-400 text-[8px]">Pembayaran NFC</div>
          </div>
        </button>

        <button
          onClick={() => setCurrentMode('transactions')}
          className="bg-gray-800 hover:bg-gray-700 text-white p-1.5 rounded-md flex items-center space-x-1.5 transition-all duration-200 border border-gray-600"
        >
          <div className="w-5 h-5 bg-purple-600 rounded-sm flex items-center justify-center">
            <Receipt className="text-white w-2.5 h-2.5" />
          </div>
          <div className="text-left flex-1">
            <div className="font-medium text-[10px]">Riwayat Transaksi</div>
            <div className="text-gray-400 text-[8px]">Lihat daftar transaksi</div>
          </div>
        </button>
      </div>

      {/* Voice Command Text Hint */}
      <div className="text-center mt-2">
        <p className="text-gray-500 text-xs">💬 Katakan "static", "dynamic", atau "tap"</p>
      </div>
    </div>
  );

  // Conditional rendering based on screen size
  if (isSmartwatch) {
    // For actual smartwatch (small screens), show content directly without container
    return (
      <div className="min-h-screen bg-black text-white p-2">
        {renderContent()}
      </div>
    );
  }

  // For larger screens (smartphones/tablets), show with smartwatch container for simulation
  return (
    <SmartwatchContainer>
      {renderContent()}
    </SmartwatchContainer>
  );
}
