import {
  AccountDetailsResponse,
  CreateAccountPayload,
} from "../../pages/Properties/types/AccountDetailsTypes";
import {
  PartnershipRequestByIDResponse,
  PartnershipRequestResponse,
} from "../../pages/Properties/types/ClientsTypes";
import { CustomersResponse } from "../../pages/Properties/types/CustomerTypes";
import { DirectorDashboardResponse } from "../../pages/Properties/types/DirectorDataTypes";
import {
  Location,
  PropertyLocationsResponse,
} from "../../pages/Properties/types/EstateLocationTypes";
import {
  FAQItem,
  FAQPayload,
  FAQResponse,
} from "../../pages/Properties/types/FAQsTypes";
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
import {
  SettingItem,
  SettingsResponse,
  SocialPayload,
} from "../../pages/Properties/types/SocialsTypes";
import { GetPropertyByIdResponse } from "../../pages/Properties/types/SoosarPropertyTypes";
import {
  ApiResponse,
  Testimonial,
  TestimonialPayload,
} from "../../pages/Properties/types/TestimonialTypes";
import {
  UploadSliderPayload,
  UploadSliderResponse,
} from "../../pages/Properties/types/UploadSilderPayload";
import { GetUserResponse } from "../../pages/Properties/types/UserProfileTypes";
import { UsersAndPropertiesResponse } from "../../pages/Properties/types/UsersNPropertiesListTypes";
import adminApi from "./ApiClient";
import adronApi from "./GeneralApiClient";

//Get Sliders By Type
export const getSliderByType = async (
  type: string
): Promise<SliderByTypeRes> => {
  const endpoint = `sliders?type=${type.toString()}`;
  const response = await adronApi.get(endpoint);
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
  if (payload.email) formData.append("email", payload.email);

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
  if (payload.email) formData.append("email", payload.email);

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

export const getPartnershipRequests = async (
  page: number
): Promise<PartnershipRequestResponse> => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page.toString());
  }
  const response = await adminApi.get(`/clients`, {
    params: params,
  });
  return response.data;
};

//Get All Property Requests
export const getPropertyRequest = async (
  page: number,
  director_id?: number
): Promise<PropertiesRequestResponse> => {
  const params = new URLSearchParams();
  if (director_id) params.append("director_id", director_id.toString());
  if (page) {
    params.append("page", page.toString());
  }
  const response = await adronApi.get(`/director/properties-requests`, {
    params: params,
  });
  return response.data;
  // const endpoint = director_id?`properties-requests?page=${page}`
  // const response = await adminApi.get(`/properties-requests?page=${page}`);
  // return response.data;
};
//Get Requests for Property by ID
export const getPropertyRequestByID = async (
  id: number
): Promise<PropertyByIdRequestsResponse> => {
  const response = await adronApi.get(`/director/properties/${id}/requests`);
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
  const response = await adronApi.get(`/director/request/${id}`);
  return response.data;
};
export const getPartnershipByID = async (
  id?: number | string
): Promise<PartnershipRequestByIDResponse> => {
  const response = await adminApi.get(`/client/${id}`);
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

// Get User Profile
export const getUser = async (): Promise<GetUserResponse> => {
  const response = await adronApi.get("/user-profile");
  return response.data;
};
// Get Testimonials
export const getTestimonials = async (): Promise<ApiResponse> => {
  const response = await adronApi.get("/testimonials");
  return response.data;
};

export const updateTestimonial = async (
  payload: Partial<TestimonialPayload>
): Promise<Testimonial> => {
  const formData = new FormData();
  if (payload.client_name) formData.append("client_name", payload.client_name);
  if (payload.client_comment)
    formData.append("client_comment", payload.client_comment);
  if (payload.video_link) formData.append("video_link", payload.video_link);
  if (payload.client_image)
    formData.append("client_image", payload.client_image);

  const response = await adminApi.post(
    `/update-testimony/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const createTestimony = async (
  payload: Partial<TestimonialPayload>
): Promise<Testimonial> => {
  const formData = new FormData();
  if (payload.client_name) formData.append("client_name", payload.client_name);
  if (payload.client_comment)
    formData.append("client_comment", payload.client_comment);
  if (payload.video_link) formData.append("video_link", payload.video_link);
  if (payload.client_image)
    formData.append("client_image", payload.client_image);

  const response = await adminApi.post(`/create-testimony`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTestimony = async (
  payload: Partial<TestimonialPayload>
): Promise<Testimonial> => {
  const response = await adminApi.delete(`/delete-testimony/${payload.id}`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get User Profile
export const getSocials = async (): Promise<SettingsResponse> => {
  const response = await adminApi.get("/settings?type=social");
  return response.data;
};
export const getSettings = async (type: string): Promise<SettingsResponse> => {
  const response = await adminApi.get(`/settings?type=${type}`);
  return response.data;
};
export const getEstateLocation =
  async (): Promise<PropertyLocationsResponse> => {
    const response = await adronApi.get("/property-locations");
    return response.data;
  };

export const updateSocial = async (
  payload: Partial<SocialPayload>
): Promise<SettingItem> => {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.type) formData.append("type", payload.type);
  if (payload.value) formData.append("value", payload.value);

  const response = await adminApi.post(
    `/update-setting/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const updateSettings = async (
  payload: Partial<SocialPayload>
): Promise<SettingItem> => {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.type) formData.append("type", payload.type);
  if (payload.value) formData.append("value", payload.value);

  const response = await adminApi.post(
    `/update-setting/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getFAQs = async (): Promise<FAQResponse> => {
  const response = await adronApi.get("/faqs");
  return response.data;
};

export const createFAQs = async (
  payload: Partial<FAQPayload>
): Promise<FAQItem> => {
  const formData = new FormData();
  if (payload.question) formData.append("question", payload.question);
  if (payload.answer) formData.append("answer", payload.answer);

  const response = await adminApi.post(`/faq/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const updateFAQs = async (
  payload: Partial<FAQPayload>
): Promise<FAQItem> => {
  const formData = new FormData();
  if (payload.question) formData.append("question", payload.question);
  if (payload.answer) formData.append("answer", payload.answer);
  if (payload.faq_id) formData.append("faq_id", payload.faq_id.toString());

  const response = await adminApi.post(`/faq/edit`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteFAQs = async (
  payload: Partial<FAQPayload>
): Promise<FAQItem> => {
  const response = await adminApi.delete(`/faq/delete/${payload.faq_id}`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateEstate = async (payload: {
  id: number;
  formData: FormData;
}): Promise<Location> => {
  const response = await adminApi.post(
    `/update-property-location/${payload.id}`,
    payload.formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
