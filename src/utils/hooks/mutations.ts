import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSliderById, uploadSliderByType } from "./api";

// Query hook for Uploading Slides
export const useUploadSlideByType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadSliderByType,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Sliders"],
      });
    },
  });
};

// Query hook for deleting Slides
export const useDeleteSlide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSliderById,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Sliders"],
      });
    },
  });
};
