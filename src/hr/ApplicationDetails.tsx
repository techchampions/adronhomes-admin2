import React, { useState } from 'react';
import { BiCopy, BiDownload, BiX } from 'react-icons/bi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BASE_URL } from '../components/Redux/UpdateContract/viewcontractFormDetails';
import { fetchCareerById } from '../components/Redux/carreer/ViewApplicationthunk';
import { useAppDispatch, useAppSelector } from '../components/Redux/hook';

interface AppViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerId: number;
}

const AppViewModal: React.FC<AppViewModalProps> = ({ isOpen, onClose, careerId }) => {
  const dispatch = useAppDispatch();
  const { data: career, loading, error } = useAppSelector((state: { ViewApplication: any }) => state.ViewApplication);
  const [isContinuing, setIsContinuing] = useState(false);

  React.useEffect(() => {
    if (isOpen && careerId) {
      dispatch(fetchCareerById(careerId));
    }
  }, [dispatch, isOpen, careerId]);

  const handleContinue = () => {
    setIsContinuing(true);
    setTimeout(() => {
      console.log('Continuing...');
      setIsContinuing(false);
      toast.success('Application submitted successfully!');
      onClose();
    }, 1500);
  };

  const copyToClipboard = (text: string, itemName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          toast.success(`${itemName} copied to clipboard!`);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          toast.error('Failed to copy to clipboard');
        });
    } else {
      // Fallback for browsers that don't support the Clipboard API
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      toast.success(`${itemName} copied to clipboard!`);
    }
  };

  if (!isOpen) return null;

  if (loading) return (
    <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-[40px] shadow-xl w-full max-w-md p-6 text-center">
        <p>Loading application details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0  bg-[#00000066] bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-[40px] shadow-xl w-full max-w-md p-6 text-center">
        <p className="text-red-500">Error: {error.message}</p>
        <button 
          onClick={onClose}
          className="mt-4 bg-[#79B833] text-white font-medium py-2 px-4 rounded-full"
        >
          Close
        </button>
      </div>
    </div>
  );

  if (!career) return (
    <div className="fixed inset-0  bg-[#00000066] bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-[40px] shadow-xl w-full max-w-md p-6 text-center">
        <p>No career data found</p>
        <button 
          onClick={onClose}
          className="mt-4 bg-[#79B833] text-white font-medium py-2 px-4 rounded-full"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex justify-center items-center z-50 p-4">
  <div className="bg-white rounded-[40px] shadow-xl w-full max-w-xl relative max-h-[90vh] flex flex-col">

    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 focus:outline-none"
    >
      <BiX size={24} />
    </button>

    {/* Header */}
    <div className="px-6 py-12 pb-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{career.name}</h1>
          <p className="text-sm text-gray-500">Sent {new Date(career.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 text-gray-700 justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{career.email}</span>
          <button
            onClick={() => copyToClipboard(career.email, 'Email')}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            title="Copy email"
          >
            <BiCopy size={16} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{career.phone}</span>
          <button
            onClick={() => copyToClipboard(career.phone, 'Phone number')}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            title="Copy phone number"
          >
            <BiCopy size={16} />
          </button>
        </div>
      </div>
    </div>

    {/* Scrollable Body */}
    <div className="px-6 overflow-y-auto flex-1 space-y-6">
      {/* Cover Letter */}
      <div>
        <h2 className="text-md font-medium text-gray-800">Cover Letter</h2>
        <div className="bg-gray-50 p-4 rounded-[40px] border border-gray-200 text-gray-700 leading-relaxed mt-2">
          {career.cover_letter || <p>No cover letter provided</p>}
        </div>
      </div>

      {/* Resume Download */}
      <div className="flex justify-between items-center pb-12 pt-6">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
          <span className="text-gray-700">
            {career.resume ? `Resume_${career.name.split(' ')[0]}.pdf` : 'No resume uploaded'}
          </span>
        </div>
        {career.resume && (
          <a
            href={`${career.resume}`}
            className="flex items-center text-[#272727] font-bold transition-colors focus:outline-none"
            download
          >
            <span>Download</span>
            <BiDownload size={16} className="ml-1" />
          </a>
        )}
      </div>
    </div>

    {/* Footer / Continue Button */}
    {/* <div className="px-6 pb-6 pt-6 border-gray-200">
      <button
        onClick={handleContinue}
        className="w-full bg-[#79B833] text-white font-medium py-3 px-6 rounded-full transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isContinuing}
      >
        {isContinuing ? 'Loading...' : 'Continue'}
      </button>
    </div> */}
  </div>
</div>

  );
};

export default AppViewModal;