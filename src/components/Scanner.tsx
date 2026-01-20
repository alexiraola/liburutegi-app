import { useEffect, useRef } from "react";
import useScanner from "@/hooks/useScanner";

interface ScannerProps {
  onDetected: (isbn: string) => void;
  onClose?: () => void;
}

export default function Scanner({ onDetected, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { startCamera, stopCamera, error, stream } = useScanner(onDetected, videoRef);

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
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="relative w-full h-full bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {error && (
        <p className="text-red-400 mt-4">{error}</p>
      )}

      <button
        onClick={() => {
          stopCamera();
          onClose?.();
        }}
        className="mt-6 px-6 py-2 rounded-full bg-white text-black font-semibold"
      >
        Cancel
      </button>
    </div>
  );
}

