// import React from 'react'

// export default function form() {
//   return (
//     <div>
//         <form onSubmit={handleSubmit}>
//                 <div className="grid md:grid-cols-2 gap-4 mb-4">
//                   {/* Basic Information */}
//                   <div className="md:col-span-2">
//                     <h3 className="text-lg font-semibold mb-2">
//                       Basic Information
//                     </h3>
//                     <div className="grid md:grid-cols-2 gap-4">
//                       {/* Add the OptionInputField here */}
//                       <div className="col-span-2">
//                         <OptionInputField
//                           label="Director"
//                           placeholder="Select director"
//                           name="director_id"
//                           value={editingProperty.director_id || ""}
//                           onChange={(value: any) => {
//                             setEditingProperty({
//                               ...editingProperty,
//                               director_id: value ? Number(value) : null,
//                             });
//                           }}
//                           options={labels}
//                           dropdownTitle="Directors"
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="name"
//                           value={editingProperty.name}
//                           onChange={handleInputChange}
//                           label="Property Name"
//                           placeholder="Enter property name"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="size"
//                           value={editingProperty.size || ""}
//                           onChange={handleInputChange}
//                           label="Size"
//                           placeholder="e.g. 540sqm"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Price (₦)
//                         </label>
//                         <input
//                           type="number"
//                           name="price"
//                           value={editingProperty.price || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Total Amount (₦)
//                         </label>
//                         <input
//                           type="number"
//                           name="total_amount"
//                           value={editingProperty.total_amount || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Initial Deposit (₦)
//                         </label>
//                         <input
//                           type="number"
//                           name="initial_deposit"
//                           value={editingProperty.initial_deposit || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Property Type
//                         </label>
//                         <select
//                           name="type"
//                           value={editingProperty.type}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                           required
//                         >
//                           <option value={1}>Residential</option>
//                           <option value={2}>Commercial</option>
//                           <option value={3}>Land</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Status
//                         </label>
//                         <select
//                           name="status"
//                           value={editingProperty.status || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         >
//                           <option value="For Sale">For Sale</option>
//                           <option value="For Rent">For Rent</option>
//                           <option value="Sold Out">Sold Out</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Category
//                         </label>
//                         <select
//                           name="category"
//                           value={editingProperty.category || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         >
//                           <option value="single">Single</option>
//                           <option value="multiple">Multiple</option>
//                         </select>
//                       </div>

//                       {/* Discount Fields */}
//                       <div className="flex items-center col-span-2">
//                         <input
//                           type="checkbox"
//                           name="is_discount"
//                           checked={editingProperty?.is_discount || false}
//                           onChange={handleInputChange}
//                           className="mr-2 accent-black"
//                         />
//                         <label className="font-[325] text-[14px] text-gray-700">
//                           Has Discount
//                         </label>
//                       </div>

