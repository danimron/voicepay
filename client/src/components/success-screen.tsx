import { useEffect } from 'react';
import { Check, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { VoiceIndicator } from '@/components/voice-indicator';
import { useVoiceCommand } from '@/hooks/use-voice-command';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InsertTransaction } from "@shared/schema";

interface SuccessScreenProps {
  amount: number;
  paymentMethod: 'static' | 'dynamic' | 'tap';
  onBack: () => void;
}

export function SuccessScreen({ amount, paymentMethod, onBack }: SuccessScreenProps) {
  const { isListening, startListening, transcript } = useVoiceCommand();
  const { speak } = useSpeechSynthesis();
  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation({
    mutationFn: async (transaction: InsertTransaction) => {
      return apiRequest("POST", "/api/transactions", transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    }
  });

  useEffect(() => {
    // Save transaction to database
    createTransactionMutation.mutate({
      amount: amount.toString(),
      paymentMethod,
      status: "success"
    });

    // Voice feedback for successful payment
    const timer = setTimeout(() => {
      if (speak) {
        speak(`Pembayaran diterima sejumlah ${formatCurrency(amount)}. Terima kasih. Ucapkan kembali untuk ke menu utama.`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [amount, paymentMethod]);

  useEffect(() => {
    if (!transcript) return;
    if (transcript.includes('home') || transcript.includes('menu') || transcript.includes('kembali')) {
      onBack();
    }
  }, [transcript]);

  return (
    <div className="flex flex-col h-full text-center relative">
      <VoiceIndicator 
        isListening={isListening}
        onClick={startListening}
        instructionText="Ucapkan: kembali atau menu"
      />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="success-animation mb-3">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Check className="text-white w-6 h-6" />
          </div>
        </div>
        <h2 className="text-white font-bold text-base mb-2">Pembayaran Berhasil!</h2>
        <p className="text-gray-300 text-xs mb-3">Transaksi telah selesai</p>
        <p className="text-gray-400 text-xs mb-2">
          Nominal: <span className="text-white font-bold">{formatCurrency(amount)}</span>
        </p>
        
        {isListening && (
          <p className="text-blue-400 text-xs">🎤 Ucapkan "kembali" untuk ke menu</p>
        )}
      </div>

      <button
        onClick={onBack}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center"
      >
        <Home className="w-4 h-4 mr-2" />
        Kembali ke Menu
      </button>
    </div>
  );
}
