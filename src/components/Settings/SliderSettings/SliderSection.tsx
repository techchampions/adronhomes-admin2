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
// import { v4 as uuidv4 } from "uuid";
// import { IoInformationCircle, IoSave, IoSaveOutline } from "react-icons/io5";
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
// type NewSliderType = {
//   id: number; // Temporary string ID before server assigns a number
//   image: string;
// };
// type SliderFile = {
//   id: number;
//   image: File;
// };
// // Simple numeric ID generator
// let tempIdCounter = Date.now();
// const generateTempId = () => tempIdCounter++;

// const SortableSliderItem: React.FC<{
//   slider: SliderByTypeData;
//   onChange: (id: number, file: File) => void;
//   onDelete: (id: number) => void;
// }> = ({ slider, onChange, onDelete }) => {
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
//         className="border h-[180px] border-gray-300 rounded-lg p-2"
//       >
//         <img
//           src={slider.image}
//           alt="slider"
//           className="w-full h-full object-cover rounded-lg"
//         />
//       </div>
//       <div className="flex justify-between text-sm text-blue-600 mt-2 px-2">
//         <button
//           onClick={() => inputRef.current?.click()}
//           className="hover:underline"
//         >
//           Change Image
//         </button>
//         <button
//           onClick={() => onDelete(slider.id)}
//           className="text-red-500 hover:underline"
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
//           if (e.target.files && e.target.files[0]) {
//             onChange(Number(slider.id), e.target.files[0]);
//           }
//         }}
//       />
//     </div>
//   );
// };
// const MobileSortableSliderItem: React.FC<{
//   slider: SliderByTypeData;
//   onChange: (id: number, file: File) => void;
//   onDelete: (id: number) => void;
// }> = ({ slider, onChange, onDelete }) => {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: slider.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} className="h-[320px] rounded-lg">
//       <div
//         {...attributes}
//         {...listeners}
//         className="border w-[180px] border-gray-300 rounded-lg p-2"
//       >
//         <img
//           src={slider.image}
//           alt="slider"
//           className="w-full h-full object-cover rounded-lg"
//         />
//       </div>
//       <div className="flex justify-between text-sm text-blue-600 mt-2 px-2">
//         <button
//           onClick={() => inputRef.current?.click()}
//           className="hover:underline"
//         >
//           Change Image
//         </button>
//         <button
//           onClick={() => onDelete(slider.id)}
//           className="text-red-500 hover:underline"
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
//           if (e.target.files && e.target.files[0]) {
//             onChange(Number(slider.id), e.target.files[0]);
//           }
//         }}
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
//   const [sliders, setSliders] = useState<SliderByTypeData[]>(initialSliders);
//   const [slideFiles, setSlideFiles] = useState<File[]>([]);
//   const { mutate: uploadSlide, isPending } = useUploadSlideByType();
//   const { mutate: deleteSlide } = useDeleteSlide();

//   const sensors = useSensors(useSensor(PointerSensor));

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       const oldIndex = sliders.findIndex((s) => s.id === active.id);
//       const newIndex = sliders.findIndex((s) => s.id === over?.id);
//       setSliders(arrayMove(sliders, oldIndex, newIndex));
//     }
//   };

//   const handleImageChange = (id: number, file: File) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setSliders((prev) =>
//         prev.map((s) =>
//           s.id === id
//             ? {
//                 ...s,
//                 image: reader.result as string,
//                 imageUrl: reader.result as string,
//               }
//             : s
//         )
//       );
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleDelete = (id: number) => {
//     console.log(id);
//     if (sliders.length <= 2) {
//       toast.error("You must have at least 2 sliders.");
//       return;
//     }
//     setSliders((prev) => prev.filter((s) => s.id !== id));
//     deleteSlide(id, {
//       onSuccess() {
//         toast.success("Image Deleted successfully");
//       },
//       onError(error, variables, context) {
//         toast.error(error.message);
//       },
//     });
//   };
//   const handleNewSlider = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const newSlider: NewSliderType = {
//         id: generateTempId(),
//         image: reader.result as string,
//       };
//       console.log(sliders);
//       setSliders((prev) => [...prev, newSlider]);
//     };
//     reader.readAsDataURL(file);
//     setSlideFiles((prev) => [...prev, file]);
//     console.log(slideFiles);
//   };
//   const handleUpload = (sliderType: string) => {
//     if (sliderType && slideFiles.length > 0)
//       uploadSlide(
//         {
//           type: sliderType,
//           image: slideFiles,
//           mobile_image: slideFiles,
//         },
//         {
//           onSuccess() {
//             toast.success("Image uploaded successfully");
//           },
//           onError(error, variables, context) {
//             toast.error(error.message);
//           },
//         }
//       );
//     else {
//       toast.error("Please select a file to upload");
//     }
//   };

//   const newSliderInputRef = useRef<HTMLInputElement | null>(null);

//   return (
//     <div className="mb-10">
//       <div className="flex w-full justify-between items-start">
//         <div className="">
//           <h3 className="text-lg font-semibold mb-1">{title}</h3>
//           <p className="text-sm text-gray-600 mb-4">{description}</p>
//         </div>
//         <Button
//           label="Save"
//           className="!w-fit px-15"
//           isLoading={isPending}
//           onClick={() => handleUpload(sliderType)}
//           icon={<IoSave />}
//         />
//       </div>
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         <SortableContext
//           items={sliders.map((s) => s.id)}
//           strategy={verticalListSortingStrategy}
//         >
//           <div className="grid gird-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {sliders.map((slider) => (
//               <SortableSliderItem
//                 key={slider.id}
//                 slider={slider}
//                 onChange={handleImageChange}
//                 onDelete={handleDelete}
//               />
//             ))}
//             <div
//               className="w-[320px] h-[180px] border-dashed border-2 border-gray-300 flex items-center justify-center rounded-lg text-gray-500 cursor-pointer"
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
//                   if (e.target.files && e.target.files[0]) {
//                     handleNewSlider(e.target.files[0]);
//                   }
//                 }}
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
//           Drag pictures in order in which you want them to appear.
//         </p>
//       </div>
//     </div>
//   );
// };
