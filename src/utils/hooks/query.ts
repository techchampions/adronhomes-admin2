import { useQuery } from "@tanstack/react-query";
import { SliderByTypeRes } from "../../pages/Properties/types/SliderByTypeResponse";
import { getHeadersData, getSliderByType } from "./api";
import { HeadersResponse } from "../../pages/Properties/types/HeaderDataTypes";

// Query hook for properties and filtering
export const useGetSlidersByType = (type: string) => {
  return useQuery<SliderByTypeRes>({
    queryKey: ["Sliders", type],
    queryFn: () => getSliderByType(type),
  });
};

// Query hook for getting Headers
export const useGetHeaders = () => {
  return useQuery<HeadersResponse>({
    queryKey: ["Headers"],
    queryFn: getHeadersData,
  });
};
