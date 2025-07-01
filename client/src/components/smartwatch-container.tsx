import { ReactNode } from 'react';
import { Wifi, BatteryFull } from 'lucide-react';

interface SmartwatchContainerProps {
  children: ReactNode;
}

export function SmartwatchContainer({ children }: SmartwatchContainerProps) {
  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="watch-container flex flex-col relative overflow-hidden">
        {/* Status Bar */}
        <div className="flex justify-between items-center p-3 text-xs text-gray-400">
          <span>{currentTime}</span>
          <div className="flex space-x-1">
            <Wifi className="w-3 h-3" />
            <BatteryFull className="w-3 h-3" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
