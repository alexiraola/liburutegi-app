import { useEffect, useRef, useState } from "react";
import { NativeBarcodeDetector } from "@/barcode/detector.native";

interface ScannerProps {
  onDetected: (isbn: string) => void;
  onClose?: () => void;
}

type ScannerState = {
  stream: MediaStream | null;
  error: string | null;
};

function useScanner(onDetected: (isbn: string) => void, videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [state, setState] = useState<ScannerState>({
    stream: null,
    error: null,
  });

  const startCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === "videoinput");

      if (!videoDevices.length) {
        throw new Error("No video devices found");
      }

      const backCameras = videoDevices.filter(d => /back|rear|environment/.test(d.label));
      const backCamera = backCameras[backCameras.length - 1];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: backCamera?.deviceId },
      });

      setState(prevState => ({
        ...prevState,
        stream,
      }));

      startDetection();
    } catch (err: any) {
      setState(prevState => ({
        ...prevState,
        error: err?.name || "Camera access failed",
      }));
      console.error(err);
    }
  };
  const stopCamera = () => {
    state.stream?.getTracks().forEach((t) => t.stop());
  }

  async function startDetection() {
    const detector = new NativeBarcodeDetector();
    detector.startDetection(videoRef.current!, handleDetected, error => setState(prevState => ({ ...prevState, error })));
  }

  function handleDetected(isbn: string) {
    stopCamera();
    onDetected(isbn);
  }

  return {
    startCamera,
    stopCamera,
    stream: state.stream,
    error: state.error,
  };
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

