export interface BarcodeDetector {
  startDetection(stream: HTMLMediaElement, onDetect: (code: string) => void, onError: (error: any) => void): Promise<void>;
}
