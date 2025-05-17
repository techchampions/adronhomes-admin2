import React, { useState } from "react";
import { BiX } from "react-icons/bi";

const FeaturesInput = () => {
  const [features, setFeatures] = useState([
    "Gym",
    "Swimming Pool",
    "Drainage",
    "Super Market",
  ]);
  const [newFeature, setNewFeature] = useState("");

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  return (
    <div className=" mx-auto">
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-60">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center bg-[#FFFFFF] rounded-full shadow px-3 py-1 text-sm"
            >
              <img src="/markgood.svg" className="mr-3" />
              {feature}
              <button
                onClick={() => removeFeature(feature)}
                className="ml-2  font-[325] text-gray-500 hover:text-gray-700"
              >
                <BiX size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Input Feature"
            className="flex-grow max-w-xl  relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
          />
          <button
            onClick={addFeature}
            className="ml-4 text-dark font-bold text-sm"
          >
            Add Feature
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesInput;
