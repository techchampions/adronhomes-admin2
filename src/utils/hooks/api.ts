import {
  AccountDetailsResponse,
  CreateAccountPayload,
} from "../../pages/Properties/types/AccountDetailsTypes";
import { CustomersResponse } from "../../pages/Properties/types/CustomerTypes";
import { DirectorDashboardResponse } from "../../pages/Properties/types/DirectorDataTypes";
import {
  HeadersResponse,
  UpdateHeaderPayload,
  UpdateHeaderResponse,
} from "../../pages/Properties/types/HeaderDataTypes";
import {
  CreateLeaderPayload,
  CreateLeadershipResponse,
  DeleteLeadershipResponse,
  EditLeaderPayload,
  LeadershipItem,
  LeadershipResponse,
} from "../../pages/Properties/types/LeadershipDataTypes";
import { NotificationsResponse } from "../../pages/Properties/types/NotificationTypes";
import {
  CreateOfficeLocationPayload,
  EditOfficeLocationPayload,
  OfficeLocationsResponse,
} from "../../pages/Properties/types/OfficeLocationsTypes";
import {
  PropertiesRequestResponse,
  PropertyByIdRequestsResponse,
} from "../../pages/Properties/types/PropertyRequestTypes";
import { SliderByTypeRes } from "../../pages/Properties/types/SliderByTypeResponse";
import { GetPropertyByIdResponse } from "../../pages/Properties/types/SoosarPropertyTypes";
import {
  UploadSliderPayload,
  UploadSliderResponse,
} from "../../pages/Properties/types/UploadSilderPayload";
import { UsersAndPropertiesResponse } from "../../pages/Properties/types/UsersNPropertiesListTypes";
import adminApi from "./ApiClient";
import adronApi from "./GeneralApiClient";

//Get Sliders By Type
export const getSliderByType = async (
  type: string
): Promise<SliderByTypeRes> => {
  const endpoint = `sliders?type=${type.toString()}`;
  const response = await adminApi.get(endpoint);
  return response.data;
};

