import React from 'react';

interface LoadingTimeoutFallbackProps {
  message?: string;
  onRetry?: () => void;
}

const LoadingTimeoutFallback: React.FC<LoadingTimeoutFallbackProps> = ({
  message = "Loading is taking longer than expected",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12 text-yellow-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
          {message}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
          You can wait a bit longer or try refreshing the page.
        </p>

        {onRetry && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Retry Loading
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingTimeoutFallback;
