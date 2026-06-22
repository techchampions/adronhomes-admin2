// components/AccessCodeSection.tsx
import React, { useState } from "react";
import {
  FiKey,
  FiCopy,
  FiX,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiCalendar,
  FiShield,
  FiUser,
  FiHome,
} from "react-icons/fi";

const AccessCodeSection: React.FC = () => {
  const [codes, setCodes] = useState([
    {
      id: "1",
      code: "A7F3-9D2E-4B1C",
      type: "Main Gate",
      expires: "2026-07-15",
      status: "active",
      usedBy: 12,
    },
    {
      id: "2",
      code: "K8M4-5R2P-1X9Q",
      type: "Parking",
      expires: "2026-06-30",
      status: "expiring",
      usedBy: 8,
    },
    {
      id: "3",
      code: "T6H9-3W5E-8V2U",
      type: "Clubhouse",
      expires: "2026-08-01",
      status: "active",
      usedBy: 5,
    },
    {
      id: "4",
      code: "B2V7-9N4M-6K3P",
      type: "Gym",
      expires: "2026-05-15",
      status: "expired",
      usedBy: 3,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState({
    type: "",
    expires: "",
    maxUses: "",
  });

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) code += "-";
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode.type && newCode.expires) {
      setCodes([
        ...codes,
        {
          id: Date.now().toString(),
          code: generateCode(),
          type: newCode.type,
          expires: newCode.expires,
          status: "active",
          usedBy: 0,
        },
      ]);
      setNewCode({ type: "", expires: "", maxUses: "" });
      setShowModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "expiring":
        return "bg-yellow-100 text-yellow-700";
      case "expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <FiCheckCircle className="w-4 h-4" />;
      case "expiring":
        return <FiClock className="w-4 h-4" />;
      case "expired":
        return <FiX className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Access Codes</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage community access and security
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#79B833] to-[#8FD14F] text-white rounded-xl hover:shadow-lg hover:shadow-[#79B833]/30 transition-all duration-200 flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Generate Code</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{codes.length}</p>
          <p className="text-sm text-gray-500">Total Codes</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-2xl font-bold text-green-600">
            {codes.filter((c) => c.status === "active").length}
          </p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-2xl font-bold text-yellow-600">
            {codes.filter((c) => c.status === "expiring").length}
          </p>
          <p className="text-sm text-gray-500">Expiring Soon</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-2xl font-bold text-red-600">
            {codes.filter((c) => c.status === "expired").length}
          </p>
          <p className="text-sm text-gray-500">Expired</p>
        </div>
      </div>

      {/* Code List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Expires
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Used By
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {codes.map((code) => (
                <tr
                  key={code.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <code className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono text-gray-700">
                      {code.code}
                    </code>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {code.type}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(code.status)}`}
                    >
                      {getStatusIcon(code.status)}
                      <span className="capitalize">{code.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {code.expires}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {code.usedBy} people
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-[#79B833]">
                        <FiCopy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600">
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-center">
          <FiShield className="w-6 h-6 text-[#79B833] mx-auto" />
          <p className="text-sm font-medium text-gray-700 mt-2">Security Log</p>
        </button>
        <button className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-center">
          <FiUser className="w-6 h-6 text-[#79B833] mx-auto" />
          <p className="text-sm font-medium text-gray-700 mt-2">User Access</p>
        </button>
        <button className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-center">
          <FiCalendar className="w-6 h-6 text-[#79B833] mx-auto" />
          <p className="text-sm font-medium text-gray-700 mt-2">Schedule</p>
        </button>
        <button className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow text-center">
          <FiHome className="w-6 h-6 text-[#79B833] mx-auto" />
          <p className="text-sm font-medium text-gray-700 mt-2">
            All Properties
          </p>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Generate New Code
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Access Type
                </label>
                <input
                  type="text"
                  value={newCode.type}
                  onChange={(e) =>
                    setNewCode({ ...newCode, type: e.target.value })
                  }
                  placeholder="e.g., Main Gate, Parking"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newCode.expires}
                  onChange={(e) =>
                    setNewCode({ ...newCode, expires: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Max Uses (Optional)
                </label>
                <input
                  type="number"
                  value={newCode.maxUses}
                  onChange={(e) =>
                    setNewCode({ ...newCode, maxUses: e.target.value })
                  }
                  placeholder="Unlimited"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#79B833] to-[#8FD14F] text-white rounded-xl hover:shadow-lg hover:shadow-[#79B833]/30 transition-all duration-200 font-semibold"
              >
                Generate Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessCodeSection;
