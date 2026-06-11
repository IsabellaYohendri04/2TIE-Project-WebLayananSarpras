import React from "react";

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

      <div className="flex flex-col items-center">

        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading...
        </p>

      </div>

    </div>
  );
}

export default Loading;