//                       {editingProperty.is_discount && (
//                         <>
//                           <div>
//                             <InputField
//                               type="text"
//                               name="discount_name"
//                               value={editingProperty.discount_name || ""}
//                               onChange={handleInputChange}
//                               label="Discount Name"
//                               placeholder="Enter discount name"
//                             />
//                           </div>
//                           <div>
//                             <InputField
//                               type="number"
//                               name="discount_percentage"
//                               value={editingProperty.discount_percentage || ""}
//                               onChange={handleInputChange}
//                               label="Discount Percentage"
//                               placeholder="Enter discount percentage"
//                             />
//                           </div>
//                           <div>
//                             <InputField
//                               type="number"
//                               name="discount_units"
//                               value={editingProperty.discount_units || ""}
//                               onChange={handleInputChange}
//                               label="Discount Units"
//                               placeholder="Enter discount units"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                               Discount Start Date
//                             </label>
//                             <input
//                               type="date"
//                               name="discount_start_date"
//                               value={editingProperty.discount_start_date || ""}
//                               onChange={handleInputChange}
//                               className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                               Discount End Date
//                             </label>
//                             <input
//                               type="date"
//                               name="discount_end_date"
//                               value={editingProperty.discount_end_date || ""}
//                               onChange={handleInputChange}
//                               className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                             />
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* Location Information */}
//                   <div className="md:col-span-2">
//                     <h3 className="text-lg font-semibold mb-2">
//                       Location Information
//                     </h3>
//                     <div className="grid  md:grid-cols-2 gap-4">
//                       <div>
//                         <InputField
//                           type="text"
//                           name="street_address"
//                           value={editingProperty.street_address || ""}
//                           onChange={handleInputChange}
//                           label="Street Address"
//                           placeholder="Enter street address"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="country"
//                           value={editingProperty.country || ""}
//                           onChange={handleInputChange}
//                           label="Country"
//                           placeholder="Enter country"
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="state"
//                           value={editingProperty.state || ""}
//                           onChange={handleInputChange}
//                           label="State"
//                           placeholder="Enter state"
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="lga"
//                           value={editingProperty.lga || ""}
//                           onChange={handleInputChange}
//                           label="LGA"
//                           placeholder="Enter local government area"
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="area"
//                           value={editingProperty.area || ""}
//                           onChange={handleInputChange}
//                           label="Area"
//                           placeholder="Enter area"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Location Type
//                         </label>
//                         <select
//                           name="location_type"
//                           value={editingProperty.location_type || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         >
//                           <option value="">Select Location Type</option>
//                           <option value="Urban">Urban</option>
//                           <option value="Suburban">Suburban</option>
//                           <option value="Rural">Rural</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Purpose
//                         </label>
//                         <select
//                           name="purpose"
//                           value={editingProperty.purpose || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         >
//                           <option value="">Select Purpose</option>
//                           <option value="Residential">Residential</option>
//                           <option value="Commercial">Commercial</option>
//                           <option value="Industrial">Industrial</option>
//                         </select>
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="year_built"
//                           value={editingProperty.year_built || ""}
//                           onChange={handleInputChange}
//                           label="Year Built"
//                           placeholder="Enter year built"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Property Details */}
//                   <div className="md:col-span-2">
//                     <h3 className="text-lg font-semibold mb-2">
//                       Property Details
//                     </h3>
//                     <div className="grid  md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Bedrooms
//                         </label>
//                         <input
//                           type="number"
//                           name="no_of_bedroom"
//                           value={editingProperty.no_of_bedroom || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Bathrooms
//                         </label>
//                         <input
//                           type="number"
//                           name="number_of_bathroom"
//                           value={editingProperty.number_of_bathroom || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="parking_space"
//                           value={editingProperty.parking_space || ""}
//                           onChange={handleInputChange}
//                           label="Parking Space"
//                           placeholder="Enter parking space details"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Units
//                         </label>
//                         <input
//                           type="number"
//                           name="number_of_unit"
//                           value={editingProperty.number_of_unit || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Duration Limit (months)
//                         </label>
//                         <input
//                           type="number"
//                           name="property_duration_limit"
//                           value={editingProperty.property_duration_limit || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Payment Type
//                         </label>
//                         <select
//                           name="payment_type"
//                           value={editingProperty.payment_type || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         >
//                           <option value="">Select Payment Type</option>
//                           <option value="One-time">One-time</option>
//                           <option value="Installment">Installment</option>
//                         </select>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           name="is_active"
//                           checked={editingProperty.is_active === 1}
//                           onChange={handleInputChange}
//                           className="mr-2 accent-black"
//                         />
//                         <label className="font-[325] text-[14px] text-gray-700">
//                           Active
//                         </label>
//                       </div>

