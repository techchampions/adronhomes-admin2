import React, { useState } from "react";
import Pagination from "../../../components/Tables/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../components/Redux/store";
import { fetchProperties } from "../../../components/Redux/Properties/properties_Thunk";
import { selectPropertiesagination, setPropertiesPage } from "../../../components/Redux/Properties/propertiesTable_slice";

export interface PropertyData {
  id: number;
  name: string;
  street_address: string;
  total_amount: number;
  type: number;
  display_image: string;
  no_of_bedroom?: number;
  price?: number;
  is_active?: boolean;
  is_sold?: boolean;
}

interface PropertyTableProps {
  data: PropertyData[];
}

export default function PropertyTableComponent({ data }: PropertyTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(null);
  
  const handlePageChange = async (page: number) => {
    await dispatch(setPropertiesPage(page));
    await dispatch(fetchProperties());
  };

 const pagination = useSelector(selectPropertiesagination);

  const getPropertyType = (type: number) => {
    switch(type) {
      case 1: return "Residential";
      case 2: return "Commercial";
      case 3: return "Land";
      default: return "Other";
    }
  };

  const handleEditClick = (property: PropertyData) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingProperty) return;
    
    const { name, value } = e.target;
    setEditingProperty({
      ...editingProperty,
      [name]: name === 'total_amount' || name === 'no_of_bedroom' || name === 'type' 
        ? Number(value) 
        : name === 'is_active' || name === 'is_sold'
        ? (e.target as HTMLInputElement).checked
        : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically dispatch an action to update the property
    console.log("Updated property:", editingProperty);
    // dispatch(updateProperty(editingProperty));
    handleCloseModal();
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0"> 
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6 font-normal text-[#757575] text-xs w-[220px]">
                  Property Name
                </th>
                <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[120px]">
                  Price
                </th>
                <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[100px]">
                  Property Type
                </th>
                <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[80px]">
                  Bedrooms
                </th>
                <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[80px]">
                  Status
                </th>
                <th className="py-4 pl-4 font-normal text-[#757575] text-xs w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((property) => (
                  <tr key={`property-${property.id}`} className="">
                    <td className="py-4 pr-6 text-dark text-sm max-w-[220px]">
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 overflow-hidden rounded-[15px] shrink-0 bg-gray-100">
                          <img 
                            src={property.display_image || '/default-property-image.jpg'} 
                            alt={property.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-[350] truncate mb-[12px]">{property.name}</div>
                          <div className="font-[325] text-[#757575] text-xs truncate flex">
                            <img src={'/location.svg'} className="mr-1"/> 
                            {property.street_address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-[325] text-dark text-sm truncate max-w-[120px]">
                      ₦{property.total_amount?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-[325] text-dark text-sm truncate max-w-[100px]">
                      {getPropertyType(property.type)}
                    </td>
                    <td className="py-4 px-6 font-[325] text-dark text-sm truncate max-w-[80px]">
                      {property.no_of_bedroom || 'N/A'}
                    </td>
                    <td className="py-4 px-6 font-[325] text-dark text-sm truncate max-w-[80px]">
                      {property.is_sold ? 'Sold' : property.is_active ? 'Active' : 'Available'}
                    </td>
                    <td className="py-4 pl-4 text-sm">
                      <div className="flex space-x-2">
                        <button 
                          aria-label="Edit property"
                          onClick={() => handleEditClick(property)}
                        >
                          <img src="/ic_round-edit.svg" className="w-[18px] h-[18px]"/>
                        </button>
                        <button aria-label="Delete property">
                          <img src="mingcute_delete-fill.svg" className="w-[18px] h-[18px]"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No properties found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Property Modal */}
      {isModalOpen && editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Property</h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editingProperty.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street_address"
                      value={editingProperty.street_address}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                    <input
                      type="number"
                      name="total_amount"
                      value={editingProperty.total_amount}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select
                      name="type"
                      value={editingProperty.type}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value={1}>Residential</option>
                      <option value={2}>Commercial</option>
                      <option value={3}>Land</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      name="no_of_bedroom"
                      value={editingProperty.no_of_bedroom || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Image URL</label>
                    <input
                      type="text"
                      name="display_image"
                      value={editingProperty.display_image}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editingProperty.is_active || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Active</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_sold"
                      checked={editingProperty.is_sold || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Sold</label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full">
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8 mb-4"
        />
      </div>
    </>
  );
}