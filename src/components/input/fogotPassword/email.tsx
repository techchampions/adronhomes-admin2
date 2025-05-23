"use client"

import React, { useState } from "react"
interface EmailStepProps {
  onSubmit: (email: string) => void;
  error?: string;
  loading?: boolean;
}

export default function EmailStep({ onSubmit, error: propError, loading }: EmailStepProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    onSubmit(email)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg "  >
      <p className="mb-5 text-sm text-gray-600">
        Enter your email address and we&apos;ll send you a verification code to reset your password.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-[15px] bg-[#F5F5F5] rounded-[60px]  focus:outline-none  outline-0 focus:outline-0 ${
              error ? "border-red-500" : ""
            }`}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <div className="mt-6">
         {propError && <p className="text-sm text-red-500 my-6">{propError}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-[15px] px-4 bg-[#79B833] text-white rounded-[30px] focus:outline-none text-[12px] font-[500] ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Sending...' : 'Send Verification Code'}
      </button>
      </div>
    </form>
  )
}
