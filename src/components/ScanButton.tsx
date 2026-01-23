export default function ScanButton({ onClick, supportedDetector, isLoading }: { onClick: () => void, supportedDetector: boolean, isLoading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={!supportedDetector || isLoading}
      className={`
        w-20 h-20 rounded-full shadow-xl bg-white
        flex items-center justify-center text-slate-700
        transition-all active:scale-95
        sm:w-16 sm:h-16
        ${supportedDetector && !isLoading
          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
          : 'hover:border-slate-400 hover:bg-slate-50 hover:shadow-md'
        }
      `}
      aria-label="Scan book barcode"
    >
      {isLoading ? (
        <div className="w-6 h-6 sm:w-5 sm:h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      ) : (
        <svg className="w-8 h-8 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="2" height="16" rx="0.5" fill="currentColor" />
          <rect x="6" y="4" width="1" height="16" rx="0.5" fill="currentColor" />
          <rect x="8" y="4" width="2" height="16" rx="0.5" fill="currentColor" />
          <rect x="11" y="4" width="1" height="16" rx="0.5" fill="currentColor" />
          <rect x="13" y="4" width="3" height="16" rx="0.5" fill="currentColor" />
          <rect x="17" y="4" width="1" height="16" rx="0.5" fill="currentColor" />
          <rect x="19" y="4" width="2" height="16" rx="0.5" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
