import React from 'react'
import { IoCaretBack, IoCaretForward } from 'react-icons/io5'

export default function Pagination() {
  return (
    <div className="flex justify-center items-center gap-2 mt-[60px] pb-[39px]">
    <button className="rounded-full w-[27px] h-[27px]  border border-[#E6E6E6] flex justify-center items-center ">
      <IoCaretBack className="text-[#D9D9D9]" />
    </button>
    <div className="flex gap-1">
      <div className="w-2 h-2 rounded-full bg-black"></div>
      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
    </div>
    <button className="rounded-full w-[27px] h-[27px]  border border-[#E6E6E6] flex justify-center items-center">
      <IoCaretForward />
    </button>
  </div>
  )
}
