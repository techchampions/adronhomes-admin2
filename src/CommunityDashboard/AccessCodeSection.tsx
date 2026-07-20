// components/AccessCodeSection.tsx
import React, { useState } from "react";

const AccessCodeSection: React.FC = () => {
  const [codes, setCodes] = useState([
    {
      id: "1",
      code: "A7F3-9D2E-4B1C",
      type: "Main Gate",
      expires: "2026-07-15",
    },
    { id: "2", code: "K8M4-5R2P-1X9Q", type: "Parking", expires: "2026-06-30" },
    {
      id: "3",
      code: "T6H9-3W5E-8V2U",
      type: "Clubhouse",
      expires: "2026-08-01",
    },
  ]);

  const [newCode, setNewCode] = useState({ type: "", expires: "" });

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
        },
      ]);
      setNewCode({ type: "", expires: "" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Access Codes</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-[#79B833]">{codes.length}</p>
            <p className="text-sm text-gray-500">Active Codes</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">Active</p>
            <p className="text-sm text-gray-500">Status</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">2 Days</p>
            <p className="text-sm text-gray-500">Next Expiry</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Code
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Expires
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{code.code}</td>
                  <td className="py-3 px-4">{code.type}</td>
                  <td className="py-3 px-4">{code.expires}</td>
                  <td className="py-3 px-4">
                    <button className="text-[#79B833] hover:underline text-sm">
                      Copy
                    </button>
                    <button className="text-red-600 hover:underline text-sm ml-3">
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 border-t pt-6">
          <h4 className="font-semibold text-gray-800 mb-4">
            Generate New Access Code
          </h4>
          <form onSubmit={handleAddCode} className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Type (e.g., Main Gate)"
              value={newCode.type}
              onChange={(e) => setNewCode({ ...newCode, type: e.target.value })}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79B833]"
              required
            />
            <input
              type="date"
              value={newCode.expires}
              onChange={(e) =>
                setNewCode({ ...newCode, expires: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79B833]"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#79B833] text-white rounded-lg hover:bg-[#79B833]/90 transition-colors"
            >
              Generate Code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccessCodeSection;
