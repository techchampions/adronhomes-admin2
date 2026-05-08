'use client'

import { useState } from "react"
import { FaXmark } from "react-icons/fa6"
import { GiPaperClip } from "react-icons/gi"

type MessageModalProps = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  handleSend ?:()=>void
  message:any,
   setMessage:any,
   userImage:any,
   userNmae:any,
   loading:any
}

export default function MessageModal({ isOpen, setIsOpen ,handleSend,message, loading,setMessage,userImage,userNmae}: MessageModalProps) {

  const handleCancel = () => {
    setIsOpen(false)
  }
      const [messaging, setMessaging] = useState(loading)
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
            <img src={userImage?userImage:"/unknown.png"} alt="User avatar" className="w-full h-full object-cover" />
          </div>
          <span className="font-[350] text-dark text-lg max-w-xs truncate">{userNmae}</span>
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
  onClick={() => handleSend?.()}
  disabled={!message.trim() || loading}
  className={`px-6 py-3 text-xs md:text-sm font-bold rounded-full 
    ${!message.trim() || loading
      ? "bg-gray-300 text-white cursor-not-allowed"
      : "bg-[#79B833] text-white cursor-pointer"}
  `}
>
  Send Message
</button>

            {/* <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
              <GiPaperClip className="w-5 h-5 text-gray-600" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
