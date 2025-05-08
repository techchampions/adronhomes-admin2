import React from 'react'

export default function Cardone() {
  return (
    <div className='bg-white rounded-[30px] px-6 sm:px-[41px] pt-5 sm:pt-[25px] pb-6 sm:pb-[33px]'>
    
        <p className="font-[350] text-xl sm:text-2xl text-dark">Mike Wellington</p>
        <h1 className="font-bold text-xs sm:text-sm text-dark text-right">View Profile</h1>

      
      <div className="flex items-center leading-tight font-light text-xs sm:text-sm md:text-base text-dark mt-2">
        <img src='/batch.svg' alt="Badge" className="h-4 w-4 mr-2" />
        Super Admin
      </div>
    </div>
  )
}