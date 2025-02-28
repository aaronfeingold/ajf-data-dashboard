import React from 'react';
import CitySkylineLoading from '@/components/Loading/CitySkylineLoading';

interface ChatLoadingProps {
  message?: string;
}

const ChatLoading: React.FC<ChatLoadingProps> = ({ message = 'Loading messages...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-900">
      <div className="max-w-md mx-auto flex flex-col items-center">
        <CitySkylineLoading animated={true} />
        <p className="mt-4 text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default ChatLoading;
