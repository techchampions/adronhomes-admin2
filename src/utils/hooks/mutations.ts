import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAccountDetails,
  createLeaderData,
  deleteAccount,
  deleteLeaderData,
  deleteSliderById,
  editAccountDetails,
  editLeaderData,
  updateHeaderData,
  uploadSliderByType,
} from "./api";

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

export const useEditHeader = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHeaderData,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Headers"],
      });
    },
  });
};

export const useAddLeader = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeaderData,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Leaders"],
      });
    },
  });
};
export const useEditLeader = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editLeaderData,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Leaders"],
      });
    },
  });
};

export const useDeleteLeader = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLeaderData,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Leaders"],
      });
    },
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccountDetails,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Accounts"],
      });
    },
  });
};
export const useEditAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editAccountDetails,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Accounts"],
      });
    },
  });
};
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Accounts"],
      });
    },
  });
};
