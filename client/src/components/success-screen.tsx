import { useEffect, useState } from 'react';
import { Check, Home, Sparkles, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { VoiceIndicator } from '@/components/voice-indicator';
import { useVoiceCommand } from '@/hooks/use-voice-command';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { useVibration, VIBRATION_PATTERNS } from '@/hooks/use-vibration';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InsertTransaction } from "@shared/schema";

interface SuccessScreenProps {
  amount: number;
  paymentMethod: 'static' | 'dynamic' | 'tap';
  onBack: () => void;
}

export function SuccessScreen({ amount, paymentMethod, onBack }: SuccessScreenProps) {
  const { isListening, startListening, stopListening, transcript } = useVoiceCommand();
  const { speak } = useSpeechSynthesis();
  const { vibrate } = useVibration();
  const queryClient = useQueryClient();
  const [showCelebration, setShowCelebration] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

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

    // Start simplified celebration animations
    setShowCelebration(true);
    
    // Simplified animation sequence
    const animationSequence = async () => {
      // Phase 1: Show check mark
      setAnimationPhase(1);
      
      // Immediate vibration for payment success
      vibrate(VIBRATION_PATTERNS.payment);
      
      // Phase 2: Add glow effect
      setTimeout(() => setAnimationPhase(2), 300);
      
      // Voice feedback for successful payment
      setTimeout(() => {
        if (speak) {
          speak(`Pembayaran diterima sejumlah ${formatCurrency(amount)}. Terima kasih.`);
        }
      }, 500);
    };

    animationSequence();
  }, [amount, paymentMethod, vibrate, speak]);

  useEffect(() => {
    if (!transcript) return;
    if (transcript.includes('home') || transcript.includes('menu') || transcript.includes('kembali')) {
      stopListening(); // Stop listening before going back
      onBack();
    }
  }, [transcript, onBack, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening(); // Stop listening when component unmounts
    };
  }, [stopListening]);

  // Simplified celebration - just confetti around edges
  const CelebrationParticles = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Simple confetti particles - fewer and positioned at edges */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            ['bg-yellow-400', 'bg-green-400', 'bg-blue-400'][i % 3]
          }`}
          style={{
            left: i < 3 ? '5%' : '95%',
            top: `${20 + (i % 3) * 20}%`,
            animation: `celebration-float ${2 + (i % 2) * 0.5}s ease-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );

  const AnimatedSuccessIcon = () => (
    <div className="relative flex items-center justify-center">
      <Check 
        className={`text-green-500 transition-all duration-500 ${
          animationPhase >= 1 ? 'w-16 h-16 opacity-100 scale-100' : 'w-8 h-8 opacity-0 scale-75'
        }`}
        style={{
          filter: animationPhase >= 2 ? 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))' : 'none',
        }}
      />
      
      {/* Simple ripple effect */}
      {animationPhase >= 2 && (
        <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-50" />
      )}
    </div>
  );

  const PulsingAmount = () => (
    <div className="text-center">
      <span className="font-bold text-lg text-green-400">
        {formatCurrency(amount)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col h-full text-center relative">
      <VoiceIndicator 
        isListening={isListening}
        onStartListening={startListening}
        onStopListening={stopListening}
        instructionText="Ucapkan: kembali"
      />
      
      {/* Simplified celebration particles */}
      {showCelebration && <CelebrationParticles />}
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-3 px-2">
        <AnimatedSuccessIcon />
        
        <h2 className="text-white font-bold text-sm">
          Pembayaran Berhasil!
        </h2>
        
        <PulsingAmount />
        
        {isListening && (
          <p className="text-blue-400 text-xs">🎤 Ucapkan "kembali"</p>
        )}
      </div>

      <button
        onClick={onBack}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center mx-2 mb-2"
      >
        <Home className="w-3 h-3 mr-1" />
        <span className="text-xs">Kembali</span>
      </button>
    </div>
  );
}
