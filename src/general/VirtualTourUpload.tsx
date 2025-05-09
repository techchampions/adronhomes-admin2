import { useState, ChangeEvent, DragEvent } from 'react';
import { BiPlus, BiUpload } from 'react-icons/bi';
import { BsInfo } from 'react-icons/bs';
import { FaCircleExclamation } from 'react-icons/fa6';


export default function VirtualTourUpload() {
  const [tourLink, setTourLink] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newImages = Array.from(e.dataTransfer.files).filter((file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
      });

      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).filter((file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
      });

      setImages((prev) => [...prev, ...newImages]);
    }
  };

  return (
    <div>
      {/* Image Upload Section */}
      <div
        className="mb-8"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative md:w-[138px] md:h-[119px] w-20 h-20  bg-gray-200 rounded-[20px] overflow-hidden">
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          <label
            className={`md:w-[138px] md:h-[119px] w-20 h-20 rounded-[20px] flex flex-col items-center justify-center  bg-[#F5F5F5] cursor-pointer ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              multiple
              onChange={handleFileSelect}
            />
            <div className="p-4 bg-[#272727] rounded-full mb-2">
              <BiPlus className="w-4 h-4 text-white" />
            </div>
          </label>
        </div>

        <div className="mt-4 text-[#767676] text-[14px] space-y-[5px]">
          <p className="font-[350]">Minimum Resolution: 1500 x 1000 pixels</p>
          <p className="font-[350]">Recommended Aspect Ratio: 3:2</p>
          <p className="font-[350]">File Size: Max 5MB per image</p>
          <p className="font-[350]">Formats Supported: JPG, JPEG, PNG</p>
        </div>

        <div className="flex items-center mt-[11px] text-[#767676] font-[325] text-sm">
          <FaCircleExclamation className="w-5 h-5 mr-2 text-[#767676]" />
          <p>Drag pictures in order in which you want them to appear.</p>
        </div>
      </div>

      {/* Virtual Tour Section */}
      <div className="mt-8">
        <h2 className="text-[20px] font-[325] text-dark mb-2">Virtual Tour</h2>
        <p className="text-[#767676] text-sm  font-[325] mb-3">
          Upload the virtual tour link of the property in the text field below.
        </p>

      </div>
    </div>
  );
}
