"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
import { BiX } from "react-icons/bi";
import * as Yup from "yup";
import { FeaturesFormValues } from "../../../MyContext/MyContext";

interface FeaturesInputHandles {
  handleSubmit: () => void;
  isValid: boolean;
  values: FeaturesFormValues;
}

interface FeaturesInputProps {
  setFeatures: (data: FeaturesFormValues) => void;
  initialData?: FeaturesFormValues;
  isEditMode?: boolean;
}

const predefinedFeatures = [
  "Gym",
  "Swimming Pool",
  "Drainage",
  "Super Market",
  "Street Light",
  "24/7 Security",
  "Parking Space",
  "Garden",
  "Playground",
  "Clubhouse",
  "Power Supply",
  "Water Supply",
  "Internet",
  "CCTV",
  "Elevator",
];

const FeaturesInput = forwardRef<
  FeaturesInputHandles,
  FeaturesInputProps
>(({ setFeatures, initialData, isEditMode = false }, ref) => {
  const hydratedRef = useRef(false);

  const [localFeatures, setLocalFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  /* --------------------------------
     HYDRATE ONCE (SAFE)
  -------------------------------- */
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      const incoming = initialData?.features ?? [];
      setLocalFeatures(incoming);
      setFeatures({ features: incoming });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------
     VALIDATION
  -------------------------------- */
  const schema = Yup.object({
    features: Yup.array().min(1, "At least one feature is required"),
  });

  const validate = async () => {
    try {
      await schema.validate({ features: localFeatures });
      setValidationError(null);
      return true;
    } catch (e: any) {
      setValidationError(e.message);
      return false;
    }
  };

  /* --------------------------------
     USER ACTIONS
  -------------------------------- */
  const updateFeatures = (next: string[]) => {
    setTouched(true);
    setLocalFeatures(next);
    setFeatures({ features: next });
  };

  const toggleFeature = (feature: string) => {
    updateFeatures(
      localFeatures.includes(feature)
        ? localFeatures.filter((f) => f !== feature)
        : [...localFeatures, feature]
    );
  };

  const removeFeature = (feature: string) => {
    updateFeatures(localFeatures.filter((f) => f !== feature));
  };

  const addFeature = () => {
    const value = newFeature.trim();
    if (!value) {
      setValidationError("Please enter a feature name");
      return;
    }
    if (localFeatures.includes(value)) {
      setValidationError("This feature is already added");
      return;
    }

    updateFeatures([...localFeatures, value]);
    setNewFeature("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  /* --------------------------------
     IMPERATIVE API
  -------------------------------- */
  useImperativeHandle(ref, () => ({
    handleSubmit: validate,
    isValid: localFeatures.length > 0,
    get values() {
      return { features: localFeatures };
    },
  }));

  /* --------------------------------
     UI (UNCHANGED)
  -------------------------------- */
  return (
    <div className="mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Property Features
      </h2>

      {isEditMode && initialData?.features?.length! > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-[#57713A]">
            <span className="font-semibold">Current Features:</span>{" "}
            {initialData?.features.length} loaded
          </p>
        </div>
      )}

      {/* Predefined features */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">
          Select Common Features
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {predefinedFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={localFeatures.includes(feature)}
                onChange={() => toggleFeature(feature)}
                className="mr-3 h-4 w-4 accent-[#57713A]"
              />
              <label className="text-sm cursor-pointer">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Selected features */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">
          Selected Features ({localFeatures.length})
        </h3>

        {localFeatures.length === 0 ? (
          <div className="p-4 bg-[#57713A]/30 rounded-lg">
            <p className="text-sm text-[#57713A]">
              No features selected
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
            {localFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center bg-[#57713A]/10 rounded-full px-3 py-1.5 text-sm border-[#57713A] border"
              >
                <img
                  src="/markgood.svg"
                  className="mr-2 w-4 h-4"
                  alt=""
                />
                <span>{feature}</span>
                <button
                  onClick={() => removeFeature(feature)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <BiX size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add custom feature */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">
          Add Custom Feature
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter custom feature..."
            className="flex-1 bg-gray-100 border rounded-[60px] px-5 py-3 text-sm"
          />

          <button
            type="button"
            onClick={addFeature}
            className="px-6 py-3 bg-[#57713A]/30 text-[#57713A] hover:bg-[#57713A]/50 rounded-[60px]"
          >
            Add Feature
          </button>
        </div>
      </div>

      {/* Validation */}
      {validationError && (
        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">
            {validationError}
          </p>
        </div>
      )}

      {touched && localFeatures.length === 0 && !validationError && (
        <div className="p-3 bg-[#57713A]/30 rounded-lg">
          <p className="text-sm text-[#57713A]">
            At least one feature is required
          </p>
        </div>
      )}
    </div>
  );
});

FeaturesInput.displayName = "FeaturesInput";
export default FeaturesInput;
