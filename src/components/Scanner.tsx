import { useEffect, useRef, useState } from "react";
import { NativeBarcodeDetector } from "@/barcode/detector.native";

interface ScannerProps {
  onDetected: (isbn: string) => void;
  onClose?: () => void;
}

export default function Scanner({ onDetected, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return stopCamera;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
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

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      startDetection();
    } catch (err: any) {
      setError(err?.name || "Camera access failed");
      console.error(err);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }

  function startDetection() {
    if (!videoRef.current) return;

    if ("BarcodeDetector" in window) {
      startNativeDetection();
    } else {
      setError("BarcodeDetector not supported");
    }
  }

  async function startNativeDetection() {
    const detector = new NativeBarcodeDetector();
    detector.startDetection(videoRef.current!, handleDetected, setError);
  }

  function handleDetected(isbn: string) {
    stopCamera();
    onDetected(isbn);
  }

  // -------------------------------
  // UI
  // -------------------------------
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

