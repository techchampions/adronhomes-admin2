import { SliderByTypeData } from "./SliderByTypeResponse";

export interface UploadSliderPayload {
  image?: File[];
  type: string;
  mobile_image?: File[];
}
export interface UploadSliderResponse {
  status: boolean;
  data: SliderByTypeData[];
}
