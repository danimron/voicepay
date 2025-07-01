import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Mic, Wifi } from 'lucide-react';
import { useVoiceCommand } from '@/hooks/use-voice-command';
import { formatAmount, formatCurrency } from '@/lib/utils';

interface TapPaymentProps {
  onBack: () => void;
  onPaymentSuccess: (amount: number) => void;
}

export function TapPayment({ onBack, onPaymentSuccess }: TapPaymentProps) {
  const [phase, setPhase] = useState<'input' | 'waiting'>('input');
  const [amount, setAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const { isListening, startListening, transcript } = useVoiceCommand();

  // Handle voice amount input
  useEffect(() => {
    if (transcript && phase === 'input') {
      const numbers = transcript.match(/\d+/g);
      if (numbers) {
        const voiceAmount = numbers.join('');
        if (voiceAmount.length > 0) {
          setAmount(formatAmount(voiceAmount));
        }
      }
    }
  }, [transcript, phase]);

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

  const activateNFC = () => {
    if (!amount || amount === '0') {
      alert('Silakan masukkan nominal pembayaran');
      return;
    }

    const numAmount = parseInt(amount.replace(/\D/g, ''));
    setPaymentAmount(numAmount);
    setPhase('waiting');
  };

  const handleSimulatePayment = () => {
    onPaymentSuccess(paymentAmount);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-white font-bold text-sm">QRIS Tap</h2>
        <div className="w-6"></div>
      </div>

      {phase === 'input' ? (
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-4">
            <p className="text-gray-300 text-xs mb-2">Masukkan nominal pembayaran</p>
            <div className="bg-gray-800 p-3 rounded-xl border border-gray-600">
              <span className="text-gray-400 text-xs">Rp</span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountInput}
                placeholder="0"
                className="bg-transparent text-white text-lg font-bold w-full text-center outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
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

          <div className="flex space-x-2">
            <button
              onClick={activateNFC}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl flex-1 text-sm transition-all duration-200"
            >
              Aktifkan NFC
            </button>
            <button
              onClick={startListening}
              className={`bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl transition-all duration-200 ${
                isListening ? 'button-pulse' : ''
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col text-center">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="nfc-animation mb-4">
              <Wifi className="text-green-500 w-16 h-16" />
            </div>
            <p className="text-gray-300 text-xs mb-2">
              Nominal: <span className="text-white font-bold">{formatCurrency(paymentAmount)}</span>
            </p>
            <p className="text-gray-400 text-xs">Menunggu pembayaran NFC...</p>
          </div>

          <button
            onClick={handleSimulatePayment}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-2xl transition-all duration-200 flex items-center justify-center"
          >
            <Check className="w-4 h-4 mr-2" />
            Simulasi Bayar
          </button>
        </div>
      )}
    </div>
  );
}
