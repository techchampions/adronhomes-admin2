// InputField.tsx
import React, { InputHTMLAttributes, useState } from "react";
import { Field, FieldProps, getIn } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdError } from "react-icons/md";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  inputClassName?: string;
  isReadOnly?: boolean;
  isRequired?: boolean;
  showError?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  className = "",
  inputClassName = "",
  isReadOnly = false,
  isRequired = false,
  showError = true,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;
        const errorMessage = hasError ? meta.error : "";

        return (
          <div className={`w-full ${className}`}>
            {label && (
              <label 
                htmlFor={name} 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            
            <div className="relative">
              <input
                {...field}
                {...rest}
                id={name}
                type={inputType}
                placeholder={placeholder}
                readOnly={isReadOnly}
                className={`
                  w-full px-4 py-3 rounded-[30px] border
                  ${hasError 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-200"
                  }
                  ${isReadOnly 
                    ? "bg-gray-100 cursor-not-allowed text-gray-600" 
                    : "bg-white"
                  }
                  focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${inputClassName}
                `}
              />
              
              {isPassword && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              )}
              
              {hasError && showError && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  <MdError size={20} />
                </div>
              )}
            </div>
            
            {hasError && showError && (
              <p className="mt-1 text-xs text-red-500 flex items-start gap-1">
                <span>{errorMessage}</span>
              </p>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default InputField;