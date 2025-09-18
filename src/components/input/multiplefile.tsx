import React, { useRef, useState, ChangeEvent, useEffect } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { MdClose, MdPictureAsPdf, MdLink, MdImage } from "react-icons/md";

// Type definition for a single item in the value array, can be a File or a string URL
type FileItem = File | string;

interface FileUploadFieldProps {
  label: string;
  placeholder: string;
  onChange: (files: FileItem[] | null) => void;
  required?: boolean;
  error?: any;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  name: string;
  value?: FileItem[];
}

const MultipleFileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  placeholder,
  onChange,
  required = false,
  error,
  disabled = false,
  accept,
  multiple = false,
  name,
  value,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState<{ [key: string]: boolean }>({});
  const [previewErrors, setPreviewErrors] = useState<{ [key: string]: string }>({});
  const [loadingPreviews, setLoadingPreviews] = useState<{ [key: string]: boolean }>({});

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const newFiles = Array.from(files);
    let hasDuplicate = false;
    let newFileArray: FileItem[] = value ? [...value] : [];

    for (const newFile of newFiles) {
      const isDuplicate = value && value.some(existingItem => {
        const existingName = getItemName(existingItem);
        return existingName === newFile.name;
      });

      if (isDuplicate) {
        setDuplicateError(`File already exists: ${newFile.name}`);
        hasDuplicate = true;
        break;
      }
      newFileArray.push(newFile);
    }

    if (!hasDuplicate) {
      onChange(newFileArray.length > 0 ? newFileArray : null);
      setDuplicateError(null);
    }
  };

  const handleRemoveItem = (itemToRemove: FileItem) => {
    const filteredItems = value ? value.filter(item => item !== itemToRemove) : [];
    onChange(filteredItems.length > 0 ? filteredItems : null);
    setDuplicateError(null);
    setPreviewErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`item-${value?.indexOf(itemToRemove)}`];
      return newErrors;
    });
    setLoadingPreviews(prev => {
      const newLoading = { ...prev };
      delete newLoading[`item-${value?.indexOf(itemToRemove)}`];
      return newLoading;
    });
  };

  const getItemName = (item: FileItem): string => {
    if (typeof item === 'string') {
      try {
        const normalizedUrl = item.replace(/\/+/g, '/');
        const decodedUrl = decodeURI(normalizedUrl);
        const pathSegments = decodedUrl.split('/');
        const fileName = pathSegments[pathSegments.length - 1];
        return fileName.split('?')[0];
      } catch {
        return item;
      }
    }
    return item.name;
  };

  const getItemType = (item: FileItem): 'image' | 'pdf' | 'other' => {
    let filename;
    if (typeof item === 'string') {
      try {
        const normalizedUrl = item.replace(/\/+/g, '/');
        const decodedUrl = decodeURI(normalizedUrl);
        const pathSegments = decodedUrl.split('/');
        filename = pathSegments[pathSegments.length - 1].split('?')[0];
      } catch {
        return 'other';
      }
    } else {
      filename = item.name;
    }
    
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
      return 'image';
    }
    if (extension === 'pdf') {
      return 'pdf';
    }
    return 'other';
  };

  const getItemIcon = (type: 'image' | 'pdf' | 'other') => {
    switch (type) {
      case 'image':
        return <MdImage size={16} className="text-blue-500" />;
      case 'pdf':
        return <MdPictureAsPdf size={16} className="text-red-500" />;
      default:
        return <MdLink size={16} className="text-gray-500" />;
    }
  };

