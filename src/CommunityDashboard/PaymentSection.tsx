// components/PaymentSection.tsx
import React, { useState } from "react";

const PaymentSection: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Payment of ₦${amount} via ${paymentMethod} for "${description}" initiated`,
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Payments</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Property Purchase</p>
            <p className="text-xl font-bold text-green-700">₦45,000,000</p>
            <p className="text-xs text-gray-500">Installment plan</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Service Charges</p>
            <p className="text-xl font-bold text-blue-700">₦150,000</p>
            <p className="text-xs text-gray-500">Due: 2026-07-15</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600">Utilities</p>
            <p className="text-xl font-bold text-purple-700">₦45,000</p>
            <p className="text-xs text-gray-500">Current month</p>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-[#79B833] focus:ring-[#79B833]"
                />
                <span>Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-[#79B833] focus:ring-[#79B833]"
                />
                <span>Bank Transfer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-[#79B833] focus:ring-[#79B833]"
                />
                <span>Wallet</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79B833]"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79B833]"
              placeholder="e.g., Property deposit, Utility bill, etc."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#79B833] text-white rounded-lg hover:bg-[#79B833]/90 transition-colors font-semibold"
          >
            Proceed to Payment
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Payment History</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Property Purchase - Lekki Phase 1
              </span>
              <span className="font-semibold">₦15,000,000</span>
              <span className="text-green-600">Completed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Service Charges - Banana Island
              </span>
              <span className="font-semibold">₦75,000</span>
              <span className="text-yellow-600">Pending</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Electricity Bill</span>
              <span className="font-semibold">₦15,000</span>
              <span className="text-green-600">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
