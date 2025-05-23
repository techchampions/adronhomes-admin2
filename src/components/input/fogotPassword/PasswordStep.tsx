"use client";

import React, { useState } from "react";
import { BsEye } from "react-icons/bs";
import { FiEyeOff } from "react-icons/fi";


interface PasswordStepProps {
  onSubmit: () => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  error?: string;
  loading?: boolean;
}

export default function PasswordStep({
  onSubmit,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error: propError,
  loading
}: PasswordStepProps) {
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    const confirmError = !confirmPassword
      ? "Please confirm your password"
      : password !== confirmPassword
      ? "Passwords do not match"
      : "";

    setErrors({
      password: passwordError,
      confirmPassword: confirmError,
    });

    if (passwordError || confirmError) return;

    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg "
    >
      <p className="mb-5 text-sm text-gray-600">
        Create a new password for your account. Your password should be at least
        8 characters long.
      </p>

      <div className="space-y-4">
        {/* New Password */}
        <div className="space-y-2">
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-[15px] bg-[#F5F5F5] rounded-[60px]  focus:outline-none  outline-0 focus:outline-0 ${
                errors.password
                  ? "border-red-500 pr-10"
                  : "border-gray-300 pr-10"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <BsEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
                 placeholder="Confirm Your Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-[15px] bg-[#F5F5F5] rounded-[60px]  focus:outline-none  outline-0 focus:outline-0${
                errors.confirmPassword
                  ? "border-red-500 pr-10"
                  : "border-gray-300 pr-10"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <BsEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {propError && <p className="text-sm text-red-500 my-6 ">{propError}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-[15px] px-4 bg-[#79B833] text-white rounded-[30px] focus:outline-none text-[12px] font-[500] mt-4 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}
