// import React, { useRef, useState } from "react";
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { IoInformationCircle, IoSave } from "react-icons/io5";
// import { SliderByTypeData } from "../../../pages/Properties/types/SliderByTypeResponse";
// import Button from "../../input/Button";
// import {
//   useDeleteSlide,
//   useUploadSlideByType,
// } from "../../../utils/hooks/mutations";
// import { toast } from "react-toastify";

// type SliderSectionProps = {
//   title: string;
//   description: string;
//   sliderType: string;
//   initialSliders: SliderByTypeData[];
// };

// type PendingSlider = {
//   id: number;
//   file: File;
//   preview: string;
// };
// type ChangedSliders = {
//   id: number;
// };

// // Simple numeric ID generator
// let tempIdCounter = Date.now();
// const generateTempId = () => tempIdCounter++;

// const SortableSliderItem: React.FC<{
//   slider: SliderByTypeData | PendingSlider;
//   onChange: (id: number, file: File) => void;
//   onDelete: (id: number) => void;
//   isUploading?: boolean;
//   isDeleting?: boolean;
// }> = ({ slider, onChange, onDelete, isUploading, isDeleting }) => {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: slider.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} className="w-[320px] rounded-lg">
//       <div
//         {...attributes}
//         {...listeners}
//         className={`border h-[180px] border-gray-300 rounded-lg p-2 relative ${
//           isUploading ? "opacity-75" : ""
//         }`}
//       >
//         <img
//           src={"image" in slider ? slider.image : slider.preview}
//           alt="slider"
//           className="w-full h-full object-cover rounded-lg"
//         />
//       </div>
//       <div className="flex justify-between text-sm text-blue-600 mt-2 px-2">
//         <button
//           onClick={() => inputRef.current?.click()}
//           className="hover:underline"
//           disabled={isUploading}
//         >
//           Change Image
//         </button>
//         <button
//           onClick={() => onDelete(slider.id)}
//           className="text-red-500 hover:underline"
//           disabled={isUploading || isDeleting}
//         >
//           Delete
//         </button>
//       </div>
//       <input
//         type="file"
//         ref={inputRef}
//         className="hidden"
//         accept="image/*"
//         onChange={(e) => {
//           if (e.target.files?.[0]) {
//             onChange(slider.id, e.target.files[0]);
//           }
//         }}
//         disabled={isUploading}
//       />
//     </div>
//   );
// };

// export const SliderSection: React.FC<SliderSectionProps> = ({
//   title,
//   description,
//   initialSliders,
//   sliderType,
// }) => {
//   const [existingSliders, setExistingSliders] =
//     useState<SliderByTypeData[]>(initialSliders);
//   const [pendingSliders, setPendingSliders] = useState<PendingSlider[]>([]);
//   const [changedSliders, setChangedSliders] = useState<ChangedSliders[]>([]);
//   const { mutate: uploadSlide, isPending: isUploading } =
//     useUploadSlideByType();
//   const { mutate: deleteSlide, isPending: isDeleting } = useDeleteSlide();

//   const sensors = useSensors(useSensor(PointerSensor));

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       // Combine all sliders for sorting
//       const allSliders = [...existingSliders, ...pendingSliders];
//       const oldIndex = allSliders.findIndex((s) => s.id === active.id);
//       const newIndex = allSliders.findIndex((s) => s.id === over?.id);
//       const newSliders = arrayMove(allSliders, oldIndex, newIndex);

//       // Separate back into existing and pending
//       setExistingSliders(
//         newSliders.filter((s) => "imageUrl" in s) as SliderByTypeData[]
//       );
//       setPendingSliders(
//         newSliders.filter((s) => !("imageUrl" in s)) as PendingSlider[]
//       );
//     }
//   };

