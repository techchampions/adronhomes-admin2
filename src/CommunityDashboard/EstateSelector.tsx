// components/EstateSelector.tsx
import React from "react";

export interface Estate {
  id: string;
  name: string;
  type: "estate" | "land";
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
        className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:border-transparent"
      >
        {estates.map((estate) => (
          <option key={estate.id} value={estate.name}>
            {estate.name} ({estate.type === "estate" ? "Estate" : "Land"})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default EstateSelector;
