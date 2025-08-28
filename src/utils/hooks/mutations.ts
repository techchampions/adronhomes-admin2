import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAccountDetails,
  createFAQs,
  createLeaderData,
  createOfficeLocation,
  createTestimony,
  deleteAccount,
  deleteFAQs,
  deleteLeaderData,
  deleteOfficeLoaction,
  deleteSliderById,
  deleteTestimony,
  editAccountDetails,
  editLeaderData,
  editOfficeLocation,
  sendNotification,
  updateEstate,
  updateFAQs,
  updateHeaderData,
  updateSettings,
  updateSocial,
  updateTestimonial,
  uploadSliderByType,
} from "./api";
import { toast } from "react-toastify";

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

export const useCreateOfficeLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOfficeLocation,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Office-locations"],
      });
    },
  });
};
export const useEditOfficeLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editOfficeLocation,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Office-locations"],
      });
    },
  });
};
export const useDeleteOfficeLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOfficeLoaction,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["Office-locations"],
      });
    },
  });
};

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendNotification,
    onSuccess: () => {
      // Refetch relevant data if needed
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTestimonial,
    onSuccess: () => {
      // Refetch relevant data if needed
      toast.success("Successfully updated testimony");
      queryClient.invalidateQueries({
        queryKey: ["testimonials"],
      });
    },
    onError: () => {
      toast.error("Failed to Update");
    },
  });
};
export const useCreateTestimony = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTestimony,
    onSuccess: () => {
      // Refetch relevant data if needed
      toast.success("Successfully created testimony");
      queryClient.invalidateQueries({
        queryKey: ["testimonials"],
      });
    },
    onError: () => {
      toast.error("Failed to Create");
    },
  });
};

export const useDeleteTestimony = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestimony,
    onSuccess: () => {
      // Refetch relevant data if needed
      toast.success("Successfully deleted testimony");
      queryClient.invalidateQueries({
        queryKey: ["testimonials"],
      });
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });
};

export const useUpdateSocial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSocial,
    onSuccess: () => {
      // Refetch relevant data if needed
      toast.success("Successfully updated link");
      queryClient.invalidateQueries({
        queryKey: ["socials"],
      });
    },
    onError: () => {
      toast.error("Failed to Update");
    },
  });
};
export const useUpdateSettingsInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      // Refetch relevant data if needed
      toast.success("Successfully updated info");
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: () => {
      toast.error("Failed to Update");
    },
  });
};

export const useCreateFAQs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFAQs,
    onSuccess: () => {
      // Refetch relevant data if needed
      toast.success("Successfully created FAQs");
      queryClient.invalidateQueries({
        queryKey: ["FAQs"],
      });
    },
    onError: () => {
      toast.error("Failed to Create");
    },
  });
};
export const useUpdateFAQs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFAQs,
    onSuccess: () => {
      // Refetch relevant data if needed
      toast.success("Successfully updated FAQs");
      queryClient.invalidateQueries({
        queryKey: ["FAQs"],
      });
    },
    onError: () => {
      toast.error("Failed to Update");
    },
  });
};

export const useDeleteFAQs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFAQs,
    onSuccess: () => {
      // Refetch relevant data if needed
      toast.success("Successfully deleted testimony");
      queryClient.invalidateQueries({
        queryKey: ["FAQs"],
      });
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });
};
export const useUpdateEstate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEstate,
    onSuccess: () => {
      // Refetch relevant data if needed
      toast.success("Successfully updated estate");
      queryClient.invalidateQueries({
        queryKey: ["estate-locations"],
      });
    },
    onError: () => {
      toast.error("Failed to Update");
    },
  });
};
