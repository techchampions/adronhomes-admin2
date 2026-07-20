import React, { useState } from "react";
import {
  FiAlertCircle,
  FiCamera,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPlus,
  FiTool,
  FiUserCheck,
} from "react-icons/fi";

const requests = [
  {
    id: "MNT-2041",
    title: "Street light not working",
    location: "Road 3, close to Villa 14",
    status: "Assigned",
    priority: "Medium",
    updated: "Today, 9:20 AM",
    handler: "Facility Team",
  },
  {
    id: "MNT-2038",
    title: "Low water pressure",
    location: "Apartment Block B",
    status: "In Progress",
    priority: "High",
    updated: "Yesterday, 4:45 PM",
    handler: "Plumbing Vendor",
  },
  {
    id: "MNT-2029",
    title: "Gate arm calibration",
    location: "Main entrance",
    status: "Resolved",
    priority: "Low",
    updated: "Jun 17, 2026",
    handler: "Security Ops",
  },
];

const statusStyles: Record<string, string> = {
  Assigned: "bg-blue-50 text-blue-700",
  "In Progress": "bg-yellow-50 text-yellow-700",
  Resolved: "bg-green-50 text-green-700",
};

const trackingSteps = [
  {
    title: "Received",
    text: "Estate admin gets the request immediately",
    icon: FiClock,
  },
  {
    title: "Assigned",
    text: "A staff member or vendor takes ownership",
    icon: FiUserCheck,
  },
  {
    title: "Resolved",
    text: "Resident confirms completion",
    icon: FiCheckCircle,
  },
];

const MaintenanceSection: React.FC = () => {
  const [category, setCategory] = useState("Electrical");

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Maintenance and Service Desk
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Report estate issues, upload evidence, and track who is handling it.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#79B833] px-5 py-2.5 font-semibold text-white transition hover:bg-[#6AA12D]">
          <FiPlus className="h-5 w-5" />
          New Request
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h4 className="font-semibold text-gray-800">Submit a request</h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Issue category
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#79B833]"
              >
                <option>Electrical</option>
                <option>Plumbing</option>
                <option>Security</option>
                <option>Roads and drainage</option>
                <option>Waste management</option>
                <option>General estate service</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Exact location
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#79B833]"
                placeholder="e.g., Block B, Flat 5, Road 2"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              What happened?
            </label>
            <textarea
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#79B833]"
              placeholder="Explain the issue in simple words."
            />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm font-medium text-gray-600 transition hover:border-[#79B833] hover:text-[#79B833]">
              <FiCamera className="mx-auto mb-2 h-5 w-5" />
              Add photo
            </button>
            <button className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-600 transition hover:border-[#79B833] hover:text-[#79B833]">
              <FiMapPin className="mx-auto mb-2 h-5 w-5" />
              Pin location
            </button>
            <button className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-600 transition hover:border-[#79B833] hover:text-[#79B833]">
              <FiAlertCircle className="mx-auto mb-2 h-5 w-5" />
              Mark urgent
            </button>
          </div>
          <button className="mt-5 w-full rounded-xl bg-[#79B833] py-3 font-semibold text-white transition hover:bg-[#6AA12D]">
            Submit {category} Request
          </button>
        </div>

        <div className="rounded-xl border border-[#79B833]/20 bg-[#79B833]/5 p-5">
          <h4 className="font-semibold text-gray-800">How tracking works</h4>
          <div className="mt-4 space-y-3">
            {trackingSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="flex gap-3 rounded-xl bg-white p-3"
                >
                  <Icon className="mt-0.5 h-5 w-5 text-[#79B833]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-500">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white">
        <div className="border-b border-gray-100 p-5">
          <h4 className="font-semibold text-gray-800">Recent requests</h4>
        </div>
        <div className="divide-y divide-gray-100">
          {requests.map((request) => (
            <div
              key={request.id}
              className="grid gap-3 p-4 md:grid-cols-[1fr_auto]"
            >
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-[#79B833]">
                  <FiTool className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{request.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {request.id} • {request.location}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Assigned to {request.handler} • Updated {request.updated}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {request.priority}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[request.status]}`}
                >
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSection;
