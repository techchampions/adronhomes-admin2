import React from 'react'

export default function Success() {
  return (
    <div className=' bg-white px-[150px] max-w-[500px] rounded-[40px] py-[80px] w-full justify-center items-center flex flex-col'>
      <img src='success.svg' className='mb-[25px]'/>
      <p className='text-dark text-[20px] font-[350] mb-[11px]'>Success</p>
      <h1 className=''>Message Sent successfully.</h1>
    </div>
  )
}
