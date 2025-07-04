import React from "react";
import LoadingAnimations from "../components/LoadingAnimations";
export interface PropertyData {
  id: number;
  name: string;
  display_image: string;
  photos: string[];
  size: string;
  price: number;
  type: number;
  no_of_bedroom: number | null;
  slug: string;
  features: string[] | string; // Can be array or stringified array
  overview: string;
  description: string;
  street_address: string;
  country: string | null;
  state: string | null;
  lga: string | null;
  created_at: string | null;
  updated_at: string | null;
  area: string | null;
  property_map: string | null;
  property_video: string | null;
  virtual_tour: string | null;
  subscriber_form: string | null;
  status: string;
  initial_deposit: number;
  is_sold: boolean;
  is_active: boolean;
  property_duration_limit: number;
  payment_schedule: string[] | string | null; // Can be array or stringified array
  category: string;
  is_discount: boolean;
  discount_name: string | null;
  discount_percentage: string | null;
  discount_units: string | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  parking_space: string | null;
  number_of_bathroom: number | null;
  number_of_unit: number | null;
  unit_sold: number | null;
  unit_available: number | null;
  property_agreement: string | null;
  payment_type: string | null;
  location_type: string | null;
  purpose: string | null;
  year_built: string | null;
  total_amount: number;
}

interface PropertyTableProps {
  data: PropertyData[];
  isLoading: boolean;
}

const DirectorProperttList: React.FC<PropertyTableProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return <LoadingAnimations loading={isLoading} />;
  }
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] md:min-w-0">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left">
              <th className="py-4 pr-6 font-normal text-[#757575] text-xs w-[220px]">
                Property Name
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[120px]">
                Price
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[100px]">
                Property Type
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[80px]">
                Total units
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[80px]">
                Available units
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[80px]">
                Units sold
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((property) => (
                <tr key={`property-${property.id}`} className="cursor-pointer">
                  <td className="py-4 pr-6 text-dark text-sm max-w-[220px]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 overflow-hidden rounded-[15px] shrink-0 bg-gray-100">
                        <img
                          src={
                            property.display_image ||
                            "/default-property-image.jpg"
                          }
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-[350] truncate mb-[12px]">
                          {property.name}
                        </div>
                        <div className="font-[325] text-[#757575] text-xs truncate flex">
                          <img src={"/location.svg"} className="mr-1" />
                          {property.street_address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate max-w-[120px]">
                    ₦{property.price?.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate max-w-[100px]">
                    {property.type === 1 ? "Land" : "Residential"}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate max-w-[80px]">
                    {property.number_of_unit || "N/A"}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate max-w-[80px]">
                    {property.unit_available}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate max-w-[80px]">
                    {property.unit_sold}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DirectorProperttList;
