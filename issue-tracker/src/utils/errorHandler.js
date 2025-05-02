export class AppError extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export const handleError = (error, context) => {
  // Log to error tracking service
  if (process.env.NODE_ENV !== 'production') {
    console.group(`Error in ${context}`);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.groupEnd();
  }

  return {
    userMessage: error.message || 'An unexpected error occurred',
    code: error.code || 'UNKNOWN_ERROR',
    details: error.details || null
  };
};

export const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  const handleCatch = (error, info) => {
    setHasError(true);
    handleError(error, 'ErrorBoundary');
  };

  return hasError ? fallback : children;
};
