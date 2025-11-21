import React from "react";
import { FaDumbbell, FaMapMarkerAlt } from "react-icons/fa";
import { GiStreetLight } from "react-icons/gi";
import { useGetPropertyByID } from "../../utils/hooks/query";
import SmallLoader from "../../components/SmallLoader";
import { formatToNaira } from "../../utils/formatcurrency";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { Cctv } from "lucide-react";
type Prop = {
  id?: number | string;
};
const PropertySummary: React.FC<Prop> = ({ id }) => {
  const { data, isError, isLoading } = useGetPropertyByID(id);
  const property = data?.data.properties;
  const desiredFeatures = ["Gym", "CCTV", "Street Light"];
  const features = data?.data.properties.features.filter((feature) =>
    desiredFeatures.includes(feature)
  );
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
              <TfiRulerAlt2 /> {property?.size}
            </span>
            {features?.map((feature, i) => (
              <span className="flex items-center gap-1 truncate">
                {feature === "Gym" ? (
                  <FaDumbbell size={17} />
                ) : feature === "Street Light" ? (
                  <GiStreetLight size={17} />
                ) : (
                  <Cctv size={17} />
                )}
                {feature}
              </span>
            ))}
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
