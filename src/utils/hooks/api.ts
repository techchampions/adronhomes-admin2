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
import { SliderByTypeRes } from "../../pages/Properties/types/SliderByTypeResponse";
import {
  UploadSliderPayload,
  UploadSliderResponse,
} from "../../pages/Properties/types/UploadSilderPayload";
import apiClient from "./ApiClient";

//Get Sliders By Type
export const getSliderByType = async (
  type: string
): Promise<SliderByTypeRes> => {
  const endpoint = `sliders?type=${type.toString()}`;
  const response = await apiClient.get(endpoint);
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

  const res = await apiClient.post("/sliders/create", formData, {
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
  const response = await apiClient.delete(endpoint);
  return response.data;
};

// get Headers data
export const getHeadersData = async (): Promise<HeadersResponse> => {
  const response = await apiClient.get("/headers");
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
  const res = await apiClient.post(endpoint, formData, {
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
  const response = await apiClient.get(endpoint);
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
  const response = await apiClient.post("/create-leader", payload, {
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
  const response = await apiClient.post(`/edit-leader/${payload.id}`, payload, {
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
  const response = await apiClient.delete(endpoint);
  return response.data;
};
