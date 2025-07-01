import { ArrowLeft, Mic, QrCode, Smartphone, Volume2 } from 'lucide-react';
import { VoiceIndicator } from '@/components/voice-indicator';
import { useVoiceCommand } from '@/hooks/use-voice-command';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { useEffect } from 'react';

interface HelpScreenProps {
  onBack: () => void;
}

export function HelpScreen({ onBack }: HelpScreenProps) {
  const { isListening, startListening, stopListening, transcript } = useVoiceCommand();
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    if (!transcript) return;
    if (transcript.includes('kembali') || transcript.includes('menu') || transcript.includes('home')) {
      onBack();
    }
  }, [transcript, onBack]);

  // Initial voice feedback when component loads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (speak) {
        speak('Halaman bantuan VoicePay. Pelajari cara menggunakan aplikasi dan fitur suara.');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <div className="flex flex-col h-full relative">
      <VoiceIndicator 
        isListening={isListening}
        onStartListening={startListening}
        onStopListening={stopListening}
        instructionText="Ucapkan: kembali"
      />
      
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        <div className="text-center mb-3">
          <h1 className="text-white text-sm font-bold mb-1">Bantuan VoicePay</h1>
          <p className="text-gray-400 text-xs">Panduan dan F.A.Q</p>
        </div>

        {/* Cara Kerja Aplikasi */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-600">
          <h2 className="text-white text-xs font-semibold mb-2 flex items-center">
            <Smartphone className="w-3 h-3 mr-1" />
            Cara Kerja Aplikasi
          </h2>
          <div className="space-y-1.5 text-xs text-gray-300">
            <p>1. <strong>QRIS Static:</strong> Tampilkan QR code tetap untuk pelanggan</p>
            <p>2. <strong>QRIS Dynamic:</strong> Buat QR dengan nominal spesifik</p>
            <p>3. <strong>QRIS Tap:</strong> Simulasi pembayaran NFC</p>
            <p>4. <strong>Riwayat:</strong> Lihat transaksi yang tersimpan</p>
          </div>
        </div>

        {/* Voice Commands */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-600">
          <h2 className="text-white text-xs font-semibold mb-2 flex items-center">
            <Mic className="w-3 h-3 mr-1" />
            Perintah Suara
          </h2>
          <div className="space-y-1 text-xs text-gray-300">
            <p><strong>"static"</strong> - Buka QRIS Static</p>
            <p><strong>"dynamic"</strong> - Buka QRIS Dynamic</p>
            <p><strong>"tap"</strong> - Buka QRIS Tap</p>
            <p><strong>"transaksi"</strong> - Lihat riwayat</p>
            <p><strong>"buat QR"</strong> - Generate QR (di Dynamic)</p>
            <p><strong>"aktif NFC"</strong> - Aktifkan NFC (di Tap)</p>
            <p><strong>"bayar"</strong> - Simulasi pembayaran</p>
            <p><strong>"kembali"</strong> - Kembali ke menu</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-600">
          <h2 className="text-white text-xs font-semibold mb-2 flex items-center">
            <Volume2 className="w-3 h-3 mr-1" />
            F.A.Q
          </h2>
          <div className="space-y-2 text-xs text-gray-300">
            <div>
              <p className="font-medium text-white">Q: Bagaimana cara menggunakan voice command?</p>
              <p>A: Tekan icon microphone atau katakan perintah langsung. Pastikan mikrofon diizinkan di browser.</p>
            </div>
            <div>
              <p className="font-medium text-white">Q: Apa bedanya Static dan Dynamic QRIS?</p>
              <p>A: Static menggunakan QR tetap, Dynamic bisa set nominal spesifik sebelum generate QR.</p>
            </div>
            <div>
              <p className="font-medium text-white">Q: Data transaksi tersimpan dimana?</p>
              <p>A: Semua transaksi tersimpan di database dan bisa dilihat di menu Riwayat Transaksi.</p>
            </div>
            <div>
              <p className="font-medium text-white">Q: Apakah bisa digunakan tanpa suara?</p>
              <p>A: Ya, semua fitur bisa digunakan dengan touch/tap biasa tanpa voice command.</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-900/30 rounded-lg p-2 border border-blue-600">
          <h2 className="text-blue-300 text-xs font-semibold mb-1">💡 Tips</h2>
          <div className="space-y-1 text-xs text-blue-200">
            <p>• Ucapkan perintah dengan jelas dan tidak terlalu cepat</p>
            <p>• Gunakan earphone untuk audio feedback yang lebih baik</p>
            <p>• Voice feedback akan memberikan konfirmasi setiap aksi</p>
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center mx-2 mb-2"
      >
        <ArrowLeft className="w-3 h-3 mr-1" />
        <span className="text-xs">Kembali</span>
      </button>
    </div>
  );
}