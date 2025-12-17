import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/UseAxiosSecure";
import UseAuth from "../../hooks/UseAuth";
import {
  Calendar,
  Package,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";

const History = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState({});

  // Fetch payment history for the current user
  const {
    data: paymentHistory = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["paymentHistory", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get(`/history?email=${user.email}`);
      return response.data;
    },
  });

  // Fetch product details for a specific payment
  const fetchProductDetails = async (paymentId, menuItemIds) => {
    if (!menuItemIds || menuItemIds.length === 0) return;

    // Check if we already have the product details cached
    if (productDetails[paymentId]) return;

    try {
      // Fetch each product individually
      const productPromises = menuItemIds.map(async (productId) => {
        try {
          const response = await axiosSecure.get(`/products/${productId}`);
          return response.data;
        } catch (err) {
          console.error(`Error fetching product ${productId}:`, err);
          return null;
        }
      });

      const products = await Promise.all(productPromises);
      const validProducts = products.filter((product) => product !== null);

      // Cache the product details
      setProductDetails((prev) => ({
        ...prev,
        [paymentId]: validProducts,
      }));
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Handle expanding an order to show product details
  const handleExpandOrder = async (payment) => {
    const orderId = payment._id;

    if (expandedOrder === orderId) {
      // Collapse if already expanded
      setExpandedOrder(null);
    } else {
      // Expand and fetch product details if not already cached
      setExpandedOrder(orderId);
      if (!productDetails[orderId]) {
        await fetchProductDetails(orderId, payment.menuItemIds);
      }
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status icon and color based on payment status
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: "text-green-600 bg-green-100",
          text: "Completed",
        };
      case "pending":
        return {
          icon: <Clock className="w-4 h-4" />,
          color: "text-yellow-600 bg-yellow-100",
          text: "Pending",
        };
      case "failed":
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: "text-red-600 bg-red-100",
          text: "Failed",
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: "text-gray-600 bg-gray-100",
          text: "Unknown",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading payment history</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!paymentHistory || paymentHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No payment history
        </h3>
        <p className="text-gray-500">You haven't made any purchases yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment History
        </h2>
        <p className="text-gray-600">
          View your past purchases and payment details
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => {
                const statusInfo = getStatusInfo(payment.status);
                const isExpanded = expandedOrder === payment._id;

                return (
                  <React.Fragment key={payment._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.transactionId ||
                          payment._id?.toString().substring(0, 8) ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(payment.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2 text-gray-400" />$
                          {payment.price || "0.00"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                          <span className="ml-1">{statusInfo.text}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleExpandOrder(payment)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          {isExpanded ? "Hide Details" : "View Details"}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">
                              Order Details
                            </h4>

                            {/* Product Details Section */}
                            {loadingProducts[payment._id] ? (
                              <div className="mb-6 flex justify-center items-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                                <span className="text-gray-600">
                                  Loading product details...
                                </span>
                              </div>
                            ) : productDetails[payment._id] &&
                              productDetails[payment._id].length > 0 ? (
                              <div className="mb-6">
                                <h5 className="font-medium text-gray-800 mb-3">
                                  Products in this order
                                </h5>
                                <div className="space-y-3">
                                  {productDetails[payment._id].map(
                                    (product, index) => (
                                      <div
                                        key={product._id || index}
                                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                                      >
                                        <div className="flex-shrink-0">
                                          {product.images &&
                                          product.images.length > 0 ? (
                                            <img
                                              src={product.images[0]}
                                              alt={product.name}
                                              className="w-16 h-16 object-cover rounded-md"
                                            />
                                          ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                                              <ImageIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 truncate">
                                            {product.name || "Unknown Product"}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {product.category || "No Category"}
                                          </p>
                                          <p className="text-sm font-medium text-gray-900">
                                            ${product.price || "0.00"}
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ) : payment.menuItemIds &&
                              payment.menuItemIds.length > 0 &&
                              isExpanded ? (
                              <div className="mb-6 text-center py-4">
                                <p className="text-gray-500">
                                  No product details available
                                </p>
                              </div>
                            ) : null}

                            {payment.productName && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Product Name
                                  </p>
                                  <p className="font-medium">
                                    {payment.productName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Category
                                  </p>
                                  <p className="font-medium">
                                    {payment.productCategory || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Customer Email
                                  </p>
                                  <p className="font-medium">{payment.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Payment Method
                                  </p>
                                  <p className="font-medium">SSL Commerz</p>
                                </div>
                              </div>
                            )}

                            {payment.customerName && (
                              <div className="border-t pt-4">
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Shipping Information
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Customer Name
                                    </p>
                                    <p className="font-medium">
                                      {payment.customerName}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Phone
                                    </p>
                                    <p className="font-medium">
                                      {payment.customerPhone || "N/A"}
                                    </p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500">
                                      Address
                                    </p>
                                    <p className="font-medium">
                                      {payment.customerAddress ||
                                        payment.address ||
                                        "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
