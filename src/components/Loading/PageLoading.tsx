import React from "react";
import CitySkylineLoading from "@/components/Loading/CitySkylineLoading";

interface PageLoadingProps {
  message?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <CitySkylineLoading animated={true} />
        <p className="mt-4 text-gray-600 dark:text-gray-200">{message}</p>
      </div>
    </div>
  );
};

export default PageLoading;