const handleTogglePreview = (itemKey: string, item: FileItem) => {
  setPreviewOpen(prev => {
    const isOpen = !prev[itemKey];
    if (isOpen) {
      setLoadingPreviews(prevLoading => ({ ...prevLoading, [itemKey]: true }));
      // Check if the item is a File object before trying to create an object URL
      if (typeof item === 'object' && item instanceof File) {
        try {
          const src = URL.createObjectURL(item);
          // Now you have the object URL, but the logic to store and clean it up
          // needs to be handled correctly, as shown in the previous complete code example.
          // This state update is just to toggle the preview.
        } catch (e) {
          console.warn('Error creating object URL:', e);
          setLoadingPreviews(prevLoading => ({ ...prevLoading, [itemKey]: false }));
          setPreviewErrors(prevErrors => ({ ...prevErrors, [itemKey]: 'Failed to load preview' }));
          return prev; // Don't open the preview if it fails
        }
      }
    } else {
      setLoadingPreviews(prevLoading => {
        const newLoading = { ...prevLoading };
        delete newLoading[itemKey];
        return newLoading;
      });
    }
    return { ...prev, [itemKey]: isOpen };
  });
};

  const renderPreview = (item: FileItem, index: number) => {
    const type = getItemType(item);
    const itemKey = `item-${index}`;
    const isOpen = previewOpen[itemKey];
    const hasError = previewErrors[itemKey];
    const isLoading = loadingPreviews[itemKey];

    // Early exit if the preview is not open
    if (!isOpen) {
      return null;
    }
    
    // Determine the source URL
    let src = '';
    let objectUrlToRevoke: string | null = null;
    if (typeof item === 'string') {
      src = item.replace(/\/+/g, '/');
    } else {
      try {
        src = URL.createObjectURL(item);
        objectUrlToRevoke = src;
      } catch (e) {
        return <p className="text-sm text-red-500">Failed to create preview.</p>;
      }
    }

    const handleImageLoad = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      setLoadingPreviews(prev => ({ ...prev, [itemKey]: false }));
      setPreviewErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[itemKey];
        return newErrors;
      });
    };

    const handleImageError = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      setLoadingPreviews(prev => ({ ...prev, [itemKey]: false }));
      setPreviewErrors(prev => ({ ...prev, [itemKey]: 'Failed to load image preview' }));
    };

    if (type === 'image') {
      return (
        <div>
          {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
          {hasError && <p className="text-sm text-red-500">{hasError}</p>}
          {!hasError && (
            <img
              src={src}
              alt={getItemName(item)}
              className="max-w-full max-h-32 object-contain rounded border"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          )}
        </div>
      );
    }

    if (type === 'pdf') {
      return (
        <div>
          {hasError && <p className="text-sm text-red-500">{hasError}</p>}
          {!hasError && (
            <iframe
              src={src}
              className="w-full h-32 border rounded"
              title={getItemName(item)}
              onLoad={() => {
                if (objectUrlToRevoke) {
                  URL.revokeObjectURL(objectUrlToRevoke);
                }
              }}
              onError={() => {
                if (objectUrlToRevoke) {
                  URL.revokeObjectURL(objectUrlToRevoke);
                }
                setPreviewErrors(prev => ({ ...prev, [itemKey]: 'Failed to load PDF preview' }));
              }}
            />
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <label className="block text-[#4F4F4F] font-[325] text-[14px] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <div
          className={`w-full bg-[#F5F5F5] flex items-center px-[24px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px] ${
            (error || duplicateError) ? "border border-red-500" : ""
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={handleClick}
        >
          {value && value.length > 0 ? (
            <div className="flex flex-wrap gap-2 pr-10">
              {value.map((item, index) => {
                const type = getItemType(item);
                const name = getItemName(item);
                const itemKey = `item-${index}`;
                
                return (
                  <div
                    key={index}
                    className="flex flex-col bg-white rounded-lg border p-2 text-sm min-w-0"
                  >
                    <div className="flex items-center">
                      {getItemIcon(type)}
                      <span className="truncate ml-2 max-w-32" title={name}>
                        {name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item);
                        }}
                        className="ml-2 text-gray-500 hover:text-red-600 focus:outline-none flex-shrink-0"
                      >
                        <MdClose size={16} />
                      </button>
                    </div>
                    {(type === 'image' || type === 'pdf') && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePreview(itemKey, item);
                          }}
                          className="text-xs text-blue-600 hover:underline mb-1"
                        >
                          {previewOpen[itemKey] ? 'Hide Preview' : 'Show Preview'}
                        </button>
                      </div>
                    )}
                    {renderPreview(item, index)}
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}

          <AiOutlineUpload
            className={`absolute top-3 right-3 ${
              disabled ? "text-gray-400" : "text-[#4F4F4F]"
            }`}
            size={20}
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled}
          accept={accept}
          multiple={multiple}
          name={name}
          className="hidden"
        />
      </div>

      {(error || duplicateError) && (
        <p className="text-red-500 text-sm mt-1">
          {duplicateError || (Array.isArray(error) ? error[0] : error)}
        </p>
      )}
    </div>
  );
};

export default MultipleFileUploadField;