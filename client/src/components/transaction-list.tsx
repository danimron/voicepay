import { useQuery } from "@tanstack/react-query";
import { SmartwatchContainer } from "./smartwatch-container";
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
        return <Smartphone className="w-4 h-4" />;
      case 'dynamic':
        return <CreditCard className="w-4 h-4" />;
      case 'tap':
        return <Zap className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
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
      <SmartwatchContainer>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm text-gray-600">Memuat transaksi...</p>
        </div>
      </SmartwatchContainer>
    );
  }

  return (
    <SmartwatchContainer>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <h1 className="text-lg font-semibold">Transaksi</h1>
          <VoiceIndicator 
            isListening={isListening} 
            onClick={startListening}
            showInstructions={false}
          />
        </div>

        {/* Transaction List */}
        <div className="flex-1 overflow-auto p-4">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Clock className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 text-sm mb-2">Belum ada transaksi</p>
              <p className="text-gray-500 text-xs">Transaksi yang berhasil akan muncul di sini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-lg border p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <span className="text-sm font-medium text-gray-800">
                        {getPaymentMethodName(transaction.paymentMethod)}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(Number(transaction.amount))}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(transaction.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
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
          <div className="p-4 border-t bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              Total {transactions.length} transaksi
            </p>
          </div>
        )}
      </div>
    </SmartwatchContainer>
  );
}