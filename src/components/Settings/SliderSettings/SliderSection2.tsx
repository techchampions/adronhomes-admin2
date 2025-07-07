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
  file: File;
  preview: string;
};
type ChangedSliders = {
  id: number;
};

// Simple numeric ID generator
let tempIdCounter = Date.now();
const generateTempId = () => tempIdCounter++;

const SortableSliderItem: React.FC<{
  slider: SliderByTypeData | PendingSlider;
  onChange: (id: number, file: File) => void;
  onDelete: (id: number) => void;
  isUploading?: boolean;
  isDeleting?: boolean;
}> = ({ slider, onChange, onDelete, isUploading, isDeleting }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slider.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-[320px] rounded-lg">
      <div
        {...attributes}
        {...listeners}
        className={`border h-[180px] border-gray-300 rounded-lg p-2 relative ${
          isUploading ? "opacity-75" : ""
        }`}
      >
        <img
          src={"image" in slider ? slider.image : slider.preview}
          alt="slider"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex justify-between text-sm text-blue-600 mt-2 px-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="hover:underline"
          disabled={isUploading}
        >
          Change Image
        </button>
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
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onChange(slider.id, e.target.files[0]);
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
        newSliders.filter((s) => "imageUrl" in s) as SliderByTypeData[]
      );
      setPendingSliders(
        newSliders.filter((s) => !("imageUrl" in s)) as PendingSlider[]
      );
    }
  };

  //   const handleImageChange = (id: number, file: File) => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       // Check if this is an existing slider or pending slider
  //       const existingIndex = existingSliders.findIndex((s) => s.id === id);
  //       if (existingIndex >= 0) {
  //         setExistingSliders((prev) =>
  //           prev.map((s) =>
  //             s.id === id ? { ...s, image: reader.result as string } : s
  //           )
  //         );
  //       } else {
  //         setPendingSliders((prev) =>
  //           prev.map((s) =>
  //             s.id === id ? { ...s, file, preview: reader.result as string } : s
  //           )
  //         );
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   };

  const handleImageChange = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Check if this is an existing slider
      const existingIndex = existingSliders.findIndex((s) => s.id === id);
      if (existingIndex >= 0) {
        // Remove from existing sliders
        setExistingSliders((prev) => prev.filter((s) => s.id !== id));
        // Add to changed slider for later deleting
        setChangedSliders((prev) => [...prev, { id: id }]);
        // Add to pending sliders with the new file
        setPendingSliders((prev) => [
          ...prev,
          {
            id: generateTempId(), // New temporary ID
            file,
            preview: reader.result as string,
          },
        ]);
      } else {
        // For pending sliders, just update the file
        setPendingSliders((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, file, preview: reader.result as string } : s
          )
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

  const handleNewSlider = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newSlider: PendingSlider = {
        id: generateTempId(),
        file,
        preview: reader.result as string,
      };
      setPendingSliders((prev) => [...prev, newSlider]);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAll = () => {
    if (pendingSliders.length === 0) {
      toast.info("No new sliders to upload");
      return;
    }

    const formData = new FormData();
    formData.append("type", sliderType);

    pendingSliders.forEach((slider) => {
      formData.append("image", slider.file);
      // If you need mobile images, add them here
      // formData.append("mobile_image", slider.file);
    });

    uploadSlide(
      {
        type: sliderType,
        image: pendingSliders.map((s) => s.file),
        mobile_image: pendingSliders.map((s) => s.file),
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
          //   toast.success("Slider deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    });
  };

  const newSliderInputRef = useRef<HTMLInputElement | null>(null);
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
            <div
              className="w-[320px] h-[180px] border-dashed border-2 border-gray-300 flex items-center justify-center rounded-lg text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => newSliderInputRef.current?.click()}
            >
              <span className="text-xl font-semibold text-center">
                ＋<br />
                New Slider
              </span>
              <input
                type="file"
                ref={newSliderInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleNewSlider(e.target.files[0]);
                  }
                }}
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
