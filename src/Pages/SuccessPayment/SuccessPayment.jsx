import React from "react";

const SuccessPayment = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center animate-fadeIn">

        {/* Success Icon */}
        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full mb-4">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you! Your payment was completed successfully.  
          A confirmation email has been sent to you.
        </p>

        {/* Button */}
        <a
          href="/"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition w-full"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default SuccessPayment;
