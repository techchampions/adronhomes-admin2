import React, { useState } from 'react';
import InputField from '../../../components/input/inputtext';
import EnhancedOptionInputField from '../../../components/input/enhancedSelecet';


// Demo data for properties
const DEMO_PROPERTIES = [
  { id: 1, value: 300, label: '300 sqm' },
  { id: 2, value: 500, label: '500 sqm' },
  { id: 3, value: 1000, label: '1000 sqm' },
  { id: 4, value: 1500, label: '1500 sqm' },
  { id: 5, value: 2000, label: '2000 sqm' },
];

// Demo duration options
const DURATION_OPTIONS = [
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 12, label: '12 months' },
  { value: 24, label: '24 months' },
];

// Demo Citta linking options
const CITTA_LINKS = [
  { value: 'citta-link-1', label: 'Citta Premium Link' },
  { value: 'citta-link-2', label: 'Citta Standard Link' },
  { value: 'citta-link-3', label: 'Citta Basic Link' },
  { value: 'citta-link-4', label: 'Custom Citta Link' },
];

interface LandSizeSection {
  id: number;
  size: number;
  durations: Array<{
    id: number;
    duration: number;
    price: number;
    cittaLink: string;
  }>;
}

const PropertyListingPage: React.FC = () => {
  const [propertyName, setPropertyName] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [landSizeSections, setLandSizeSections] = useState<LandSizeSection[]>([
    {
      id: 1,
      size: 300,
      durations: [
        { id: 1, duration: 3, price: 0, cittaLink: '' },
        { id: 2, duration: 6, price: 0, cittaLink: '' },
        { id: 3, duration: 12, price: 0, cittaLink: '' },
      ],
    },
  ]);

  // Add a new land size section
  const addLandSizeSection = () => {
    const newSize = DEMO_PROPERTIES.find(
      prop => !landSizeSections.some(section => section.size === prop.value)
    )?.value || 500;

    const newSection: LandSizeSection = {
      id: Date.now(),
      size: newSize,
      durations: [
        { id: Date.now() + 1, duration: 3, price: 0, cittaLink: '' },
      ],
    };

    setLandSizeSections([...landSizeSections, newSection]);
  };

  // Remove a land size section
  const removeLandSizeSection = (sectionId: number) => {
    if (landSizeSections.length > 1) {
      setLandSizeSections(landSizeSections.filter(section => section.id !== sectionId));
    }
  };

  // Add a duration to a specific land size section
  const addDurationToSection = (sectionId: number) => {
    setLandSizeSections(
      landSizeSections.map(section => {
        if (section.id === sectionId) {
          const availableDurations = DURATION_OPTIONS.filter(
            opt => !section.durations.some(d => d.duration === opt.value)
          );
          
          if (availableDurations.length > 0) {
            return {
              ...section,
              durations: [
                ...section.durations,
                {
                  id: Date.now(),
                  duration: availableDurations[0].value,
                  price: 0,
                  cittaLink: '',
                },
              ],
            };
          }
        }
        return section;
      })
    );
  };

  // Remove a duration from a section
  const removeDurationFromSection = (sectionId: number, durationId: number) => {
    setLandSizeSections(
      landSizeSections.map(section => {
        if (section.id === sectionId && section.durations.length > 1) {
          return {
            ...section,
            durations: section.durations.filter(d => d.id !== durationId),
          };
        }
        return section;
      })
    );
  };

  // Update land size
  const updateLandSize = (sectionId: number, newSize: number) => {
    setLandSizeSections(
      landSizeSections.map(section => 
        section.id === sectionId ? { ...section, size: newSize } : section
      )
    );
  };

  // Update duration
  const updateDuration = (sectionId: number, durationId: number, field: string, value: any) => {
    setLandSizeSections(
      landSizeSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            durations: section.durations.map(duration =>
              duration.id === durationId ? { ...duration, [field]: value } : duration
            ),
          };
        }
        return section;
      })
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const propertyData = {
      name: propertyName,
      description: propertyDescription,
      landSizes: landSizeSections.map(section => ({
        id: section.id,
        size: section.size,
        durations: section.durations.map(d => ({
          duration: d.duration,
          price: d.price,
          cittaLink: d.cittaLink,
        })),
      })),
    };

    console.log('Property Data:', propertyData);
    // Here you would typically send this data to your API
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Property Listing
        </h1>
        <p className="text-gray-600 mb-8">
          Add property details including land sizes with their durations and pricing
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Basic Information
            </h2>
            
            <div className="space-y-6">
              <InputField
                label="Property Name"
                placeholder="Enter property name"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                required
              />
              
              <div>
                <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                  Property Description
                </label>
                <textarea
                  value={propertyDescription}
                  onChange={(e) => setPropertyDescription(e.target.value)}
                  className="w-full relative bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[24px] min-h-[120px] resize-none"
                  placeholder="Enter property description"
                />
              </div>
            </div>
          </div>

          {/* Land Sizes Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Land Sizes & Pricing
              </h2>
              <button
                type="button"
                onClick={addLandSizeSection}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-[60px] hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>+ Add Land Size</span>
              </button>
            </div>

            {/* Land Size Sections */}
            <div className="space-y-8">
              {landSizeSections.map((section, sectionIndex) => (
                <div 
                  key={section.id} 
                  className="border border-gray-200 rounded-2xl p-6 relative"
                >
                  {/* Remove section button (only show if more than one section) */}
                  {landSizeSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLandSizeSection(section.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                      title="Remove this land size"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  {/* Land Size Selection */}
                  <div className="mb-6">
                    <EnhancedOptionInputField
                      label="Land Size"
                      placeholder="Select land size"
                      value={section.size}
                      onChange={(value) => updateLandSize(section.id, value)}
                      options={DEMO_PROPERTIES}
                      isSearchable
                    />
                  </div>

                  {/* Durations & Pricing */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-medium text-gray-700">
                        Duration & Pricing
                      </h3>
                      <button
                        type="button"
                        onClick={() => addDurationToSection(section.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <span>+ Add Duration</span>
                      </button>
                    </div>

                    {/* Duration Rows */}
                    {section.durations.map((duration, durationIndex) => (
                      <div 
                        key={duration.id} 
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-gray-50 rounded-xl"
                      >
                        {/* Duration Selection */}
                        <div>
                          <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                            Duration
                          </label>
                          <EnhancedOptionInputField
                                    placeholder="Select duration"
                                    value={duration.duration}
                                    onChange={(value) => updateDuration(section.id, duration.id, 'duration', value)}
                                    options={DURATION_OPTIONS}
                                    isSearchable label={''}                          />
                        </div>

                        {/* Price Input */}
                        <div>
                          <InputField
                            label="Price"
                            placeholder="Enter price"
                            type="number"
                            value={duration.price}
                            onChange={(e) => updateDuration(section.id, duration.id, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        {/* Citta Link Selection */}
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
                              Citta Link
                            </label>
                            <EnhancedOptionInputField
                                        placeholder="Select Citta link"
                                        value={duration.cittaLink}
                                        onChange={(value) => updateDuration(section.id, duration.id, 'cittaLink', value)}
                                        options={CITTA_LINKS}
                                        isSearchable label={''}                            />
                          </div>
                          
                          {/* Remove duration button (only show if more than one duration) */}
                          {section.durations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDurationFromSection(section.id, duration.id)}
                              className="mb-[2px] p-2 text-red-500 hover:text-red-700"
                              title="Remove this duration"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section separator */}
                  {sectionIndex < landSizeSections.length - 1 && (
                    <div className="mt-8 pt-8 border-t border-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white text-base font-medium rounded-[60px] hover:bg-green-700 transition-colors"
            >
              Save Property Listing
            </button>
          </div>
        </form>

        {/* Summary Preview */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Preview
          </h2>
          <div className="space-y-4">
            <pre className="bg-gray-50 p-4 rounded-xl text-sm overflow-x-auto">
              {JSON.stringify({
                propertyName,
                propertyDescription,
                landSizeSections: landSizeSections.map(section => ({
                  size: section.size + ' sqm',
                  durations: section.durations.map(d => ({
                    duration: d.duration + ' months',
                    price: `$${d.price}`,
                    cittaLink: d.cittaLink,
                  })),
                })),
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingPage;