import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GiStreetLight } from "react-icons/gi";
import { useGetPropertyByID } from "../../utils/hooks/query";
import SmallLoader from "../../components/SmallLoader";
import { formatToNaira } from "../../utils/formatcurrency";
import { TfiRulerAlt2 } from "react-icons/tfi";
type Prop = {
  id?: number | string;
};
const PropertySummary: React.FC<Prop> = ({ id }) => {
  const { data, isError, isLoading } = useGetPropertyByID(id);
  const property = data?.data.properties[0];
  if (isLoading) return <SmallLoader />;
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
        <img
          //   src="/treasure-park-bg.png"
          src={property?.display_image}
          className="h-[120px] w-[150px] rounded-lg "
          alt=""
        />
        <div className="w-full md:w-auto space-y-2">
          <h4 className="text-xl font-semibold">{property?.name}</h4>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <FaMapMarkerAlt className="h-4 w-4" />
            {property?.street_address}, {property?.lga}, {property?.state},{" "}
            {property?.country}
          </p>
          <div className="flex items-center text-sm md:text-xs mt-2 justify-between font-bold text-gray-500 gap-4">
            <span className="flex items-center gap-1 truncate">
              <TfiRulerAlt2 />{" "}
              {/* <img src="/ruler.svg" width={14} height={14} alt="dumbbell" /> */}
              {property?.size}
            </span>
            <span className="flex items-center gap-1 truncate">
              <GiStreetLight />
              Str Light
            </span>
            <span className="flex items-center gap-1 truncate">
              {/* <FaDumbbell /> */}
              <img src="/dumbbell.svg" width={18} height={18} alt="dumbbell" />
              Gym
            </span>
            <div className="flex items-center gap-1 text-xs ">
              {/* {property?.type} */}
            </div>
          </div>
        </div>
      </div>
      <div className="text-right text-2xl font-bold flex items-center gap-1">
        {formatToNaira(property?.price ?? 0)}
      </div>
    </div>
  );
};

export default PropertySummary;
