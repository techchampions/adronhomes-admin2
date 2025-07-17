import { useQuery } from "@tanstack/react-query";
import { SliderByTypeRes } from "../../pages/Properties/types/SliderByTypeResponse";
import {
  getAllAccountDetails,
  getCustomers,
  getCustomersAndProperties,
  getDirectorDashboardData,
  getEnquiryByID,
  getHeadersData,
  getLeadersData,
  getNotifications,
  getOfficeLocations,
  getPropertyByID,
  getPropertyRequest,
  getPropertyRequestByID,
  getSliderByType,
  getUser,
} from "./api";
import { HeadersResponse } from "../../pages/Properties/types/HeaderDataTypes";
import { LeadershipResponse } from "../../pages/Properties/types/LeadershipDataTypes";
import { AccountDetailsResponse } from "../../pages/Properties/types/AccountDetailsTypes";
import { OfficeLocationsResponse } from "../../pages/Properties/types/OfficeLocationsTypes";
import { DirectorDashboardResponse } from "../../pages/Properties/types/DirectorDataTypes";
import {
  PropertiesRequestResponse,
  PropertyByIdRequestsResponse,
} from "../../pages/Properties/types/PropertyRequestTypes";
import { GetPropertyByIdResponse } from "../../pages/Properties/types/SoosarPropertyTypes";
import { NotificationsResponse } from "../../pages/Properties/types/NotificationTypes";
import { CustomersResponse } from "../../pages/Properties/types/CustomerTypes";
import { UsersAndPropertiesResponse } from "../../pages/Properties/types/UsersNPropertiesListTypes";
import { GetUserResponse } from "../../pages/Properties/types/UserProfileTypes";

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
// Property Request List
export const useGetPropertyRequest = (page: number) => {
  return useQuery<PropertiesRequestResponse>({
    queryKey: ["properties-requests", page],
    queryFn: () => getPropertyRequest(page),
  });
};
export const useGetPropertyRequestByID = (id: number) => {
  return useQuery<PropertyByIdRequestsResponse>({
    queryKey: ["property-requests", id],
    queryFn: () => getPropertyRequestByID(id),
  });
};

// Query hook for properties page data with
export const useGetPropertyByID = (id?: number | string) => {
  return useQuery<GetPropertyByIdResponse>({
    queryKey: ["property", id], // include id in the key to avoid collisions
    queryFn: () => getPropertyByID(id),
    enabled: !!id, // prevents the query from running if id is undefined/null
  });
};
export const useGetEnquryByID = (id?: number | string) => {
  return useQuery<GetPropertyByIdResponse>({
    queryKey: ["request", id], // include id in the key to avoid collisions
    queryFn: () => getEnquiryByID(id),
    enabled: !!id, // prevents the query from running if id is undefined/null
  });
};
// Notifucation List
export const useGetNotifications = (page: number) => {
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", page],
    queryFn: () => getNotifications(page),
  });
};
// CUSTOMER List
export const useGetCustomers = (page: number) => {
  return useQuery<CustomersResponse>({
    queryKey: ["customers", page],
    queryFn: () => getCustomers(page),
  });
};
// CUSTOMER List
export const useGetCustomersAndProperties = () => {
  return useQuery<UsersAndPropertiesResponse>({
    queryKey: ["customers and properties"],
    queryFn: getCustomersAndProperties,
  });
};

// Query hook for Getting User
export const useGetUser = () => {
  return useQuery<GetUserResponse>({
    queryKey: ["user-profile"],
    queryFn: getUser,
  });
};
