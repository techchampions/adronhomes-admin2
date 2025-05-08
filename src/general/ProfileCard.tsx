import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import MessageModal from "../components/Modals/Massaging";

interface ProfileCardProps {
  profileImage: string;
  name: string;
  dateJoined: string;
  email: string;
  phone: string;
  stats: {
    viewedProperties: number;
    savedProperties: number;
    ownedProperties: number;
  };
  paymentInfo: {
    amount: string;
    date: string;
  };
  marketerName: string;
  buttonTexts: {
    sendMessage: string;
    removeClient: string;
  };
}

export default function ProfileCard({
  profileImage,
  name,
  dateJoined,
  email,
  phone,
  stats,
  paymentInfo,
  marketerName,
  buttonTexts,
}: ProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <><div className="bg-white rounded-[30px] p-6 lg:p-0 lg:px-8 lg:pl-[152px] md:pr-[20px] md:pb-[34px] lg:flex md:space-x-8 lg:space-x-[70px] ">
      <div className="w-full lg:w-[256px] justify-center flex flex-col items-center pt-[34px] mb-8 lg:mb-0 pb-6">
        <img
          src={profileImage}
          alt={name}
          className="w-[86px] h-[86px] rounded-full mb-[26px]" />
        <p className="font-[350] text-2xl mb-[8px] text-dark">{name}</p>
        <h1 className="font-[300] text-sm mb-[15px] text-dark">
          Date Joined: {dateJoined}
        </h1>
        <h2 className="text-lg md:text-[20px] font-[350] mb-[10px] text-dark">
          {email}
        </h2>
        <h3 className="text-lg md:text-[20px] font-[325] text-dark">{phone}</h3>
      </div>

      <div className="flex flex-col w-full">
        <div className="bg-[#F5F5F5] px-4 md:px-[48px] pt-[31px] pb-[34px] flex flex-col sm:flex-row justify-between gap-4 rounded-b-[40px] rounded-t-[40px] lg:rounded-t-none lg:rounded-b-[40px] mb-[20px]">
          <div className="w-full sm:w-[126px] justify-center flex flex-col items-center">
            <p className="text-[32px] font-[350] mb-[8px]">{stats.viewedProperties}</p>
            <h1 className="text-sm font-[300] text-center">Viewed Properties</h1>
          </div>
          <div className="w-full sm:w-[126px] justify-center flex flex-col items-center">
            <p className="text-[32px] font-[350] mb-[8px]">{stats.savedProperties}</p>
            <h1 className="text-sm font-[300] text-center">Saved Properties</h1>
          </div>
          <div className="w-full sm:w-[126px] justify-center flex flex-col items-center">
            <p className="text-[32px] font-[350] mb-[8px]">{stats.ownedProperties}</p>
            <h1 className="text-sm font-[300] text-center">Owned Properties</h1>
          </div>
        </div>

        <div className="w-full justify-center flex flex-col items-center text-center md:text-left">
          <p className="text-base font-[350] text-dark mb-2">
            <span className="text-[#767676]">Next Payment:</span> {paymentInfo.amount} {paymentInfo.date}
          </p>
          <p className="text-base font-[350] text-dark mb-4">
            <span className="text-[#767676] font-[325]">Marketer in charge: </span> {marketerName}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-5">
            <button className="bg-[#272727] text-white font-bold text-sm rounded-[30px] py-[14px] px-[44px]" onClick={()=>setIsOpen(true)}>
              {buttonTexts.sendMessage}
            </button>
            <button className="bg-white text-[#D70E0E] font-bold text-sm rounded-[30px] py-[14px] px-[44px] border border-[#D70E0E]">
              {buttonTexts.removeClient}
            </button>
          </div>
        </div>
      </div>
      <MessageModal isOpen={isOpen} setIsOpen={setIsOpen } />
    </div></>
  );
}