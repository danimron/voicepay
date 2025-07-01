import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { ArrowLeft, Clock, CreditCard, Smartphone, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { VoiceIndicator } from "./voice-indicator";
import { useVoiceCommand } from "@/hooks/use-voice-command";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useEffect } from "react";
import type { Transaction } from "@shared/schema";

interface TransactionListProps {
  onBack: () => void;
}

export function TransactionList({ onBack }: TransactionListProps) {
  const { isListening, startListening, transcript } = useVoiceCommand();
  const { speak } = useSpeechSynthesis();

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  // Voice feedback for transaction list
  useEffect(() => {
    const timer = setTimeout(() => {
      if (speak) {
        const count = transactions?.length || 0;
        speak(`Daftar transaksi. Terdapat ${count} transaksi. Ucapkan kembali untuk ke menu utama.`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [transactions?.length]);

  // Voice command handling
  useEffect(() => {
    if (transcript.includes("kembali") || transcript.includes("back") || transcript.includes("menu")) {
      onBack();
    }
  }, [transcript, onBack]);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'static':
        return <Smartphone className="w-2.5 h-2.5" />;
      case 'dynamic':
        return <CreditCard className="w-2.5 h-2.5" />;
      case 'tap':
        return <Zap className="w-2.5 h-2.5" />;
      default:
        return <CreditCard className="w-2.5 h-2.5" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'static':
        return 'QRIS Static';
      case 'dynamic':
        return 'QRIS Dynamic';
      case 'tap':
        return 'QRIS Tap';
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mb-3"></div>
        <p className="text-xs text-gray-300">Memuat transaksi...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1 text-gray-300 hover:text-white text-[10px] h-6 px-2"
        >
          <ArrowLeft className="w-3 h-3" />
          Kembali
        </Button>
        <h1 className="text-xs font-semibold text-white">Transaksi</h1>
        <VoiceIndicator 
          isListening={isListening} 
          onClick={startListening}
          showInstructions={false}
        />
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-auto p-2 bg-gray-900">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Clock className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-gray-300 text-[10px] mb-1">Belum ada transaksi</p>
            <p className="text-gray-500 text-[8px]">Transaksi yang berhasil akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gray-800 rounded-md border border-gray-600 p-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                    <span className="text-[10px] font-medium text-gray-200">
                      {getPaymentMethodName(transaction.paymentMethod)}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-green-400">
                    {formatCurrency(Number(transaction.amount))}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-[8px] text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2 h-2" />
                    {format(new Date(transaction.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
                  </span>
                  <span className={`px-1 py-0.5 rounded-full text-[7px] font-medium ${
                    transaction.status === 'success' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {transaction.status === 'success' ? 'Berhasil' : transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer info */}
      {transactions.length > 0 && (
        <div className="p-1.5 border-t border-gray-600 bg-gray-800">
          <p className="text-[8px] text-gray-400 text-center">
            Total {transactions.length} transaksi
          </p>
        </div>
      )}
    </div>
  );
}