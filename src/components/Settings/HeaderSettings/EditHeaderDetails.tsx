// import { Form, Formik } from "formik";
// import React, { useEffect, useState } from "react";
// import * as Yup from "yup";
// import InputField from "../../input/inputtext";
// import Button from "../../input/Button";
// import {
//   HeaderItem,
//   UpdateHeaderPayload,
// } from "../../../pages/Properties/types/HeaderDataTypes";
// import { useEditHeader } from "../../../utils/hooks/mutations";
// import { IoAdd } from "react-icons/io5";
// import { toast } from "react-toastify";
// import SoosarInputField from "../../soosarInput";
// import { X } from "lucide-react";

// interface ModalProps {
//   isOpen?: boolean;
//   onClose?: () => void;
//   headerDetails?: HeaderItem;
// }
// const EditHeaderDetails: React.FC<ModalProps> = ({
//   isOpen,
//   onClose = () => {},
//   headerDetails,
// }) => {
//   const initialValues = {
//     header: headerDetails?.header || "",
//     name: headerDetails?.name || "",
//     slug: headerDetails?.slug || "",
//     description: headerDetails?.description,
//     list_description: [],
//     list: "",
//     image: null,
//     action_link: headerDetails?.action_link,
//   };
//   const data = { name: "name", image: null };
//   const headerListDescData = headerDetails?.list_description || [];

//   const [listDescription, setListDescription] = useState(headerListDescData);

//   const validationSchema = Yup.object({
//     // header: Yup.string().required("Header is required"),
//     // name: Yup.string().required("Name is required"),
//     // slug: Yup.string().required("slug is required"),
//     // description: Yup.string().required("Description is required"),
//     // action_link: Yup.string().required("Action Link is required"),
//   });
//   // Reset list when headerDetails changes
//   useEffect(() => {
//     setListDescription(headerDetails?.list_description || []);
//   }, [headerDetails]);

//   const { mutate: editHeader, isPending, isError } = useEditHeader();
//   const handleSubmit = (values: typeof initialValues) => {
//     const payload = createPayload(values);
//     console.log(payload);
//     editHeader(payload, {
//       onSuccess(data, variables, context) {
//         toast.success("Updated Header Successfully");
//       },
//       onError(error, variables, context) {
//         toast.error("Failed to Update Header");
//       },
//     });
//     onClose();
//   };

//   const createPayload = (values: typeof initialValues) => {
//     const payload: UpdateHeaderPayload = {
//       id: headerDetails?.id,
//     };

//     // Only include fields that have values
//     if (values.header) payload.header = values.header;
//     if (values.name) payload.name = values.name;
//     if (values.description) payload.description = values.description;
//     if (values.image) payload.image = values.image;

//     // Only include list_description if it has items
//     if (listDescription.length > 0) {
//       payload.list_description = listDescription.filter(
//         (item) => item.trim() !== ""
//       );
//     }

//     return payload;
//   };
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
//       <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10">
//         <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
//           <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
//             Edit Header
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
//           >
//             ✕
//           </button>
//         </div>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, setFieldValue, isSubmitting }) => {
//             return (
//               <Form className="space-y-6">
//                 {/* Profile Picture */}
//                 <div className="bg-white rounded-3xl p-0 space-y-4">
//                   <div className="flex justify-center items-center gap-4 px-7">
//                     <label className="cursor-pointer border border-dashed border-gray-300 overflow-hidden p-2 rounded-2xl relative w-full h-[200px] flex flex-col justify-center items-center">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) {
//                             setFieldValue("image", file);
//                           }
//                         }}
//                       />
//                       {values.image || headerDetails?.image ? (
//                         <img
//                           src={
//                             values.image
//                               ? URL.createObjectURL(values.image)
//                               : headerDetails?.image
//                           }
//                           // src={
//                           //   values.image instanceof File
//                           //     ? URL.createObjectURL(values.image) // Create URL for new files
//                           //     : values.image
//                           // }
//                           alt="Profile"
//                           className="w-full h-full rounded-xl object-cover"
//                         />
//                       ) : (
//                         <div className="flex">+ Add Header Image</div>
//                       )}
//                     </label>
//                   </div>
//                   <div className="grid gap-4 px-7">
//                     <div className="">
//                       <label htmlFor="" className="text-sm text-gray-500">
//                         Name
//                       </label>
//                       <SoosarInputField name="name" placeholder="Enter Name" />
//                     </div>
//                   </div>

