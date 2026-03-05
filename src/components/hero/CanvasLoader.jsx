import React from 'react';
import { Html, useProgress } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 bg-black/50 p-4 rounded-xl backdrop-blur-md border border-white/10">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="text-white text-xs font-mono whitespace-nowrap">
          Loading Galaxy {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
};

export default CanvasLoader;