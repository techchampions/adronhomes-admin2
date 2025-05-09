'use client'

import { useState } from "react"
import { FaXmark } from "react-icons/fa6"
import { GiPaperClip } from "react-icons/gi"

type MessageModalProps = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export default function MessageModal({ isOpen, setIsOpen }: MessageModalProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    console.log("Sending message:", message)
    setMessage("")
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[40px] w-full max-w-md flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="px-5 pt-5 pb-[5px] flex justify-between items-center">
          <h2 className="text-2xl font-[350] text-dark">Send Message</h2>
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
            <FaXmark size={14} />
          </button>
        </div>

        {/* Subheader */}
        <div className="px-5 pb-3">
          <p className="text-[#767676] text-[16px] font-[350]">User will get message as a notification.</p>
        </div>

        {/* User info */}
        <div className="px-5 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src="/profile.svg" alt="User avatar" className="w-full h-full object-cover" />
          </div>
          <span className="font-[350] text-dark text-lg">Ahmed Musa</span>
        </div>

        {/* Message input */}
        <div className=" pb-4 flex-grow">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here... "
            className="w-full lg:h-96 h-72 p-4 pb-56 rounded-[40px] bg-gray-100 resize-none focus:outline-none placeholder:textsm placeholder:italic placeholder:text-[#767676] placeholder:font-[325]"
          />
        </div>

        {/* Footer */}
        <div className="mt-auto p-5 flex items-center justify-between bg-white rounded-[40px] absolute bottom-0 w-full">
          <button onClick={handleCancel} className="text-[#D70E0E] font-bold text-xs md:text-sm  hover:text-red-600">
            Cancel
          </button>

          <div className="flex items-center gap-3">
          
            <button
              onClick={handleSend}
              className="px-6 py-3 bg-[#79B833]  text-xs md:text-sm text-white font-bold rounded-full"
            >
              Send Message
            </button>
            <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
              <GiPaperClip className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