//                   <div className="grid gap-4">
//                     <div className=" px-7">
//                       <label htmlFor="" className="text-sm text-gray-500">
//                         Header
//                       </label>
//                       <SoosarInputField
//                         name="header"
//                         placeholder="Enter Header"
//                       />
//                     </div>
//                   </div>
//                   {headerDetails?.list_description && (
//                     <div className=" flex">
//                       <div className="flex flex-col flex-1">
//                         <div className=" px-7">
//                           <label htmlFor="" className="text-sm text-gray-500">
//                             List Description
//                           </label>
//                           <div className="flex items-end gap-2">
//                             <SoosarInputField
//                               name="list"
//                               placeholder="Enter List item"
//                             />

//                             <div
//                               className="border border-gray-300 rounded-full p-3 hover:border-gray-700"
//                               onClick={() => {
//                                 setListDescription((prev) => [
//                                   ...prev,
//                                   values.list,
//                                 ]);
//                                 setFieldValue("list", "");
//                               }}
//                             >
//                               <IoAdd className="" />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex flex-col px-7">
//                           {listDescription.map((list, index) => (
//                             <div
//                               className="flex gap-1 items-center"
//                               key={index}
//                             >
//                               <InputField
//                                 label=""
//                                 value={list}
//                                 placeholder="Input list item"
//                                 onChange={(e) => {
//                                   const value = e.target.value;
//                                   if (value) {
//                                     setFieldValue(
//                                       `list_description[${index}]`,
//                                       value
//                                     );
//                                   }
//                                 }}
//                               />
//                               <X className="text-red-500 h-5 w-5 cursor-pointer" />
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <div className=" px-7">
//                     <label htmlFor="" className="text-sm text-gray-500">
//                       Description
//                     </label>
//                     <SoosarInputField
//                       type="textarea"
//                       name="description"
//                       placeholder="Enter description"
//                     />
//                   </div>
//                 </div>

//                 {/* Save Button */}
//                 <div className="text-right px-7">
//                   <Button
//                     label={
//                       isSubmitting || isPending ? `Saving...` : `Save Changes`
//                     }
//                     className="bg-black text-sm !w-fit px-6"
//                     type="submit"
//                     isLoading={isSubmitting || isPending}
//                     disabled={isSubmitting || isPending}
//                   />
//                 </div>
//               </Form>
//             );
//           }}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default EditHeaderDetails;

