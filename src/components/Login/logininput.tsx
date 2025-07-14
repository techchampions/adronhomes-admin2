"use client";

import { Field, ErrorMessage } from "formik";
import { useState } from "react";
import { BsEye } from "react-icons/bs";
import { FiEyeOff } from "react-icons/fi";

interface FormFieldProps {
  type: string;
  name: string;
  placeholder: string;
}

export const FormField = ({ type, name, placeholder }: FormFieldProps) => (
  <div className="w-full relative">
    <div className="mb-[9px]">
      <label htmlFor={name} className="">
        {placeholder}
      </label>
    </div>
    <Field
      type={type}
      id={name}
      name={name}
      // autoComplete="off"
      // onFocus={(e:any) => e.target.removeAttribute("readonly")}
      placeholder=" "
      className="w-full py-4     px-6 h-[54px]  focus:outline-none text-[#4F4F4F] font-[325] bg-[#F5F5F5] rounded-[60px] "
    />

    <ErrorMessage
      name={name}
      component="div"
      className="mt-1 text-sm text-red-600"
    />
  </div>
);

export const PasswordFormField = ({
  type,
  name,
  placeholder,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <div className="mb-[9px]">
        <label htmlFor={name} className="">
          {placeholder}
        </label>
      </div>
      <Field
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        id={name}
        name={name}
        autoComplete="off"
        placeholder=" "
        className="w-full py-4    px-6 h-[54px]  focus:outline-none text-[#4F4F4F] font-[325] bg-[#F5F5F5] rounded-[60px] "
      />

      {type === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-12 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <FiEyeOff className="h-5 w-5" />
          ) : (
            <BsEye className="h-5 w-5" />
          )}
        </button>
      )}
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-sm text-red-600"
      />
    </div>
  );
};
