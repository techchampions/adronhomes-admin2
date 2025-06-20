import { useQuery } from "@tanstack/react-query";
import { SliderByTypeRes } from "../../pages/Properties/types/SliderByTypeResponse";
import { getHeadersData, getLeadersData, getSliderByType } from "./api";
import { HeadersResponse } from "../../pages/Properties/types/HeaderDataTypes";
import { LeadershipResponse } from "../../pages/Properties/types/LeadershipDataTypes";

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

export const useGetLeaders = (page: number) => {
  return useQuery<LeadershipResponse>({
    queryKey: ["Leaders", page],
    queryFn: () => getLeadersData(page),
  });
};