import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import InputField from "../../input/inputtext";
import Button from "../../input/Button";
import {
  HeaderItem,
  UpdateHeaderPayload,
} from "../../../pages/Properties/types/HeaderDataTypes";
import { useEditHeader } from "../../../utils/hooks/mutations";
import { IoAdd } from "react-icons/io5";
import { toast } from "react-toastify";
import SoosarInputField from "../../soosarInput";
import { X } from "lucide-react";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  headerDetails?: HeaderItem;
}
const EditHeaderDetails: React.FC<ModalProps> = ({
  isOpen,
  onClose = () => {},
  headerDetails,
}) => {
  const initialValues = {
    header: headerDetails?.header || "",
    name: headerDetails?.name || "",
    slug: headerDetails?.slug || "",
    description: headerDetails?.description,
    list_description: [],
    list: "",
    image: null,
    action_link: headerDetails?.action_link,
  };
  const data = { name: "name", image: null };
  const headerListDescData = headerDetails?.list_description || [];

  const [listDescription, setListDescription] = useState(headerListDescData);

  const validationSchema = Yup.object({
    // header: Yup.string().required("Header is required"),
    // name: Yup.string().required("Name is required"),
    // slug: Yup.string().required("slug is required"),
    // description: Yup.string().required("Description is required"),
    // action_link: Yup.string().required("Action Link is required"),
  });
  // Reset list when headerDetails changes
  useEffect(() => {
    setListDescription(headerDetails?.list_description || []);
  }, [headerDetails]);

  const { mutate: editHeader, isPending, isError } = useEditHeader();
  const handleSubmit = (values: typeof initialValues) => {
    const payload = createPayload(values);
    console.log(payload);
    editHeader(payload, {
      onSuccess(data, variables, context) {
        toast.success("Updated Header Successfully");
        onClose();
      },
      onError(error, variables, context) {
        toast.error("Failed to Update Header");
      },
    });
  };

  const createPayload = (values: typeof initialValues) => {
    const payload: UpdateHeaderPayload = {
      id: headerDetails?.id,
    };

    // Only include fields that have values
    if (values.header) payload.header = values.header;
    if (values.name) payload.name = values.name;
    if (values.description) payload.description = values.description;
    if (values.image) payload.image = values.image;

    // Only include list_description if it has items
    if (listDescription.length > 0) {
      payload.list_description = listDescription.filter(
        (item) => item.trim() !== ""
      );
    }

    return payload;
  };

  // Function to handle adding a new list item
  const handleAddListItem = (listValue: string) => {
    if (listValue.trim()) {
      setListDescription((prev) => [...prev, listValue]);
    }
  };

  // Function to handle removing a list item
  const handleRemoveListItem = (index: number) => {
    setListDescription((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to handle updating a list item
  const handleUpdateListItem = (index: number, value: string) => {
    setListDescription((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10">
        <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
          <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
            Edit Header
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            return (
              <Form className="space-y-6">
                {/* Profile Picture */}
                <div className="bg-white rounded-3xl p-0 space-y-4">
                  <div className="flex justify-center items-center gap-4 px-7">
                    <label className="cursor-pointer border border-dashed border-gray-300 overflow-hidden p-2 rounded-2xl relative w-full h-[200px] flex flex-col justify-center items-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFieldValue("image", file);
                          }
                        }}
                      />
                      {values.image || headerDetails?.image ? (
                        <img
                          src={
                            values.image
                              ? URL.createObjectURL(values.image)
                              : headerDetails?.image
                          }
                          alt="Profile"
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex">+ Add Header Image</div>
                      )}
                    </label>
                  </div>
                  <div className="grid gap-4 px-7">
                    <div className="">
                      <label htmlFor="" className="text-sm text-gray-500">
                        Name
                      </label>
                      <SoosarInputField name="name" placeholder="Enter Name" />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className=" px-7">
                      <label htmlFor="" className="text-sm text-gray-500">
                        Header
                      </label>
                      <SoosarInputField
                        name="header"
                        placeholder="Enter Header"
                      />
                    </div>
                  </div>
                  {headerDetails?.list_description && (
                    <div className=" flex">
                      <div className="flex flex-col flex-1">
                        <div className=" px-7">
                          <label htmlFor="" className="text-sm text-gray-500">
                            List Description
                          </label>
                          <div className="flex items-end gap-2">
                            <SoosarInputField
                              name="list"
                              placeholder="Enter List item"
                            />

                            <div
                              className="border border-gray-300 rounded-full p-3 hover:border-gray-700 cursor-pointer"
                              onClick={() => {
                                handleAddListItem(values.list);
                                setFieldValue("list", "");
                              }}
                            >
                              <IoAdd className="" />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col px-7">
                          {listDescription.map((list, index) => (
                            <div
                              className="flex gap-1 items-center"
                              key={index}
                            >
                              <InputField
                                label=""
                                value={list}
                                placeholder="Input list item"
                                onChange={(e) => {
                                  handleUpdateListItem(index, e.target.value);
                                }}
                              />
                              <X
                                className="text-red-500 h-5 w-5 cursor-pointer"
                                onClick={() => handleRemoveListItem(index)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className=" px-7">
                    <label htmlFor="" className="text-sm text-gray-500">
                      Description
                    </label>
                    <SoosarInputField
                      type="textarea"
                      name="description"
                      placeholder="Enter description"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="text-right px-7">
                  <Button
                    label={
                      isSubmitting || isPending ? `Saving...` : `Save Changes`
                    }
                    className="bg-black text-sm !w-fit px-6"
                    type="submit"
                    isLoading={isSubmitting || isPending}
                    disabled={isSubmitting || isPending}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default EditHeaderDetails;
