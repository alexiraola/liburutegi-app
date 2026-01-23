interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 border-green-700 text-white shadow-green-500/25';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 border-red-700 text-white shadow-red-500/25';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-700 text-white shadow-blue-500/25';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-700 text-white shadow-gray-500/25';
    }
  };

  const getAnimationClass = () => {
    switch (type) {
      case 'success':
        return 'animate-success-bounce';
      case 'error':
        return 'animate-error-shake';
      default:
        return 'animate-slide-in';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        min-w-80 max-w-md backdrop-blur-sm
        transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${getStyles()} ${getAnimationClass()}
      `}
      role="alert"
      aria-live="polite"
    >
      <span className="flex-shrink-0 animate-pulse">
        {getIcon()}
      </span>
      <p className="flex-1 text-sm font-medium leading-relaxed">
        {message}
      </p>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 text-xl leading-none hover:opacity-70 transition-all hover:scale-110"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
