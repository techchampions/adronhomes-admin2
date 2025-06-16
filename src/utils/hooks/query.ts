import { useQuery } from "@tanstack/react-query";
import { SliderByTypeRes } from "../../pages/Properties/types/SliderByTypeResponse";
import { getSliderByType } from "./api";

// Query hook for properties and filtering
export const useGetSlidersByType = (type: string) => {
  return useQuery<SliderByTypeRes>({
    queryKey: ["Sliders", type],
    queryFn: () => getSliderByType(type),
  });
};
