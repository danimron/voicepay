import { useEffect } from 'react';
import { Check, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SuccessScreenProps {
  amount: number;
  onBack: () => void;
}

export function SuccessScreen({ amount, onBack }: SuccessScreenProps) {
  useEffect(() => {
    // Auto return to home after 3 seconds
    const timer = setTimeout(() => {
      onBack();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onBack]);

  return (
    <div className="flex flex-col h-full text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="success-animation mb-4">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
            <Check className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="text-white font-bold text-lg mb-2">Pembayaran Berhasil!</h2>
        <p className="text-gray-300 text-xs mb-4">Transaksi telah selesai</p>
        <p className="text-gray-400 text-xs">
          Nominal: <span className="text-white font-bold">{formatCurrency(amount)}</span>
        </p>
      </div>

      <button
        onClick={onBack}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl transition-all duration-200 flex items-center justify-center"
      >
        <Home className="w-4 h-4 mr-2" />
        Kembali ke Menu
      </button>
    </div>
  );
}
