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
  const { isListening, startListening, transcript } = useVoiceCommand();
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

    // Start celebration animations sequence
    setShowCelebration(true);
    
    // Animation sequence with multiple phases
    const animationSequence = async () => {
      // Phase 1: Initial success check animation
      setAnimationPhase(1);
      
      // Immediate vibration for payment success
      vibrate(VIBRATION_PATTERNS.payment);
      
      // Phase 2: Celebration burst effects
      setTimeout(() => setAnimationPhase(2), 300);
      
      // Phase 3: Sparkle and confetti effects
      setTimeout(() => setAnimationPhase(3), 800);
      
      // Voice feedback for successful payment
      setTimeout(() => {
        if (speak) {
          speak(`Pembayaran diterima sejumlah ${formatCurrency(amount)}. Terima kasih. Ucapkan kembali untuk ke menu utama.`);
        }
      }, 1000);
      
      // Phase 4: Settle into final celebration state
      setTimeout(() => setAnimationPhase(4), 2500);
    };

    animationSequence();
  }, [amount, paymentMethod, vibrate, speak]);

  useEffect(() => {
    if (!transcript) return;
    if (transcript.includes('home') || transcript.includes('menu') || transcript.includes('kembali')) {
      onBack();
    }
  }, [transcript]);

  // Celebration components
  const CelebrationParticles = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Enhanced confetti particles with floating animation */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${
            ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-red-400'][i % 6]
          }`}
          style={{
            left: `${10 + (i * 5)}%`,
            top: `${15 + (i % 5) * 12}%`,
            animation: `celebration-float ${2 + (i % 3) * 0.5}s ease-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
      
      {/* Enhanced sparkle effects with sparkle animation */}
      {animationPhase >= 3 && Array.from({ length: 10 }).map((_, i) => (
        <Sparkles
          key={`sparkle-${i}`}
          className="absolute text-yellow-300"
          size={14 + (i % 3) * 6}
          style={{
            left: `${10 + (i * 8)}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `celebration-sparkle ${1.5 + (i % 2) * 0.5}s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      
      {/* Enhanced star burst with bounce animation */}
      {animationPhase >= 2 && Array.from({ length: 8 }).map((_, i) => (
        <Star
          key={`star-${i}`}
          className="absolute text-yellow-400"
          size={10 + (i % 3) * 4}
          style={{
            left: `${25 + (i * 7)}%`,
            top: `${18 + (i % 3) * 20}%`,
            animation: `celebration-bounce ${1.2 + (i % 2) * 0.3}s ease-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
      
      {/* Additional floating hearts for extra celebration */}
      {animationPhase >= 4 && Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`heart-${i}`}
          className="absolute text-pink-400 text-lg"
          style={{
            left: `${20 + (i * 12)}%`,
            top: `${30 + (i % 2) * 25}%`,
            animation: `celebration-float ${2.5 + (i % 2) * 0.5}s ease-out ${i * 0.2}s infinite`,
          }}
        >
          💖
        </div>
      ))}
    </div>
  );

  const AnimatedSuccessIcon = () => (
    <div className="relative">
      <div 
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${
          animationPhase >= 1 
            ? 'bg-green-500 scale-100 rotate-0' 
            : 'bg-gray-600 scale-75 rotate-45'
        }`}
        style={{
          animation: animationPhase >= 2 ? 'success-glow 3s ease-in-out infinite' : 'none',
        }}
      >
        <Check 
          className={`text-white transition-all duration-500 ${
            animationPhase >= 1 ? 'w-10 h-10 opacity-100' : 'w-4 h-4 opacity-0'
          }`} 
        />
      </div>
      
      {/* Enhanced ripple effects */}
      {animationPhase >= 2 && (
        <>
          <div className="absolute inset-0 rounded-full border-3 border-green-400 animate-ping opacity-75" />
          <div 
            className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-50"
            style={{ animationDelay: '0.3s' }}
          />
          <div 
            className="absolute inset-0 rounded-full border-1 border-green-200 animate-ping opacity-25"
            style={{ animationDelay: '0.6s' }}
          />
        </>
      )}
      
      {/* Success burst particles around the icon */}
      {animationPhase >= 3 && Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`burst-${i}`}
          className="absolute w-2 h-2 bg-green-300 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-40px)`,
            animation: `celebration-sparkle 1s ease-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
    </div>
  );

  const PulsingAmount = () => (
    <div 
      className={`text-center transition-all duration-700 ${
        animationPhase >= 3 
          ? 'scale-110' 
          : 'scale-100'
      }`}
    >
      <span 
        className="font-bold text-xl"
        style={{
          animation: animationPhase >= 3 ? 'amount-highlight 2s ease-in-out infinite' : 'none',
        }}
      >
        {formatCurrency(amount)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col h-full text-center relative overflow-hidden">
      <VoiceIndicator 
        isListening={isListening}
        onClick={startListening}
        instructionText="Ucapkan: kembali atau menu"
      />
      
      {/* Celebration particles overlay */}
      {showCelebration && <CelebrationParticles />}
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="mb-4">
          <AnimatedSuccessIcon />
        </div>
        
        <h2 
          className={`font-bold text-base mb-3 transition-all duration-500 ${
            animationPhase >= 1 
              ? 'text-white scale-100 opacity-100' 
              : 'text-gray-500 scale-75 opacity-50'
          }`}
        >
          Pembayaran Berhasil! 🎉
        </h2>
        
        <p 
          className={`text-gray-300 text-xs mb-3 transition-all duration-700 ${
            animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Transaksi telah selesai dengan sukses
        </p>
        
        <div 
          className={`mb-4 transition-all duration-700 ${
            animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-gray-400 text-xs mb-1">Nominal Pembayaran:</p>
          <PulsingAmount />
        </div>
        
        {isListening && (
          <p className="text-blue-400 text-xs animate-pulse">🎤 Ucapkan "kembali" untuk ke menu</p>
        )}
      </div>

      <button
        onClick={onBack}
        className={`text-white p-2.5 rounded-xl transition-all duration-500 flex items-center justify-center ${
          animationPhase >= 4 
            ? 'bg-blue-600 hover:bg-blue-700 scale-100 opacity-100' 
            : 'bg-gray-700 scale-95 opacity-75'
        }`}
      >
        <Home className="w-4 h-4 mr-2" />
        Kembali ke Menu
      </button>
    </div>
  );
}
