import { useEffect, useRef } from "react";
import useScanner from "@/hooks/useScanner";

interface ScannerProps {
  onDetected: (isbn: string) => void;
  onClose?: () => void;
}

export default function Scanner({ onDetected, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { startCamera, stopCamera, error, stream, detected } = useScanner(onDetected, videoRef);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative w-full h-full">
        {/* Detection feedback overlay */}
        {detected && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-green-500 rounded-full p-4 animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="absolute bottom-1/3 text-white text-lg font-semibold animate-pulse">
              Kodea detektatuta!
            </p>
          </div>
        )}
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Scanning overlay with corner brackets */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-48 sm:w-80 sm:h-60 relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
            <div className="absolute top-0 left-8 right-8 h-0.5 bg-green-400 opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-green-400 opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* Controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="max-w-sm mx-auto space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-white text-sm mb-2">Saiatu kodea erdiko eremuan kokatzen</p>
              <p className="text-white/70 text-xs">Kamerak kodea detektatuko du bakarrik</p>
            </div>

            <button
              onClick={() => {
                stopCamera();
                onClose?.();
              }}
              className="w-full py-3 px-6 rounded-full bg-white/90 text-black font-semibold hover:bg-white transition-colors active:scale-95"
            >
              Utzi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

