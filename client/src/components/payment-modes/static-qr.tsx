import { useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useQRGenerator } from '@/hooks/use-qr-generator';

interface StaticQRProps {
  onBack: () => void;
  onPaymentSuccess: (amount: number) => void;
}

export function StaticQR({ onBack, onPaymentSuccess }: StaticQRProps) {
  const { generateStaticQR } = useQRGenerator();

  useEffect(() => {
    generateStaticQR();
  }, [generateStaticQR]);

  const handleSimulatePayment = () => {
    // Simulate a random payment amount for static QR
    const randomAmount = Math.floor(Math.random() * 100000) + 10000;
    onPaymentSuccess(randomAmount);
  };

  return (
    <div className="flex flex-col h-full text-center">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-white font-bold">QRIS Static</h2>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* QR Code placeholder */}
        <div className="qr-code w-32 h-32 rounded-lg mb-4 border-2 border-gray-600"></div>
        <p className="text-gray-300 text-xs leading-relaxed">
          Silakan scan QRIS<br />untuk melakukan pembayaran
        </p>
      </div>

      <button
        onClick={handleSimulatePayment}
        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-2xl mt-4 transition-all duration-200 flex items-center justify-center"
      >
        <Check className="w-4 h-4 mr-2" />
        Simulasi Bayar
      </button>
    </div>
  );
}
