import { Field, ErrorMessage, useField } from "formik";
import { FaExclamationCircle } from "react-icons/fa";
import React from "react";

interface InputFieldProps {
  type?:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "number"
    | "checkbox"
    | "textarea";
  placeholder?: string;
  name: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  rows?: number;
  isReadOnly?: boolean;
  autocomplete?: string;
}

const SoosarInputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder,
  name,
  icon,
  rightIcon,
  className = "",
  rows = 4,
  isReadOnly = false,
  autocomplete,
}) => {
  const [field, meta] = useField(name);
  const isTextarea = type === "textarea";
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full">
      <div
        className={`w-full relative flex gap-2 px-3 ${
          isTextarea ? "flex-col rounded-xl" : "flex-row rounded-full"
        } border bg-adron-body py-2 ${
          hasError ? "border-red-500" : "border-transparent"
        } ${className}`}
      >
        {/* Left Icon */}
        {icon && !isTextarea && <div className="flex items-center">{icon}</div>}

        {/* Field */}
        <Field
          as={isTextarea ? "textarea" : "input"}
          {...field}
          type={isTextarea ? undefined : type}
          placeholder={placeholder}
          rows={isTextarea ? rows : undefined}
          readOnly={isReadOnly}
          autoComplete={autocomplete}
          className={` text-gray-900 text-sm rounded-lg focus:ring-0 block w-full px-0 outline-none resize-none ${
            isTextarea ? "min-h-[60px]" : ""
          }`}
        />

        {/* Error Icon */}
        {!isTextarea && hasError && (
          <div className="flex items-center px-3">
            <FaExclamationCircle className="w-5 h-5 text-red-500" />
          </div>
        )}

        {/* Right Icon */}
        {rightIcon && <div className="flex items-center">{rightIcon}</div>}
      </div>

      {/* Error Message */}
      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-xs mt-1 text-left"
      />
    </div>
  );
};

export default SoosarInputField;
