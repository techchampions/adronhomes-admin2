"use client";

import React, { useState, useEffect, useRef } from "react";
import EmailStep from "./email";
import OtpStep from "./Otp";
import PasswordStep from "./PasswordStep";
import PaymentSuccessfull from "./PaymentSuccessfull";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  OtpPasswordResetData,
  Sendotp,
} from "../../Redux/resetPassword/reset_Password_thunk";

type ForgotPasswordStep = "email" | "otp" | "password" | "success";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const {
    errors: ErrorSendOtp,
    success: successSendOtp,
    loading: loadingSendOtp,
  } = useSelector((state: RootState) => state.sendOtp);

  const {
    error: ErrorResetPassword,
    success: successResetPassword,
    loading: loadingResetPassword,
  } = useSelector((state: RootState) => state.reserPassword);

  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (successResetPassword) {
      setStep("success");
    }
  }, [successResetPassword]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setStep("email");
    setEmail("");
    setOtp(["", "", "", ""]);
    setPassword("");
    setConfirmPassword("");
  };

  const handleEmailSubmit = async (submittedEmail: string) => {
    setEmail(submittedEmail);
    const result = await dispatch(Sendotp({ email: submittedEmail }));
    if (result.meta.requestStatus === "fulfilled") {
      setStep("otp");
    }
  };

  const handleOtpSubmit = (submittedOtp: string[]) => {
    setOtp(submittedOtp);
    setStep("password");
  };

  const handlePasswordSubmit = async () => {
    const result = await dispatch(
      OtpPasswordResetData({
        otp: otp.join(""), // Convert array to string
        password: password,
        password_confirmation: confirmPassword,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      setStep("success");
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Forgot Password";
      case "otp":
        return "Enter Verification Code";
      case "password":
        return "Create New Password";
      case "success":
        return "Password Reset Successful";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="bg-white rounded-lg shadow-lg max-w-xs w-full max-h-full overflow-auto"
    >
      <header className="px-2 py-4 border-b flex justify-between">
        <h2 id="modal-title" className="text-base font-medium text-mydark">
          {getStepTitle()}
        </h2>
        <h2
          id="modal-title"
          className="text-base font- text-mydark cursor-pointer"
          onClick={onClose}
        >
          x
        </h2>
      </header>

      <main className="p-6">
        {step === "email" && (
          <EmailStep
            onSubmit={handleEmailSubmit}
            error={formatError(ErrorSendOtp)}
            loading={loadingSendOtp}
          />
        )}
        {step === "otp" && (
          <OtpStep
            email={email}
            onSubmit={handleOtpSubmit}
            error={formatError(ErrorSendOtp)}
            onResend={() => dispatch(Sendotp({ email }))}
            loading={loadingSendOtp}
          />
        )}
        {step === "password" && (
          <PasswordStep
            onSubmit={handlePasswordSubmit}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            error={formatError(ErrorResetPassword)}
            loading={loadingResetPassword}
          />
        )}
        {step === "success" && (
          <PaymentSuccessfull
            text={"Password reset successful"}
            // onClose={onClose}
          />
        )}
      </main>
    </div>
  );
}

const formatError = (error: any): string => {
  if (!error) return "";

  // If it's a string, return as-is
  if (typeof error === "string") return error;

  // If it's an object with a 'message', use that
  if (error.message) return error.message;

  // Handle Laravel-style errors like { email: ["The selected email is invalid."] }
  if (error.errors && typeof error.errors === "object") {
    return Object.entries(error.errors)
      .map(([field, messages]) => {
        const label = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize field name
        const msgArray = Array.isArray(messages) ? messages : [messages];
        return `${label}: ${msgArray.join(", ")}`;
      })
      .join("; ");
  }

  // Handle if the structure is directly the error object
  if (typeof error === "object") {
    return Object.entries(error)
      .map(([field, messages]) => {
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        const msgArray = Array.isArray(messages) ? messages : [messages];
        return `${label}: ${msgArray.join(", ")}`;
      })
      .join("; ");
  }

  return "An unknown error occurred.";
};
