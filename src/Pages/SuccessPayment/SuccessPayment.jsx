import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const SuccessPayment = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
    const [params] = useSearchParams();
  const trxId = params.get("tran_id");
  console.log("Transaction ID from URL:", trxId);

  useEffect(() => {
    const validatePayment = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(location.search);
        const val_id = urlParams.get("val_id");
        const transaction_id = urlParams.get("transaction_id");
        const bank_tran_id = urlParams.get("bank_tran_id");
        const status = urlParams.get("status");

        // If we have validation parameters, validate the payment
        if (val_id && transaction_id) {
          const response = await axiosPublic.post("/success-payment", {
            val_id,
            tran_id: transaction_id,
            bank_tran_id,
            status,
          });

          if (response.data.success) {
            setPaymentDetails(response.data);
          } else {
            setError("Payment validation failed");
            // Redirect to fail page if validation fails
            setTimeout(() => {
              navigate("/fail");
            }, 3000);
          }
        } else {
          // No validation parameters, just show success page
          setPaymentDetails({ success: true });
        }
      } catch (err) {
        console.error("Payment validation error:", err);
        setError("Failed to validate payment");
        // Redirect to fail page on error
        setTimeout(() => {
          navigate("/fail");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    validatePayment();
  }, [location, navigate, axiosPublic]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto bg-red-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to payment failed page...
          </p>
        </div>
      </div>
    );
  }

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
          Thank you! Your payment was completed successfully. A confirmation
          email has been sent to you.
        </p>

        {/* Transaction Details */}
        {/* {paymentDetails?.transactionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Transaction ID:</p>
            <p className="font-mono text-sm font-semibold">
              {paymentDetails.transactionId}
            </p>
          </div>
        )} */}

           {/* Transaction Details */}
        {trxId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Transaction ID:</p>
            <p className="font-mono text-sm font-semibold">
              {trxId}
            </p>
          </div>
        )}

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
