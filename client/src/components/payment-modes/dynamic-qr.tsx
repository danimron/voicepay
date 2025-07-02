import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, Mic } from 'lucide-react';
import { useQRGenerator } from '@/hooks/use-qr-generator';
import { useVoiceCommand } from '@/hooks/use-voice-command';
import { VoiceIndicator } from '@/components/voice-indicator';
import { formatAmount, formatCurrency } from '@/lib/utils';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { useVibration, VIBRATION_PATTERNS } from '@/hooks/use-vibration';

interface DynamicQRProps {
  onBack: () => void;
  onPaymentSuccess: (amount: number) => void;
}

export function DynamicQR({ onBack, onPaymentSuccess }: DynamicQRProps) {
  const [phase, setPhase] = useState<'input' | 'display'>('input');
  const [amount, setAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const { generateDynamicQR } = useQRGenerator();
  const { isListening, startListening, stopListening, transcript } = useVoiceCommand();
  const { speak } = useSpeechSynthesis();
  const { vibrate } = useVibration();

  const handleSimulatePayment = useCallback(() => {
    onPaymentSuccess(paymentAmount);
  }, [onPaymentSuccess, paymentAmount]);

  const handleBack = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onBack();
  }, [onBack]);

  const generateQR = useCallback(() => {
    if (!amount || amount === '0') {
      alert('Silakan masukkan nominal pembayaran');
      return;
    }

    const numAmount = parseInt(amount.replace(/\D/g, ''));
    setPaymentAmount(numAmount);
    generateDynamicQR(numAmount);
    setPhase('display');
    
    // Voice feedback when QR is generated
    setTimeout(() => {
      speak('Kode QR dynamic telah ditampilkan. Siap menerima pembayaran. Ucapkan bayar untuk simulasi.');
    }, 500);
  }, [amount, generateDynamicQR, speak]);

  // Handle voice amount input and commands
  useEffect(() => {
    if (!transcript) return;
    
    // Voice command to go back
    if (transcript.includes('kembali') || transcript.includes('back') || transcript.includes('home')) {
      handleBack();
      return;
    }
    
    if (phase === 'input') {
      const numbers = transcript.match(/\d+/g);
      if (numbers) {
        const voiceAmount = numbers.join('');
        if (voiceAmount.length > 0) {
          setAmount(formatAmount(voiceAmount));
        }
      }
      // Voice command to generate QR
      if (transcript.includes('generate') || transcript.includes('buat') || transcript.includes('qr')) {
        generateQR();
      }
    } else if (phase === 'display' && transcript.includes('bayar')) {
      handleSimulatePayment();
    }
  }, [transcript]);

  // Initial voice feedback when component loads
  useEffect(() => {
    if (phase === 'input') {
      const timer = setTimeout(() => {
        if (speak) {
          speak('Masukkan nominal pembayaran atau buat QR. Ucapkan nominal angka kemudian buat QR.');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, speak]);

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value) {
      setAmount(formatAmount(value));
    } else {
      setAmount('');
    }
  };

  const setQuickAmount = (value: string) => {
    setAmount(formatAmount(value));
  };



  return (
    <div className="flex flex-col h-full relative">
      <VoiceIndicator 
        isListening={isListening}
        onStartListening={startListening}
        onStopListening={stopListening}
        onSpeechStop={stop}
        instructionText={phase === 'input' ? "Ucapkan nominal, 'buat QR', atau 'kembali'" : "Ucapkan: bayar atau kembali"}
      />
      
      <div className="flex items-center justify-between mb-3">
        <button onClick={handleBack} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-white font-bold text-sm">QRIS Dynamic</h2>
        <div className="w-6"></div>
      </div>

      {phase === 'input' ? (
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-3">
            <p className="text-gray-300 text-xs mb-2">Masukkan nominal pembayaran</p>
            <div className="bg-gray-800 p-2.5 rounded-xl border border-gray-600">
              <span className="text-gray-400 text-xs">Rp</span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountInput}
                placeholder="0"
                className="bg-transparent text-white text-base font-bold w-full text-center outline-none"
              />
            </div>
          </div>

          {isListening && (
            <div className="text-center mb-2">
              <p className="text-blue-400 text-xs">🎤 Sebutkan nominal, "buat QR", atau "kembali"</p>
            </div>
          )}

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => setQuickAmount('10000')}
              className="bg-gray-800 text-white text-xs p-2 rounded-lg border border-gray-600 hover:bg-gray-700"
            >
              10K
            </button>
            <button
              onClick={() => setQuickAmount('25000')}
              className="bg-gray-800 text-white text-xs p-2 rounded-lg border border-gray-600 hover:bg-gray-700"
            >
              25K
            </button>
            <button
              onClick={() => setQuickAmount('50000')}
              className="bg-gray-800 text-white text-xs p-2 rounded-lg border border-gray-600 hover:bg-gray-700"
            >
              50K
            </button>
          </div>

          <button
            onClick={generateQR}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-sm transition-all duration-200"
          >
            Generate QR
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col text-center">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="qr-code w-24 h-24 rounded-lg mb-2 border-2 border-gray-600"></div>
            <p className="text-gray-300 text-xs mb-2">
              Nominal: <span className="text-white font-bold">{formatCurrency(paymentAmount)}</span>
            </p>
            <p className="text-gray-400 text-xs mb-2">Scan untuk membayar</p>
            
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
      )}
    </div>
  );
}
