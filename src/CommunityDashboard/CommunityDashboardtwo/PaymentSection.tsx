// components/PaymentSection.tsx
import React, { useState } from "react";
import { AiFillBank, AiFillWallet } from "react-icons/ai";
import {
  FiCreditCard,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCalendar,
  FiHome,
  FiUsers,
} from "react-icons/fi";

const PaymentSection: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentType, setPaymentType] = useState("property");

  const paymentTypes = [
    { id: "property", label: "Property Purchase", icon: FiHome },
    { id: "service", label: "Service Charges", icon: FiUsers },
    { id: "utility", label: "Utilities", icon: FiClock },
  ];

  const recentPayments = [
    {
      id: 1,
      type: "Property Purchase",
      amount: "₦15,000,000",
      status: "Completed",
      date: "2026-06-15",
      property: "Lekki Phase 1",
    },
    {
      id: 2,
      type: "Service Charges",
      amount: "₦75,000",
      status: "Pending",
      date: "2026-06-10",
      property: "Banana Island",
    },
    {
      id: 3,
      type: "Utilities",
      amount: "₦15,000",
      status: "Completed",
      date: "2026-06-05",
      property: "Victoria Island",
    },
    {
      id: 4,
      type: "Property Purchase",
      amount: "₦25,000,000",
      status: "Processing",
      date: "2026-06-01",
      property: "Lekki Phase 2",
    },
  ];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Payment of ₦${amount} via ${paymentMethod} for "${description}" initiated`,
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      case "Processing":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <FiCheckCircle className="w-4 h-4" />;
      case "Pending":
        return <FiClock className="w-4 h-4" />;
      case "Processing":
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800">Payments</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage all your property payments in one place
        </p>
      </div>

      {/* Payment Type Cards */}
      <div className="grid grid-cols-3 gap-3">
        {paymentTypes.map((type) => {
          const Icon = type.icon;
          const isActive = paymentType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setPaymentType(type.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isActive
                  ? "border-[#79B833] bg-gradient-to-r from-[#79B833]/10 to-[#8FD14F]/10"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <Icon
                className={`w-6 h-6 mx-auto ${isActive ? "text-[#79B833]" : "text-gray-500"}`}
              />
              <p
                className={`text-sm font-medium mt-2 ${isActive ? "text-[#79B833]" : "text-gray-700"}`}
              >
                {type.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Make Payment</h4>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                    paymentMethod === "card"
                      ? "border-[#79B833] bg-[#79B833]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FiCreditCard
                    className={`w-5 h-5 ${paymentMethod === "card" ? "text-[#79B833]" : "text-gray-500"}`}
                  />
                  <span className="text-xs mt-1 font-medium">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                    paymentMethod === "bank"
                      ? "border-[#79B833] bg-[#79B833]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <AiFillBank
                    className={`w-5 h-5 ${paymentMethod === "bank" ? "text-[#79B833]" : "text-gray-500"}`}
                  />
                  <span className="text-xs mt-1 font-medium">Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                    paymentMethod === "wallet"
                      ? "border-[#79B833] bg-[#79B833]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <AiFillWallet
                    className={`w-5 h-5 ${paymentMethod === "wallet" ? "text-[#79B833]" : "text-gray-500"}`}
                  />
                  <span className="text-xs mt-1 font-medium">Wallet</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent transition-all"
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent transition-all"
                placeholder="e.g., Property deposit, Utility bill, etc."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#79B833] to-[#8FD14F] text-white rounded-xl hover:shadow-lg hover:shadow-[#79B833]/30 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <span>Proceed to Payment</span>
              <FiArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Payment History */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">Recent Payments</h4>
              <button className="text-sm text-[#79B833] hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800 text-sm">
                          {payment.type}
                        </p>
                        <span className="text-sm font-bold text-gray-800">
                          {payment.amount}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {payment.property}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-gray-400 flex items-center">
                          <FiCalendar className="w-3 h-3 mr-1" />
                          {payment.date}
                        </span>
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                        >
                          {getStatusIcon(payment.status)}
                          <span>{payment.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-center">
          <FiCreditCard className="w-6 h-6 text-[#79B833] mx-auto" />
          <p className="text-sm font-medium text-gray-700 mt-2">Saved Cards</p>
        </button>
        <button className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-center">
          <FiClock className="w-6 h-6 text-[#79B833] mx-auto" />
          <p className="text-sm font-medium text-gray-700 mt-2">
            Payment History
          </p>
        </button>
        <button className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-center">
          <FiAlertCircle className="w-6 h-6 text-[#79B833] mx-auto" />
          <p className="text-sm font-medium text-gray-700 mt-2">
            Pending Bills
          </p>
        </button>
        <button className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-center">
          <FiCheckCircle className="w-6 h-6 text-[#79B833] mx-auto" />
          <p className="text-sm font-medium text-gray-700 mt-2">
            Payment Receipts
          </p>
        </button>
      </div>
    </div>
  );
};

export default PaymentSection;
