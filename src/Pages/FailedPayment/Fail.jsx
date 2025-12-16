import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

/**
 * PaymentFail component
 * - Reads optional details from location.state or URL query params:
 *    ?transactionId=...&reason=...&orderId=...
 * - Shows friendly failure message and actions:
 *    Retry Payment, Contact Support, Back to Shop
 */
export default function PaymentFail() {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const [loading, setLoading] = useState(true);

  // Try to find details from location.state first (preferred), then from URL query params
  const state = location.state || {};
  const searchParams = new URLSearchParams(location.search);

  const [transactionId, setTransactionId] = useState(
    state.transactionId || searchParams.get("transaction_id") || null
  );
  const [orderId] = useState(
    state.orderId || searchParams.get("orderId") || null
  );
  const [reason, setReason] = useState(
    state.reason || searchParams.get("reason") || null
  );
  const [amount] = useState(state.amount || searchParams.get("amount") || null);
  const [email] = useState(state.email || searchParams.get("email") || null);

  useEffect(() => {
    const handlePaymentFailure = async () => {
      try {
        // Get URL parameters from SSLCommerz
        const urlParams = new URLSearchParams(location.search);
        const val_id = urlParams.get("val_id");
        const transaction_id = urlParams.get("transaction_id");
        const bank_tran_id = urlParams.get("bank_tran_id");
        const status = urlParams.get("status");
        const error_message = urlParams.get("error");

        // Update state with URL parameters
        if (transaction_id) setTransactionId(transaction_id);
        if (error_message) setReason(error_message);
        if (status === "failed") setReason("Payment was declined by the bank");

        // If we have validation parameters, process the failure
        if (val_id && transaction_id) {
          try {
            const response = await axiosPublic.post("/success-payment", {
              val_id,
              tran_id: transaction_id,
              bank_tran_id,
              status,
            });

            // If somehow we get success here, redirect to success page
            if (response.data.success) {
              navigate("/success-payment");
              return;
            }
          } catch {
            // Expected to fail for failed payments
            console.log("Payment validation failed as expected");
          }
        }
      } catch (err) {
        console.error("Payment failure handling error:", err);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentFailure();
  }, [location, navigate, axiosPublic, reason]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-lg shadow-md p-6 md:p-10">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Payment Failed
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Sorry — we couldn't process your payment. Please check the details
              below and try again.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="bg-red-50 border border-red-100 rounded p-4">
            <p className="text-sm text-red-700 font-medium">Failure reason</p>
            <p className="mt-1 text-sm text-red-800">
              {reason
                ? reason
                : "Payment gateway returned an error or the transaction was declined."}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded p-4">
            <p className="text-sm text-gray-600">Transaction</p>
            <div className="mt-2 text-sm text-gray-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-medium">{transactionId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium">{orderId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">
                  {amount ? `TK ${amount}` : "N/A"}
                </span>
              </div>
              {email && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <button
              onClick={() => {
                // Prefer to navigate back to a retry route; adjust to your app flow
                // For many flows, you might redirect back to checkout with state preserved
                navigate(-1);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-red-600 bg-white text-red-600 rounded-md shadow-sm text-sm font-medium hover:bg-red-50"
            >
              Retry Payment
            </button>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700 mt-2 sm:mt-0"
            >
              Contact Support
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 ml-auto bg-gray-100 text-gray-800 rounded-md shadow-sm text-sm font-medium hover:bg-gray-200 mt-2 sm:mt-0"
            >
              Back to Shop
            </Link>
          </div>

          <div className="text-xs text-gray-400 mt-2">
            <p>
              If you believe this is a mistake, please contact support with your
              transaction ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
