import React from "react";
import { useGetUser } from "../../utils/hooks/query";
import SmallLoader from "../SmallLoader";
import { useNavigate, useNavigation } from "react-router-dom";
// import { useRouter } from "next/navigation";

export default function Cardone() {
  const { data, isLoading } = useGetUser();
  const router = useNavigate();

  return (
    <div className="bg-white rounded-[30px] px-6 sm:px-[41px] pt-5 sm:pt-[25px] pb-6 sm:pb-[33px]">
      {isLoading ? (
        <SmallLoader classname="!h-[70px]" />
      ) : (
        <>
          <div className="flex justify-between items-start">
            <p className="font-[350] text-xl sm:text-2xl text-dark">
              {data?.user.first_name} {data?.user.last_name}
            </p>

            <button
              onClick={() => router("/settings/reset-password")}
              className="font-bold text-xs sm:text-sm text-primary hover:underline"
            >
             Reset password
            </button>
          </div>

          <div className="flex items-center leading-tight font-light text-xs sm:text-sm md:text-base text-dark mt-2">
            <img src="/batch.svg" alt="Badge" className="h-4 w-4 mr-2" />
            {data?.user.personnel}
          </div>
        </>
      )}
    </div>
  );
}
