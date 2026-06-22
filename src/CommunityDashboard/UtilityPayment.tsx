// components/UtilityPayment.tsx
import React, { useState } from "react";

const UtilityPayment: React.FC = () => {
  const [meterNumber, setMeterNumber] = useState("");
  const [units, setUnits] = useState("");
  const [paymentType, setPaymentType] = useState("electricity");

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Payment for ${paymentType} initiated for meter ${meterNumber} with ${units} units`,
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Utility Payments
        </h3>

        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            <button
              className={`py-2 px-4 ${paymentType === "electricity" ? "border-b-2 border-[#79B833] text-[#79B833] font-semibold" : "text-gray-500"}`}
              onClick={() => setPaymentType("electricity")}
            >
              Electricity
            </button>
            <button
              className={`py-2 px-4 ${paymentType === "water" ? "border-b-2 border-[#79B833] text-[#79B833] font-semibold" : "text-gray-500"}`}
              onClick={() => setPaymentType("water")}
            >
              Water
            </button>
            <button
              className={`py-2 px-4 ${paymentType === "internet" ? "border-b-2 border-[#79B833] text-[#79B833] font-semibold" : "text-gray-500"}`}
              onClick={() => setPaymentType("internet")}
            >
              Internet
            </button>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meter Number / Account ID
            </label>
            <input
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79B833]"
              placeholder="Enter meter number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Units to Purchase
            </label>
            <input
              type="number"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79B833]"
              placeholder="Enter number of units"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Cost per unit</span>
              <span className="font-semibold">₦65.00</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-bold text-[#79B833]">
                ₦{units ? (parseFloat(units) * 65).toFixed(2) : "0.00"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#79B833] text-white rounded-lg hover:bg-[#79B833]/90 transition-colors font-semibold"
          >
            Pay Now
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">Quick Actions</h4>
          <div className="flex space-x-4">
            <button className="text-sm text-[#79B833] hover:underline">
              View History
            </button>
            <button className="text-sm text-[#79B833] hover:underline">
              Auto-pay Setup
            </button>
            <button className="text-sm text-[#79B833] hover:underline">
              Payment Methods
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityPayment;
