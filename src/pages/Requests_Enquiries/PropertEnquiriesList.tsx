import React, { useState } from "react";
import {
  Inquiry,
  PropertyRequest,
} from "../Properties/types/PropertyRequestTypes";
import { formatToNaira } from "../../utils/formatcurrency";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatdate";
import EnquiryCard from "../../components/PropertyRequest/EnquiryCard";

interface EnquiriesListProps {
  data: Inquiry[];
}

export default function PropertyEnquiriesList({ data }: EnquiriesListProps) {
  const navigate = useNavigate();
  const [item, setitem] = useState<Inquiry>();
  const [showCard, setshowCard] = useState(false);
  return (
    <>
      <EnquiryCard
        isOpen={showCard}
        onClose={() => setshowCard(false)}
        item={item}
      />
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full min-w-[800px]">
            <tbody>
              {data.map((enquiry, index) => (
                <tr
                  key={`enquiry-${index}`}
                  className="cursor-pointer"
                  onClick={() => {
                    setitem(enquiry);
                    setshowCard(true);
                  }}
                >
                  <td className="py-4 pr-6 text-dark text-sm max-w-[150px]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 overflow-hidden rounded-[15px] shrink-0 bg-gray-100">
                        <img
                          src={"/default-enquiry-image.jpg"}
                          alt={enquiry.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate mb-1">
                          {enquiry.name}
                        </div>
                        <div className="flex items-center text-[#757575] text-sm truncate">
                          viewed on {formatDate(enquiry.created_at)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-[325] text-dark text-sm truncate max-w-[300px]">
                    {enquiry.description}
                  </td>
                  <td className="py-4 px-2 text-dark text-xs truncate max-w-[130px] font-medium">
                    {enquiry.email}
                  </td>
                  <td className="py-4 px-2 text-dark text-xs truncate max-w-[140px] font-medium">
                    {enquiry.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