// Upload Slider By type
export const uploadSliderByType = async (
  payload: Partial<UploadSliderPayload>
): Promise<UploadSliderResponse> => {
  const formData = new FormData();
  if (payload.type) formData.append("type", payload.type);
  if (payload.image)
    payload.image.forEach((image, index) => {
      formData.append("image", image);
    });
  if (payload.mobile_image)
    payload.mobile_image.forEach((image, index) => {
      formData.append("mobile_image", image);
    });

  const res = await adminApi.post("/sliders/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
//Delete Slider By Id
export interface DeleteSliderResponse {
  message: string;
  status: boolean;
}
export const deleteSliderById = async (
  id: number
): Promise<DeleteSliderResponse> => {
  const endpoint = `/sliders/delete/${id}`;
  const response = await adminApi.delete(endpoint);
  return response.data;
};

// get Headers data
export const getHeadersData = async (): Promise<HeadersResponse> => {
  const response = await adminApi.get("/headers");
  return response.data;
};

// Update Header Data
export const updateHeaderData = async (
  payload: Partial<UpdateHeaderPayload>
): Promise<UpdateHeaderResponse> => {
  const formData = new FormData();
  if (payload.header) formData.append("header", payload.header);
  if (payload.name) formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  if (payload.image) formData.append("image", payload.image);
  if (payload.list_description)
    payload.list_description.forEach((list, index) => {
      formData.append("list_description[]", list);
    });
  const endpoint = `/header/${payload.id}`;
  const res = await adminApi.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Get Leaders Data
export const getLeadersData = async (
  page: number
): Promise<LeadershipResponse> => {
  const endpoint = `/leaderships?page=${page}`;
  const response = await adminApi.get(endpoint);
  return response.data;
};

// Create Leader data
export const createLeaderData = async (
  payload: Partial<CreateLeaderPayload>
): Promise<CreateLeadershipResponse> => {
  const formData = new FormData();
  if (payload.position) formData.append("position", payload.position);
  if (payload.name) formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  if (payload.picture) formData.append("picture", payload.picture);
  const response = await adminApi.post("/create-leader", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
// Edit Leader data
export const editLeaderData = async (
  payload: Partial<EditLeaderPayload>
): Promise<CreateLeadershipResponse> => {
  const formData = new FormData();
  if (payload.position) formData.append("position", payload.position);
  if (payload.name) formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  if (payload.picture) formData.append("picture", payload.picture);
  const response = await adminApi.post(`/edit-leader/${payload.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete Leader data
export const deleteLeaderData = async (
  id: number
): Promise<DeleteLeadershipResponse> => {
  const endpoint = `/delete-leader/${id}`;
  const response = await adminApi.delete(endpoint);
  return response.data;
};

//Get All Account Details
export const getAllAccountDetails =
  async (): Promise<AccountDetailsResponse> => {
    const response = await adronApi.get("/account-details");
    return response.data;
  };

// Create Account Details
export const createAccountDetails = async (
  payload: Partial<CreateAccountPayload>
): Promise<AccountDetailsResponse> => {
  const formData = new FormData();
  if (payload.type) formData.append("type", payload.type);
  if (payload.bank_name) formData.append("bank_name", payload.bank_name);
  if (payload.account_name)
    formData.append("account_name", payload.account_name);
  if (payload.account_number)
    formData.append("account_number", payload.account_number);

  const response = await adminApi.post("/create-account-details", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
// Update Account Details
export const editAccountDetails = async (
  payload: Partial<CreateAccountPayload>
): Promise<AccountDetailsResponse> => {
  const formData = new FormData();
  if (payload.type) formData.append("type", payload.type);
  if (payload.bank_name) formData.append("bank_name", payload.bank_name);
  if (payload.account_name)
    formData.append("account_name", payload.account_name);
  if (payload.account_number)
    formData.append("account_number", payload.account_number);

  const response = await adminApi.post(
    `/update-account-details/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Delete Account data
export const deleteAccount = async (
  id: number | undefined
): Promise<DeleteLeadershipResponse> => {
  if (!id) {
    throw new Error("id is required");
  }
  const endpoint = `/delete-account-details/${id}`;
  const response = await adminApi.delete(endpoint);
  return response.data;
};

// Get Office Locations
export const getOfficeLocations =
  async (): Promise<OfficeLocationsResponse> => {
    const response = await adronApi.get("/office-info");
    return response.data;
  };

// Create Office Location
export const createOfficeLocation = async (
  payload: Partial<CreateOfficeLocationPayload>
): Promise<OfficeLocationsResponse> => {
  const formData = new FormData();
  if (payload.office_name) formData.append("office_name", payload.office_name);
  if (payload.office_address)
    formData.append("office_address", payload.office_address);
  if (payload.first_contact)
    formData.append("first_contact", payload.first_contact);
  if (payload.second_contact)
    formData.append("second_contact", payload.second_contact);
  if (payload.third_contact)
    formData.append("third_contact", payload.third_contact);

  const response = await adminApi.post("/create-office-info", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
// Edit Office Location
export const editOfficeLocation = async (
  payload: Partial<EditOfficeLocationPayload>
): Promise<OfficeLocationsResponse> => {
  const formData = new FormData();
  if (payload.office_name) formData.append("office_name", payload.office_name);
  if (payload.office_address)
    formData.append("office_address", payload.office_address);
  if (payload.first_contact)
    formData.append("first_contact", payload.first_contact);
  if (payload.second_contact)
    formData.append("second_contact", payload.second_contact);
  if (payload.third_contact)
    formData.append("third_contact", payload.third_contact);

  const response = await adminApi.post(
    `/update-office-info/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

//delete Location
export const deleteOfficeLoaction = async (
  id: number | undefined
): Promise<DeleteLeadershipResponse> => {
  if (!id) {
    throw new Error("id is required");
  }
  const endpoint = `/delete-office-info/${id}`;
  const response = await adminApi.delete(endpoint);
  return response.data;
};

// get Directors Data
export const getDirectorDashboardData =
  async (): Promise<DirectorDashboardResponse> => {
    const response = await adronApi.get("/director/dashboard");
    return response.data;
  };

//Get All Property Requests
export const getPropertyRequest = async (
  page: number
): Promise<PropertiesRequestResponse> => {
  const response = await adminApi.get(`/properties-requests?page=${page}`);
  return response.data;
};
//Get Requests for Property by ID
export const getPropertyRequestByID = async (
  id: number
): Promise<PropertyByIdRequestsResponse> => {
  const response = await adminApi.get(`/properties/${id}/requests`);
  return response.data;
};

//Get Properties by ID Data
export const getPropertyByID = async (
  id?: number | string
): Promise<GetPropertyByIdResponse> => {
  const response = await adronApi.get(`/property/${id}`);
  return response.data;
};
export const getEnquiryByID = async (
  id?: number | string
): Promise<GetPropertyByIdResponse> => {
  const response = await adminApi.get(`/requests/${id}`);
  return response.data;
};

// GET NOTIFICATIONS
export const getNotifications = async (
  page: number
): Promise<NotificationsResponse> => {
  const res = await adminApi.get(`/admin-notifications?page=${page}`);
  return res.data;
};
// GET CUSTOMERS
export const getCustomers = async (
  page: number
): Promise<CustomersResponse> => {
  const res = await adminApi.get(`/customers?page=${page}`);
  return res.data;
};
// GET CUSTOMERS
export const getCustomersAndProperties =
  async (): Promise<UsersAndPropertiesResponse> => {
    const res = await adminApi.get(`/users-and-properties`);
    return res.data;
  };

interface NotificationPayload {
  title: string;
  content: string;
  property_ids: number[];
  user_ids: number[];
}
export const sendNotification = async (payload: NotificationPayload) => {
  const res = await adminApi.post("/post-notification", payload);
  return res.data;
};
