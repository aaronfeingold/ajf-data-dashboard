import React from "react";
import CitySkylineLoading from "@/components/Loading/CitySkylineLoading";

interface ContentLoadingProps {
  message?: string;
  containerClassName?: string;
  size?: "small" | "medium" | "large";
  title?: string;
}

const ContentLoading: React.FC<ContentLoadingProps> = ({
  message = "Loading content...",
  containerClassName = "flex flex-col items-center justify-center h-full w-full p-8",
  size = "medium",
  title,
}) => {
  // Adjust the skyline size based on the size prop
  const skylineClass = {
    small: "w-28 h-16",
    medium: "w-56 h-32",
    large: "w-80 h-48",
  }[size];

  return (
    <div className={containerClassName}>
      <div className="flex flex-col items-center">
        <div className={skylineClass}>
          <CitySkylineLoading animated={true} />
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-200">
          {title}
          {message}
        </p>
      </div>
    </div>
  );
};

export default ContentLoading;
