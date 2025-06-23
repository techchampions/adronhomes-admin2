import { useQuery } from "@tanstack/react-query";
import { SliderByTypeRes } from "../../pages/Properties/types/SliderByTypeResponse";
import {
  getAllAccountDetails,
  getDirectorDashboardData,
  getHeadersData,
  getLeadersData,
  getOfficeLocations,
  getSliderByType,
} from "./api";
import { HeadersResponse } from "../../pages/Properties/types/HeaderDataTypes";
import { LeadershipResponse } from "../../pages/Properties/types/LeadershipDataTypes";
import { AccountDetailsResponse } from "../../pages/Properties/types/AccountDetailsTypes";
import { OfficeLocationsResponse } from "../../pages/Properties/types/OfficeLocationsTypes";
import { DirectorDashboardResponse } from "../../pages/Properties/types/DirectorDataTypes";

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

export const useGetAccounts = () => {
  return useQuery<AccountDetailsResponse>({
    queryKey: ["Accounts"],
    queryFn: getAllAccountDetails,
  });
};
export const useGetOfficeLocations = () => {
  return useQuery<OfficeLocationsResponse>({
    queryKey: ["Office-locations"],
    queryFn: getOfficeLocations,
  });
};
// Directors Dashboard
export const useGetDirectorDashboard = () => {
  return useQuery<DirectorDashboardResponse>({
    queryKey: ["Directors-dashboard"],
    queryFn: getDirectorDashboardData,
  });
};