//   const handleImageChange = (id: number, file: File) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       // Check if this is an existing slider
//       const existingIndex = existingSliders.findIndex((s) => s.id === id);
//       if (existingIndex >= 0) {
//         // Remove from existing sliders
//         setExistingSliders((prev) => prev.filter((s) => s.id !== id));
//         // Add to changed slider for later deleting
//         setChangedSliders((prev) => [...prev, { id: id }]);
//         // Add to pending sliders with the new file
//         setPendingSliders((prev) => [
//           ...prev,
//           {
//             id: generateTempId(), // New temporary ID
//             file,
//             preview: reader.result as string,
//           },
//         ]);
//       } else {
//         // For pending sliders, just update the file
//         setPendingSliders((prev) =>
//           prev.map((s) =>
//             s.id === id ? { ...s, file, preview: reader.result as string } : s
//           )
//         );
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleDelete = (id: number) => {
//     if (existingSliders.length + pendingSliders.length <= 2) {
//       toast.error("You must have at least 2 sliders.");
//       return;
//     }

//     // Check if this is an existing slider or pending slider
//     const existingIndex = existingSliders.findIndex((s) => s.id === id);
//     if (existingIndex >= 0) {
//       deleteSlide(id, {
//         onSuccess: () => {
//           setExistingSliders((prev) => prev.filter((s) => s.id !== id));
//           toast.success("Slider deleted successfully");
//         },
//         onError: (error) => {
//           toast.error(error.message);
//         },
//       });
//     } else {
//       setPendingSliders((prev) => prev.filter((s) => s.id !== id));
//     }
//   };

//   const handleNewSlider = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const newSlider: PendingSlider = {
//         id: generateTempId(),
//         file,
//         preview: reader.result as string,
//       };
//       setPendingSliders((prev) => [...prev, newSlider]);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleUploadAll = () => {
//     if (pendingSliders.length === 0) {
//       toast.info("No new sliders to upload");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("type", sliderType);

//     pendingSliders.forEach((slider) => {
//       formData.append("image", slider.file);
//       // If you need mobile images, add them here
//       // formData.append("mobile_image", slider.file);
//     });

//     uploadSlide(
//       {
//         type: sliderType,
//         image: pendingSliders.map((s) => s.file),
//         mobile_image: pendingSliders.map((s) => s.file),
//       },
//       {
//         onSuccess: (response) => {
//           toast.success(
//             `${pendingSliders.length} sliders uploaded successfully`
//           );
//           // Add the new sliders to existing sliders and clear pending
//           if (response.data && Array.isArray(response.data)) {
//             setExistingSliders((prev) => [...prev, ...response.data]);
//           }
//           setPendingSliders([]);
//           location.reload();
//         },
//         onError: (error) => {
//           toast.error(`Failed to upload sliders: ${error.message}`);
//         },
//       }
//     );
//     changedSliders.forEach((changedSlide) => {
//       deleteSlide(changedSlide.id, {
//         onSuccess: () => {
//           setExistingSliders((prev) =>
//             prev.filter((s) => s.id !== changedSlide.id)
//           );
//         },
//         onError: (error) => {
//           toast.error(error.message);
//         },
//       });
//     });
//   };

//   const newSliderInputRef = useRef<HTMLInputElement | null>(null);
//   const allSliders = [...existingSliders, ...pendingSliders];

//   return (
//     <div className="mb-10">
//       <div className="flex w-full justify-between items-center">
//         <div className="">
//           <h3 className="text-lg font-semibold mb-1">{title}</h3>
//           <p className="text-sm text-gray-600 mb-4">{description}</p>
//         </div>
//         <Button
//           label={`Upload ${pendingSliders.length} New Sliders`}
//           className="!w-fit px-5 text-xs"
//           isLoading={isUploading || isDeleting}
//           onClick={handleUploadAll}
//           icon={<IoSave />}
//           disabled={pendingSliders.length === 0 || isDeleting}
//         />
//       </div>

//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         <SortableContext
//           items={allSliders.map((s) => s.id)}
//           strategy={verticalListSortingStrategy}
//         >
//           <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {allSliders.map((slider) => (
//               <SortableSliderItem
//                 key={slider.id}
//                 slider={slider}
//                 onChange={handleImageChange}
//                 onDelete={handleDelete}
//                 isUploading={isUploading}
//                 isDeleting={isDeleting}
//               />
//             ))}
//             <div
//               className="w-[320px] h-[180px] border-dashed border-2 border-gray-300 flex items-center justify-center rounded-lg text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
//               onClick={() => newSliderInputRef.current?.click()}
//             >
//               <span className="text-xl font-semibold text-center">
//                 ＋<br />
//                 New Slider
//               </span>
//               <input
//                 type="file"
//                 ref={newSliderInputRef}
//                 className="hidden"
//                 accept="image/*"
//                 onChange={(e) => {
//                   if (e.target.files?.[0]) {
//                     handleNewSlider(e.target.files[0]);
//                   }
//                 }}
//                 disabled={isUploading}
//               />
//             </div>
//           </div>
//         </SortableContext>
//       </DndContext>

//       <div className="mt-3 text-xs text-gray-500">
//         <p>Minimum Resolution: 1500 x 1000 pixels</p>
//         <p>Recommended Aspect Ratio: 3:2</p>
//         <p>File Size: Max 5MB per image</p>
//         <p>Formats Supported: JPG, JPEG, PNG</p>
//         <p className="flex gap-1 items-center">
//           <IoInformationCircle className="h-4 w-4" />
//           Drag pictures to reorder them
//         </p>
//       </div>
//     </div>
//   );
// };

import React, { useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IoInformationCircle, IoSave } from "react-icons/io5";
import { SliderByTypeData } from "../../../pages/Properties/types/SliderByTypeResponse";
import Button from "../../input/Button";
import {
  useDeleteSlide,
  useUploadSlideByType,
} from "../../../utils/hooks/mutations";
import { toast } from "react-toastify";

type SliderSectionProps = {
  title: string;
  description: string;
  sliderType: string;
  initialSliders: SliderByTypeData[];
};

type PendingSlider = {
  id: number;
  desktopFile: File;
  mobileFile: File | null;
  desktopPreview: string;
  mobilePreview: string | null;
};

type ChangedSliders = {
  id: number;
};

// Simple numeric ID generator
let tempIdCounter = Date.now();
const generateTempId = () => tempIdCounter++;

const SortableSliderItem: React.FC<{
  slider: SliderByTypeData | PendingSlider;
  onChange: (id: number, file: File, imageType: "desktop" | "mobile") => void;
  onDelete: (id: number) => void;
  isUploading?: boolean;
  isDeleting?: boolean;
}> = ({ slider, onChange, onDelete, isUploading, isDeleting }) => {
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slider.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isExistingSlider = "image" in slider;
  const desktopImage = isExistingSlider ? slider.image : slider.desktopPreview;
  const mobileImage = isExistingSlider
    ? slider.mobile_image
    : slider.mobilePreview;

  return (
    <div ref={setNodeRef} style={style} className="w-[320px] rounded-lg">
      <div
        {...attributes}
        {...listeners}
        className={`border border-gray-300 rounded-lg p-2 relative ${
          isUploading ? "opacity-75" : ""
        }`}
      >
        <div className="flex space-x-2">
          {/* Desktop Image */}
          <div className="group relative">
            <div className="text-xs text-gray-500 mb-1">Desktop Image</div>
            <img
              src={desktopImage}
              alt="desktop slider"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg">
              <button
                onClick={() => desktopInputRef.current?.click()}
                className="text-white text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                disabled={isUploading}
              >
                Change
              </button>
            </div>
          </div>

          {/* Mobile Image */}
          <div className="group relative">
            <div className="text-xs text-gray-500 mb-1">Mobile Image</div>
            {mobileImage ? (
              <img
                src={mobileImage}
                alt="mobile slider"
                className="w-30 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-32 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-center text-gray-400">
                No mobile image
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg">
              <button
                onClick={() => mobileInputRef.current?.click()}
                className="text-white text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                disabled={isUploading}
              >
                {mobileImage ? "Change" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-blue-600 mt-2 px-2">
        <div className="space-x-2">
          <button
            onClick={() => desktopInputRef.current?.click()}
            className="hover:underline"
            disabled={isUploading}
          >
            Desktop
          </button>
          <button
            onClick={() => mobileInputRef.current?.click()}
            className="hover:underline"
            disabled={isUploading}
          >
            Mobile
          </button>
        </div>
        <button
          onClick={() => onDelete(slider.id)}
          className="text-red-500 hover:underline"
          disabled={isUploading || isDeleting}
        >
          Delete
        </button>
      </div>

      <input
        type="file"
        ref={desktopInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onChange(slider.id, e.target.files[0], "desktop");
          }
        }}
        disabled={isUploading}
      />

      <input
        type="file"
        ref={mobileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onChange(slider.id, e.target.files[0], "mobile");
          }
        }}
        disabled={isUploading}
      />
    </div>
  );
};

