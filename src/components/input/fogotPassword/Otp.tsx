"use client"

import React, { useRef, useState, useEffect } from "react"

interface OtpStepProps {
  email: string;
  onSubmit: (otp: string[]) => void;
  error?: string;
  onResend: () => void;
  loading?: boolean;
}

export default function OtpStep({ email, onSubmit, error: propError, onResend, loading }: OtpStepProps) {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    inputRefs[0].current?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
        inputRefs[index - 1].current?.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    const pastedOtp = pastedData.slice(0, 4).split("")

    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedOtp.forEach((digit, index) => {
      if (index < 4) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)

    if (pastedOtp.length < 4) {
      inputRefs[pastedOtp.length].current?.focus()
    } else {
      inputRefs[3].current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.some((digit) => !digit)) {
      setError("Please enter all 4 digits of the verification code")
      return
    }

    setError("")
    onSubmit(otp)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg ">
      <p className="mb-5 text-sm text-gray-600">
   Type the verification code sent to  <span className="font-medium">{email}</span>.
      </p>

      <div className="space-y-4">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`h-12 w-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-[#79B833] text-[#79B833] ${error ? "border-red-500" : "border-gray-300"}`}
            />
          ))}
        </div>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <div className="text-center text-sm text-gray-500 mb-4">
          Didn&apos;t receive a code?{" "}
               <button
        type="button"
        onClick={onResend}
        disabled={loading}
        className="text-[#79B833] hover:underline disabled:opacity-50"
      >
        {loading ? 'Resending...' : 'Resend'}
      </button>
        </div>
      </div>

         {/* ... existing code ... */}
      {propError && <p className="text-center text-sm text-red-500 my-6">{propError}</p>}
 
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-[15px] px-4 bg-[#79B833] text-white rounded-[30px] focus:outline-none text-[12px] font-[500]  mt-4${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>
    </form>
  )
}
