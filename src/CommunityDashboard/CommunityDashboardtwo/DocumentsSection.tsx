import React, { useState } from "react";
import {
  FiDownload,
  FiFileText,
  FiFilter,
  FiFolder,
  FiSearch,
  FiShield,
  FiUpload,
} from "react-icons/fi";

const documents = [
  {
    id: "DOC-001",
    title: "Allocation Letter - Lekki Phase 1 Estate",
    category: "Ownership",
    type: "PDF",
    date: "Jun 18, 2026",
    access: "Owner only",
  },
  {
    id: "DOC-002",
    title: "Payment Receipt - June Service Charge",
    category: "Receipts",
    type: "PDF",
    date: "Jun 15, 2026",
    access: "Owner only",
  },
  {
    id: "DOC-003",
    title: "Estate Meeting Minutes",
    category: "Community",
    type: "DOCX",
    date: "Jun 10, 2026",
    access: "All residents",
  },
  {
    id: "DOC-004",
    title: "Estate Rules and Visitor Policy",
    category: "Community",
    type: "PDF",
    date: "May 28, 2026",
    access: "All residents",
  },
  {
    id: "DOC-005",
    title: "Block B Floor Plan",
    category: "Property",
    type: "PDF",
    date: "May 11, 2026",
    access: "Block B owners",
  },
];

const categories = ["All", "Ownership", "Receipts", "Community", "Property"];

const DocumentsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocuments = documents.filter((document) => {
    const matchesCategory =
      activeCategory === "All" || document.category === activeCategory;
    const matchesSearch = document.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Documents and Receipts
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Keep ownership papers, payment receipts, rules, and meeting records
            in one place.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#79B833] px-5 py-2.5 font-semibold text-white transition hover:bg-[#6AA12D]">
          <FiUpload className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <FiFolder className="h-6 w-6 text-[#79B833]" />
          <p className="mt-3 text-2xl font-bold text-gray-800">42</p>
          <p className="text-sm text-gray-500">Total documents</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <FiShield className="h-6 w-6 text-[#79B833]" />
          <p className="mt-3 text-2xl font-bold text-gray-800">18</p>
          <p className="text-sm text-gray-500">Owner-only files</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <FiFileText className="h-6 w-6 text-[#79B833]" />
          <p className="mt-3 text-2xl font-bold text-gray-800">9</p>
          <p className="text-sm text-gray-500">Receipts this year</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-[#79B833]"
              placeholder="Search documents..."
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-[#79B833] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-[#79B833]/10 hover:text-[#4F7E1D]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:border-[#79B833] hover:text-[#79B833]">
            <FiFilter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white">
        <div className="divide-y divide-gray-100">
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="grid gap-3 p-4 transition hover:bg-gray-50 md:grid-cols-[1fr_auto]"
            >
              <div className="flex gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#79B833]/10 text-[#79B833]">
                  <FiFileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {document.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {document.id} • {document.category} • {document.type}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {document.access} • Updated {document.date}
                  </p>
                </div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#79B833] hover:text-[#79B833] md:self-center">
                <FiDownload className="h-4 w-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsSection;