export const SliderSection: React.FC<SliderSectionProps> = ({
  title,
  description,
  initialSliders,
  sliderType,
}) => {
  const [existingSliders, setExistingSliders] =
    useState<SliderByTypeData[]>(initialSliders);
  const [pendingSliders, setPendingSliders] = useState<PendingSlider[]>([]);
  const [changedSliders, setChangedSliders] = useState<ChangedSliders[]>([]);
  const { mutate: uploadSlide, isPending: isUploading } =
    useUploadSlideByType();
  const { mutate: deleteSlide, isPending: isDeleting } = useDeleteSlide();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      // Combine all sliders for sorting
      const allSliders = [...existingSliders, ...pendingSliders];
      const oldIndex = allSliders.findIndex((s) => s.id === active.id);
      const newIndex = allSliders.findIndex((s) => s.id === over?.id);
      const newSliders = arrayMove(allSliders, oldIndex, newIndex);

      // Separate back into existing and pending
      setExistingSliders(
        newSliders.filter((s) => "image" in s) as SliderByTypeData[]
      );
      setPendingSliders(
        newSliders.filter((s) => !("image" in s)) as PendingSlider[]
      );
    }
  };

  const handleImageChange = (
    id: number,
    file: File,
    imageType: "desktop" | "mobile"
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Check if this is an existing slider
      const existingIndex = existingSliders.findIndex((s) => s.id === id);

      if (existingIndex >= 0) {
        // For existing sliders, we need to create a pending version
        const existingSlider = existingSliders[existingIndex];

        // Remove from existing sliders
        setExistingSliders((prev) => prev.filter((s) => s.id !== id));

        // Add to changed slider for later deleting
        setChangedSliders((prev) => [...prev, { id: id }]);

        // Create a pending slider with both images
        const newPendingSlider: PendingSlider = {
          id: generateTempId(),
          desktopFile: file,
          mobileFile: null,
          desktopPreview: reader.result as string,
          mobilePreview: null,
        };

        // If we're changing the desktop image, keep the mobile image from existing
        if (imageType === "desktop") {
          newPendingSlider.mobilePreview = existingSlider.mobile_image;
          // In a real app, you might need to fetch the mobile file if available
        } else {
          newPendingSlider.desktopPreview = existingSlider.image;
          newPendingSlider.mobilePreview = reader.result as string;
          newPendingSlider.mobileFile = file;
        }

        setPendingSliders((prev) => [...prev, newPendingSlider]);
      } else {
        // For pending sliders, update the specific image
        setPendingSliders((prev) =>
          prev.map((s) => {
            if (s.id === id) {
              if (imageType === "desktop") {
                return {
                  ...s,
                  desktopFile: file,
                  desktopPreview: reader.result as string,
                };
              } else {
                return {
                  ...s,
                  mobileFile: file,
                  mobilePreview: reader.result as string,
                };
              }
            }
            return s;
          })
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: number) => {
    if (existingSliders.length + pendingSliders.length <= 2) {
      toast.error("You must have at least 2 sliders.");
      return;
    }

    // Check if this is an existing slider or pending slider
    const existingIndex = existingSliders.findIndex((s) => s.id === id);
    if (existingIndex >= 0) {
      deleteSlide(id, {
        onSuccess: () => {
          setExistingSliders((prev) => prev.filter((s) => s.id !== id));
          toast.success("Slider deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    } else {
      setPendingSliders((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleNewSlider = (
    desktopFile: File,
    mobileFile: File | null = null
  ) => {
    const desktopReader = new FileReader();
    desktopReader.onload = () => {
      const mobileReader = mobileFile ? new FileReader() : null;

      if (mobileFile && mobileReader) {
        mobileReader.onload = () => {
          const newSlider: PendingSlider = {
            id: generateTempId(),
            desktopFile,
            mobileFile,
            desktopPreview: desktopReader.result as string,
            mobilePreview: mobileReader.result as string,
          };
          setPendingSliders((prev) => [...prev, newSlider]);
        };
        mobileReader.readAsDataURL(mobileFile);
      } else {
        const newSlider: PendingSlider = {
          id: generateTempId(),
          desktopFile,
          mobileFile: null,
          desktopPreview: desktopReader.result as string,
          mobilePreview: null,
        };
        setPendingSliders((prev) => [...prev, newSlider]);
      }
    };
    desktopReader.readAsDataURL(desktopFile);
  };

  const handleUploadAll = () => {
    if (pendingSliders.length === 0) {
      toast.info("No new sliders to upload");
      return;
    }

    const formData = new FormData();
    formData.append("type", sliderType);

    // Add all desktop images
    pendingSliders.forEach((slider) => {
      formData.append("image", slider.desktopFile);
    });

    // Add all mobile images (only if they exist)
    pendingSliders.forEach((slider) => {
      if (slider.mobileFile) {
        formData.append("mobile_image", slider.mobileFile);
      } else {
        // If no mobile image, use desktop image as fallback
        formData.append("mobile_image", slider.desktopFile);
      }
    });

    uploadSlide(
      {
        type: sliderType,
        image: pendingSliders.map((s) => s.desktopFile),
        mobile_image: pendingSliders.map((s) => s.mobileFile || s.desktopFile),
      },
      {
        onSuccess: (response) => {
          toast.success(
            `${pendingSliders.length} sliders uploaded successfully`
          );
          // Add the new sliders to existing sliders and clear pending
          if (response.data && Array.isArray(response.data)) {
            setExistingSliders((prev) => [...prev, ...response.data]);
          }
          setPendingSliders([]);
          location.reload();
        },
        onError: (error) => {
          toast.error(`Failed to upload sliders: ${error.message}`);
        },
      }
    );

    changedSliders.forEach((changedSlide) => {
      deleteSlide(changedSlide.id, {
        onSuccess: () => {
          setExistingSliders((prev) =>
            prev.filter((s) => s.id !== changedSlide.id)
          );
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    });
  };

  const newDesktopInputRef = useRef<HTMLInputElement | null>(null);
  const newMobileInputRef = useRef<HTMLInputElement | null>(null);
  const [newSliderFiles, setNewSliderFiles] = useState<{
    desktop: File | null;
    mobile: File | null;
  }>({ desktop: null, mobile: null });

  const handleNewDesktopImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewSliderFiles((prev) => ({ ...prev, desktop: e.target.files![0] }));

      // If mobile image is already selected, create the slider immediately
      if (newSliderFiles.mobile) {
        handleNewSlider(e.target.files[0], newSliderFiles.mobile);
        setNewSliderFiles({ desktop: null, mobile: null });
      }
    }
  };

  const handleNewMobileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewSliderFiles((prev) => ({ ...prev, mobile: e.target.files![0] }));

      // If desktop image is already selected, create the slider immediately
      if (newSliderFiles.desktop) {
        handleNewSlider(newSliderFiles.desktop, e.target.files[0]);
        setNewSliderFiles({ desktop: null, mobile: null });
      }
    }
  };

  const allSliders = [...existingSliders, ...pendingSliders];

  return (
    <div className="mb-10">
      <div className="flex w-full justify-between items-center">
        <div className="">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        </div>
        <Button
          label={`Upload ${pendingSliders.length} New Sliders`}
          className="!w-fit px-5 text-xs"
          isLoading={isUploading || isDeleting}
          onClick={handleUploadAll}
          icon={<IoSave />}
          disabled={pendingSliders.length === 0 || isDeleting}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={allSliders.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSliders.map((slider) => (
              <SortableSliderItem
                key={slider.id}
                slider={slider}
                onChange={handleImageChange}
                onDelete={handleDelete}
                isUploading={isUploading}
                isDeleting={isDeleting}
              />
            ))}

            {/* Add New Slider Card */}
            <div className="w-[320px] rounded-lg">
              <div className="border border-gray-300 rounded-lg p-2">
                <div className="flex space-x-2">
                  <div className="group relative flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      Desktop Image
                    </div>
                    <div
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => newDesktopInputRef.current?.click()}
                    >
                      <span className="text-2xl">+</span>
                      <span className="text-xs mt-1">Add Desktop Image</span>
                    </div>
                    {newSliderFiles.desktop && (
                      <div className="text-xs text-green-600 mt-1 text-center">
                        Selected: {newSliderFiles.desktop.name}
                      </div>
                    )}
                  </div>

                  <div className="group relative">
                    <div className="text-xs text-gray-500 mb-1">
                      Mobile Image
                    </div>
                    <div
                      className="w-30 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => newMobileInputRef.current?.click()}
                    >
                      <span className="text-2xl">+</span>
                      <span className="text-xs mt-1">Add Mobile Image</span>
                    </div>
                    {newSliderFiles.mobile && (
                      <div className="text-xs text-green-600 mt-1 text-center">
                        Selected: {newSliderFiles.mobile.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-center">
                <span className="text-sm text-gray-500">
                  Add both images to create slider
                </span>
              </div>

              <input
                type="file"
                ref={newDesktopInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleNewDesktopImage}
                disabled={isUploading}
              />

              <input
                type="file"
                ref={newMobileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleNewMobileImage}
                disabled={isUploading}
              />
            </div>
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-3 text-xs text-gray-500">
        <p>Minimum Resolution: 1500 x 1000 pixels</p>
        <p>Recommended Aspect Ratio: 3:2</p>
        <p>File Size: Max 5MB per image</p>
        <p>Formats Supported: JPG, JPEG, PNG</p>
        <p className="flex gap-1 items-center">
          <IoInformationCircle className="h-4 w-4" />
          Drag pictures to reorder them
        </p>
      </div>
    </div>
  );
};
