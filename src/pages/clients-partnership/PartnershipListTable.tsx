import React, { useState } from "react";
import { ClipboardList } from "lucide-react";
import { PartnershipRequest } from "../Properties/types/ClientsTypes";
import RequestCard from "./PartnerShipDetail";

interface PropertyTableProps {
  data: PartnershipRequest[];
}

export default function PartnershipListTable({ data }: PropertyTableProps) {
  const [showCard, setshowCard] = useState(false);
  const [item, setitem] = useState<PartnershipRequest>();
  return (
    <>
      <RequestCard
        isOpen={showCard}
        onClose={() => setshowCard(false)}
        item={item}
      />
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <div className="w-full space-y-2">
            <div className="grid grid-cols-5">
              <div className="py-4 pr-6  font-[325]   text-[#757575] text-xs">
                Client Name
              </div>
              <div className="py-4 px-2  font-[325]   text-[#757575] text-xs ">
                Email
              </div>
              <div className="py-4 px-2  font-[325]   text-[#757575] text-xs ">
                Phone number
              </div>
              <div className="py-4 px-2  font-[325]   text-[#757575] text-xs ">
                Location
              </div>
              <div className="py-4 pl-4  font-[325]   text-[#757575] text-xs ">
                Action
              </div>
            </div>
            <div>
              {data.map((property, index) => (
                <div
                  key={`property-${index}`}
                  onClick={() => {
                    setitem(property);
                    setshowCard(true);
                  }}
                  className="cursor-pointer grid grid-cols-5 odd:bg-gray-100 p-2 items-center gap-2 md:gap-4 rounded-xl text-left"
                >
                  <div className="text-dark text-sm">
                    <div className="flex items-center">
                      <div className="w-10 h-10 overflow-hidden rounded-[15px]">
                        <ClipboardList className="h-full" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-left font-medium truncate">
                          {property.fullname}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" font-[325] text-dark text-sm truncate">
                    {property.email}
                  </div>
                  <div className=" font-[325] text-dark text-sm truncate ">
                    {property.phone_number}
                  </div>
                  <div className=" font-[325] text-dark text-sm truncate ">
                    {property.location}
                  </div>
                  <div className=" text-sm">
                    <button
                      onClick={() => {
                        setitem(property);
                        setshowCard(true);
                      }}
                      className="bg-[#272727] cursor-pointer text-white px-4 py-2 rounded-full text-xs font-[350] hover:bg-gray-800 transition-colors whitespace-nowrap"
                      aria-label="View requests"
                    >
                      View Requests
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
