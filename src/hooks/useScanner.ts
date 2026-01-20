import { useState } from "react";
import { NativeBarcodeDetector } from "@/barcode/detector.native";

type ScannerState = {
  stream: MediaStream | null;
  error: string | null;
};

export default function useScanner(onDetected: (isbn: string) => void, videoRef: React.RefObject<HTMLVideoElement | null>) {
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
  };

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