//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           name="is_sold"
//                           checked={editingProperty.is_sold === 1}
//                           onChange={handleInputChange}
//                           className="mr-2 accent-black"
//                         />
//                         <label className="font-[325] text-[14px] text-gray-700">
//                           Sold
//                         </label>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Description */}
//                   <div className="md:col-span-2">
//                     <h3 className="text-lg font-semibold mb-2">Description</h3>
//                     <div className="grid  gap-4">
//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Overview
//                         </label>
//                         <textarea
//                           name="overview"
//                           value={editingProperty.overview || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[15px] min-h-[100px]"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Description
//                         </label>
//                         <textarea
//                           name="description"
//                           value={editingProperty.description || ""}
//                           onChange={handleInputChange}
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[15px] min-h-[150px]"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Media */}
//                   <div className="md:col-span-2">
//                     <h3 className="text-lg font-semibold mb-2">Media</h3>
//                     <div className="grid  md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Display Image
//                         </label>
//                         <input
//                           type="file"
//                           ref={fileInputRef}
//                           onChange={handleImageChange}
//                           accept="image/*"
//                           className="hidden"
//                         />
//                         <div className="flex items-center space-x-4">
//                           <button
//                             type="button"
//                             onClick={triggerFileInput}
//                             className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                           >
//                             Select Image
//                           </button>
//                           {imagePreview ? (
//                             <div className="w-16 h-16 overflow-hidden rounded-md">
//                               <img
//                                 src={imagePreview}
//                                 alt="Property preview"
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                           ) : editingProperty.display_image ? (
//                             <div className="w-16 h-16 overflow-hidden rounded-md">
//                               <img
//                                 src={editingProperty.display_image}
//                                 alt="Property preview"
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                           ) : null}
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
//                           Additional Photos
//                         </label>
//                         <input
//                           type="file"
//                           multiple
//                           onChange={handleImageChange}
//                           accept="image/*"
//                           className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
//                         />
//                         {editingProperty.photos &&
//                           editingProperty.photos.length > 0 && (
//                             <div className="mt-2 flex flex-wrap gap-2">
//                               {editingProperty.photos.map((photo, index) => (
//                                 <div
//                                   key={index}
//                                   className="w-16 h-16 overflow-hidden rounded-md"
//                                 >
//                                   <img
//                                     src={photo}
//                                     alt={`Property ${index}`}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="property_map"
//                           value={editingProperty.property_map || ""}
//                           onChange={handleInputChange}
//                           label="Property Map URL"
//                           placeholder="Enter map URL"
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="property_video"
//                           value={editingProperty.property_video || ""}
//                           onChange={handleInputChange}
//                           label="Property Video URL"
//                           placeholder="Enter video URL"
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="virtual_tour"
//                           value={editingProperty.virtual_tour || ""}
//                           onChange={handleInputChange}
//                           label="Virtual Tour URL"
//                           placeholder="Enter virtual tour URL"
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="property_agreement"
//                           value={editingProperty.property_agreement || ""}
//                           onChange={handleInputChange}
//                           label="Property Agreement URL"
//                           placeholder="Enter agreement URL"
//                         />
//                       </div>

//                       <div>
//                         <InputField
//                           type="text"
//                           name="subscriber_form"
//                           value={editingProperty.subscriber_form || ""}
//                           onChange={handleInputChange}
//                           label="Subscriber Form URL"
//                           placeholder="Enter subscriber form URL"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Payment Schedule */}
//                   <div className="md:col-span-2">
//                     <h3 className="text-lg font-semibold mb-2">
//                       Payment Schedule
//                     </h3>
//                     <div className="bg-[#F5F5F5] p-4 rounded-[15px]">
//                       <textarea
//                         name="payment_schedule"
//                         value={
//                           Array.isArray(editingProperty.payment_schedule)
//                             ? editingProperty.payment_schedule.join(", ")
//                             : editingProperty.payment_schedule?.replace(
//                                 /[\[\]"]/g,
//                                 ""
//                               ) || ""
//                         }
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           setEditingProperty({
//                             ...editingProperty,
//                             payment_schedule: value.includes(",")
//                               ? value.split(",").map((item) => item.trim())
//                               : value.trim(),
//                           });
//                         }}
//                         className="w-full relative bg-white flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[15px] min-h-[100px]"
//                         placeholder="Enter payment schedule (e.g., monthly, quarterly)"
//                       />
//                     </div>
//                   </div>

//                   {/* Features */}
//                   <div className="md:col-span-2">
//                     <h3 className="text-lg font-semibold mb-2">Features</h3>
//                     <div className="bg-[#F5F5F5] p-4 rounded-[15px]">
//                       <textarea
//                         name="features"
//                         value={
//                           Array.isArray(editingProperty.features)
//                             ? editingProperty.features.join(", ")
//                             : editingProperty.features?.replace(
//                                 /[\[\]"]/g,
//                                 ""
//                               ) || ""
//                         }
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           setEditingProperty({
//                             ...editingProperty,
//                             features: value.includes(",")
//                               ? value.split(",").map((item) => item.trim())
//                               : value.trim(),
//                           });
//                         }}
//                         className="w-full relative bg-white flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[15px] min-h-[100px]"
//                         placeholder="Enter features as comma-separated list"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 mt-6">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     className="lg:px-[66px] lg:py-[21px] py-2 px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-[60px]"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`lg:px-[66px] lg:py-[15px] py-2 px-3 bg-[#79B833] text-sm font-bold text-white rounded-[60px] ${
//                       loading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {loading ? "Saving..." : "Save Changes"}
//                   </button>
//                 </div>
//               </form>
//     </div>
//   )
// }
