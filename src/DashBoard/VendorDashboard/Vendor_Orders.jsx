"use client";

import { useState } from "react";
import {
  X,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Truck,
  Image as ImageIcon,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/UseAxiosSecure";

export default function VendorOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const axiosSecure = useAxiosSecure();

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders");
      return res.data;
    },
  });

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "success").length,
    cancelled: orders.filter((o) => o.status === "failed").length,
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      success: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentStatusColor = (status) => {
    return status === "success"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-orange-100 text-orange-800 border-orange-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get customer name from payment data
  const getCustomerName = (order) => {
    return (
      order.customerName || order.email?.split("@")[0] || "Unknown Customer"
    );
  };

  // Get product image from products array or fallback
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading orders</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Orders</h1>
          <p className="text-gray-600">
            Manage and track all your customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.processing}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Shipped</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.shipped}
                </p>
              </div>
              <Truck className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.delivered}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Email, or Customer Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="success">Delivered</option>
              <option value="failed">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">
                        {order.transactionId ||
                          order._id?.toString().slice(-8) ||
                          "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                          {getCustomerName(order).charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getCustomerName(order)}
                          </p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.products &&
                          order.products.slice(0, 3).map((product, idx) => {
                            const productImage = getProductImage(product);
                            return (
                              <div key={idx} className="relative">
                                {productImage ? (
                                  <img
                                    src={productImage}
                                    alt={product.name}
                                    className="w-10 h-10 rounded object-cover border border-gray-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-gray-200 border border-gray-200 flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        {order.products && order.products.length > 3 && (
                          <span className="text-xs text-gray-500 font-medium">
                            +{order.products.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        ${order.price || "0.00"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status === "success"
                          ? "Delivered"
                          : order.status === "failed"
                          ? "Cancelled"
                          : order.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>

        {/* Orders Cards - Mobile/Tablet */}
        <div className="lg:hidden space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-gray-900 font-medium">
                  #
                  {order.transactionId ||
                    order._id?.toString().slice(-8) ||
                    "N/A"}
                </span>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>

              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                  {getCustomerName(order).charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {getCustomerName(order)}
                  </p>
                  <p className="text-xs text-gray-500">{order.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {order.products &&
                  order.products.slice(0, 4).map((product, idx) => {
                    const productImage = getProductImage(product);
                    return (
                      <div key={idx} className="relative">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-200 border border-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                {order.products && order.products.length > 4 && (
                  <span className="text-xs text-gray-500 font-medium">
                    +{order.products.length - 4}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${order.price || "0.00"}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status === "success"
                    ? "Delivered"
                    : order.status === "failed"
                    ? "Cancelled"
                    : order.status || "Unknown"}
                </span>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                  {formatDate(order.date)}
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500 font-mono">
                  #{selectedOrder.transactionId || selectedOrder._id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Order Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status === "success"
                      ? "Delivered"
                      : selectedOrder.status === "failed"
                      ? "Cancelled"
                      : selectedOrder.status || "Unknown"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {getCustomerName(selectedOrder).charAt(0)}
                  </div>
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {getCustomerName(selectedOrder)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedOrder.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedOrder.customerPhone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    {selectedOrder.customerAddress ||
                      selectedOrder.address ||
                      "N/A"}
                  </p>
                  <p>
                    {selectedOrder.customerCity || selectedOrder.city || "N/A"},{" "}
                    {selectedOrder.customerPostcode ||
                      selectedOrder.postcode ||
                      "N/A"}
                  </p>
                  <p>
                    {selectedOrder.customerCountry ||
                      selectedOrder.country ||
                      "N/A"}
                  </p>
                </div>
              </div>

              {/* Products */}
              {selectedOrder.products && selectedOrder.products.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Products</h3>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, idx) => {
                      const productImage = getProductImage(product);
                      return (
                        <div
                          key={idx}
                          className="flex gap-4 bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex-shrink-0">
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={product.name}
                                className="w-20 h-20 rounded object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded bg-gray-200 border border-gray-200 flex items-center justify-center">
                                <ImageIcon className="w-10 h-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {product.name || "Unknown Product"}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-0.5">
                              <p>
                                {product.selectedColor &&
                                  `Color: ${product.selectedColor}`}
                                {product.selectedSize &&
                                  ` | Size: ${product.selectedSize}`}
                              </p>
                              <p>Quantity: {product.quantity || 1}</p>
                              <p className="font-semibold text-gray-900">
                                Price: ${product.price || "0.00"} each
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              ${(product.price || 0) * (product.quantity || 1)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(selectedOrder.date)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900">
                      SSL Commerz
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">
                        Total Amount:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${selectedOrder.price || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Update Status
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors">
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
