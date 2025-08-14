import React from "react";

const Error404 = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Updated SVG image for a more modern look */}
        <svg
          className="mx-auto h-48 w-48 text-red-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full flex justify-center py-4 px-8 border border-transparent rounded-[40px] shadow-sm text-sm font-medium text-white bg-[#79B833] focus:outline-none focus:ring-2 focus:ring-offset-2 "
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404;