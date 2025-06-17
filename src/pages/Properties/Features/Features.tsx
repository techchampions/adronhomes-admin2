import React, { forwardRef, useImperativeHandle, useState, useEffect, useContext } from "react";
import { BiX } from "react-icons/bi";
import * as Yup from "yup";
import { PropertyContext } from "../../../MyContext/MyContext";

interface FeaturesInputHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface FeaturesFormValues {
  features: string[];
}

const predefinedFeatures = [
  "Gym",
  "Swimming Pool",
  "Drainage",
  "Super Market",
  "Street Light"
];

const FeaturesInput = forwardRef<FeaturesInputHandles>((props, ref) => {
  const { formData, setFeatures: setContextFeatures } = useContext(PropertyContext)!;
  const [features, setLocalFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [touched, setTouched] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Initialize with context values on first load
  useEffect(() => {
    if (initialLoad && formData.features.features && formData.features.features.length > 0) {
      setLocalFeatures(formData.features.features);
      setTouched(true); // Mark as touched to show validation if empty
      setInitialLoad(false);
    }
  }, [formData.features.features, initialLoad]);

  // Sync with context whenever features change
  useEffect(() => {
    if (!initialLoad) {
      setContextFeatures({ features });
    }
  }, [features, setContextFeatures, initialLoad]);

  const validationSchema = Yup.object().shape({
    features: Yup.array()
      .min(1, "At least one feature is required")
      .required("Features are required"),
  });

  const removeFeature = (featureToRemove: string) => {
    setTouched(true);
    setLocalFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setTouched(true);
      setLocalFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const toggleFeature = (feature: string) => {
    setTouched(true);
    if (features.includes(feature)) {
      removeFeature(feature);
    } else {
      setLocalFeatures([...features, feature]);
    }
  };

  const validate = async () => {
    try {
      await validationSchema.validate({ features });
      // alert(features)÷
      return true;
    } catch (error) {
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      const isValid = await validate();
      if (isValid) {
        setContextFeatures({ features });
      }
    },
    isValid: features.length > 0 || (formData.features.features && formData.features.features.length > 0)
  }));

  return (
    <div className="mx-auto">
      <div className="mb-4">
        {/* Predefined features with checkboxes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Common Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {predefinedFeatures.map((feature) => (
              <div key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  id={`feature-${feature}`}
                  checked={features.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 accent-black"
                />
                <label htmlFor={`feature-${feature}`} className="text-sm text-gray-700">
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Selected features display */}
        <div className="flex flex-wrap gap-2 mb-4">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center bg-[#FFFFFF] rounded-full shadow px-3 py-1 text-sm"
            >
              <img src="/markgood.svg" className="mr-3" alt="feature icon" />
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(feature)}
                className="ml-2 font-[325] text-gray-500 hover:text-gray-700"
              >
                <BiX size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Custom feature input */}
        <div className="flex items-center">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addFeature()}
            placeholder="Input Feature"
            className="flex-grow max-w-xl relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
          />
          <button
            type="button"
            onClick={addFeature}
            className="ml-4 text-dark font-bold text-sm"
          >
            Add Feature
          </button>
        </div>
        {touched && features.length === 0 && (
          <div className="text-red-500 text-sm mt-2">At least one feature is required</div>
        )}
      </div>
    </div>
  );
});

FeaturesInput.displayName = "FeaturesInput";

export default FeaturesInput;