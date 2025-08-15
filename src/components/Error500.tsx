import React from 'react';

const Error500 = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Inline SVG added here */}
       <svg
          className="mx-auto h-48 w-48 text-red-500 mb-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Internal Server Error</h2>
        <p className="text-gray-600 mb-8">
          Something went wrong on our end. Our team has been notified, and we're working to fix it.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center py-4 px-8 border border-transparent rounded-[40px] shadow-sm text-sm font-medium text-white bg-[#79B833] focus:outline-none focus:ring-2 focus:ring-offset-2 "
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex justify-center py-4 px-8 border border-gray-300  text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-[40px]"
          >
            Return to Login Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error500;