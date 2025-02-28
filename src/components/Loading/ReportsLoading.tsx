import React from 'react';
import CitySkylineLoading from '@/components/Loading/CitySkylineLoading';

interface ReportsLoadingProps {
  message?: string;
}

const ReportsLoading: React.FC<ReportsLoadingProps> = ({ message = 'Loading reports data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <CitySkylineLoading animated={true} />
          <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
          <div className="mt-6 w-full">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6 mb-4"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsLoading;
