import React from "react";
import { useGetUser } from "../../utils/hooks/query";
import SmallLoader from "../SmallLoader";

export default function Cardone() {
  const { data, isLoading } = useGetUser();
  return (
    <div className="bg-white rounded-[30px] px-6 sm:px-[41px] pt-5 sm:pt-[25px] pb-6 sm:pb-[33px]">
      {isLoading ? (
        <SmallLoader classname="!h-[70px]" />
      ) : (
        <>
          <p className="font-[350] text-xl sm:text-2xl text-dark">
            {data?.user.first_name} {data?.user.last_name}
          </p>
          {/* <h1 className="font-bold text-xs sm:text-sm text-dark text-right">View Profile</h1> */}

          <div className="flex items-center leading-tight font-light text-xs sm:text-sm md:text-base text-dark mt-2">
            <img src="/batch.svg" alt="Badge" className="h-4 w-4 mr-2" />
            {data?.user.personnel}
          </div>
        </>
      )}
    </div>
  );
}
