// components/UtilityPayment.tsx
import React, { useState } from "react";
import {
  FiZap,
  FiDroplet,
  FiWifi,
  FiCreditCard,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

const UtilityPayment: React.FC = () => {
  const [meterNumber, setMeterNumber] = useState("");
  const [units, setUnits] = useState("");
  const [paymentType, setPaymentType] = useState("electricity");

  const utilities = [
    {
      id: "electricity",
      label: "Electricity",
      icon: FiZap,
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: "water",
      label: "Water",
      icon: FiDroplet,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "internet",
      label: "Internet",
      icon: FiWifi,
      color: "from-purple-400 to-purple-600",
    },
  ];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Payment for ${paymentType} initiated for meter ${meterNumber} with ${units} units`,
    );
  };

  return (
    <div className=" mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Utility Payments</h3>
          <p className="text-sm text-gray-500 mt-1">
            Pay your utility bills quickly and securely
          </p>
        </div>

        {/* Utility Selection Cards */}
        <div className="grid grid-cols-3 gap-3">
          {utilities.map((util) => {
            const Icon = util.icon;
            const isActive = paymentType === util.id;
            return (
              <button
                key={util.id}
                onClick={() => setPaymentType(util.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isActive
                    ? `border-[#79B833] bg-gradient-to-r ${util.color} text-white shadow-lg`
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Icon
                  className={`w-6 h-6 mx-auto ${isActive ? "text-white" : "text-gray-600"}`}
                />
                <p
                  className={`text-sm font-medium mt-2 ${isActive ? "text-white" : "text-gray-700"}`}
                >
                  {util.label}
                </p>
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handlePayment}
          className="space-y-4 bg-white rounded-xl p-6 border border-gray-100"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Meter Number / Account ID
            </label>
            <input
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent transition-all"
              placeholder="Enter meter number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Units to Purchase
            </label>
            <input
              type="number"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent transition-all"
              placeholder="Enter number of units"
              required
            />
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Cost per unit</span>
              <span className="font-semibold text-gray-800">₦65.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-200">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-[#79B833]">
                ₦{units ? (parseFloat(units) * 65).toLocaleString() : "0.00"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#79B833] to-[#8FD14F] text-white rounded-xl hover:shadow-lg hover:shadow-[#79B833]/30 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
          >
            <FiCreditCard className="w-5 h-5" />
            <span>Proceed to Payment</span>
          </button>
        </form>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button className="p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-sm text-gray-600 flex flex-col items-center space-y-1">
            <FiCheckCircle className="w-5 h-5 text-green-500" />
            <span>History</span>
          </button>
          <button className="p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-sm text-gray-600 flex flex-col items-center space-y-1">
            <FiShield className="w-5 h-5 text-blue-500" />
            <span>Auto-pay</span>
          </button>
          <button className="p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-sm text-gray-600 flex flex-col items-center space-y-1">
            <FiCreditCard className="w-5 h-5 text-purple-500" />
            <span>Methods</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UtilityPayment;
