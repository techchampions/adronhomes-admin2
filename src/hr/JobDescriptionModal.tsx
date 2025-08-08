// JobDescriptionModal.tsx
import React from 'react';

import { GrClose } from "react-icons/gr";
import { Job } from '../components/Redux/carreer/Single_job_Thunk';

interface JobDescriptionModalProps {
  job: Job;
  onClose: () => void;
}

const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({ job, onClose }) => {
  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000033] bg-opacity-50 backdrop-blur-sm">
      {/* Modal content container */}
      <div className="relative w-full max-w-2xl mx-4 my-6 bg-white rounded-[40px] shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{job.job_title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <GrClose size={24} />
          </button>
        </div>
        
        <div className="mt-6 space-y-5">
          <section>
            <h3 className="font-semibold text-lg text-gray-800">Description</h3>
            <p className="mt-1 text-gray-700">{job.description}</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg text-gray-800">Location</h3>
            <p className="mt-1 text-gray-700">{job.location} ({job.address})</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg text-gray-800">Job Type</h3>
            <p className="mt-1 text-gray-700">{job.job_type}</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg text-gray-800">Compensation</h3>
            <p className="mt-1 text-gray-700">₦{job.compensation.toLocaleString()}</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg text-gray-800">Key Responsibilities</h3>
            <p className="mt-1 text-gray-700">{job.key_responsibility}</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg text-gray-800">Requirements</h3>
            <p className="mt-1 text-gray-700">{job.requirements}</p>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg text-gray-800">Qualifications</h3>
            <p className="mt-1 text-gray-700">{job.qualifications}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionModal;