// components/EstateSelector.tsx
import React from "react";
import { FiChevronDown } from "react-icons/fi";

export interface Estate {
  id: string;
  name: string;
  type: "estate" | "land";
  ownership?: string;
  paymentPlan?: string;
  balance?: string;
}

export interface EstateSelectorProps {
  estates: Estate[];
  selected: string;
  setSelected: (id: string) => void;
}

const EstateSelector: React.FC<EstateSelectorProps> = ({
  estates,
  selected,
  setSelected,
}) => {
  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full appearance-none bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent transition-all duration-200 cursor-pointer font-medium text-gray-700"
      >
        {estates.map((estate) => (
          <option key={estate.id} value={estate.name} className="py-2">
            {estate.name} ({estate.type === "estate" ? "Estate" : "Land"})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <FiChevronDown className="w-5 h-5" />
      </div>
    </div>
  );
};

export default EstateSelector;
