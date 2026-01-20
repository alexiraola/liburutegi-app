import type { BarcodeDetector } from "./detector";

export class NativeBarcodeDetector implements BarcodeDetector {
  async startDetection(video: HTMLMediaElement, onDetect: (code: string) => void, onError: (error: any) => void) {
    try {
      // @ts-ignore
      const formats = await window.BarcodeDetector.getSupportedFormats();
      if (!formats.includes("ean_13")) {
        throw new Error("EAN-13 not supported");
      }

      // @ts-ignore
      const detector = new window.BarcodeDetector({
        formats: ["ean_13"],
      });

      const detectLoop = async () => {
        if (!video) return;

        try {
          const barcodes = await detector.detect(video);
          if (barcodes.length) {
            const isbn = barcodes[0].rawValue;
            onDetect(`Native: ${isbn}`);
            return;
          }
        } catch { }

        requestAnimationFrame(detectLoop);
      };

      detectLoop();
    } catch (err) {
      onError(err);
    }
  }
}
