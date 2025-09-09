import React, { useState } from "react";
import LoadingAnimations from "../components/LoadingAnimations";
import { formatDate } from "../utils/formatdate";
import Pagination from "../components/Tables/Pagination";
import NotFound from "../components/NotFound";
import { Application, ApplicationsData } from "../components/Redux/carreer/Single_job_Thunk";
import AppViewModal from "./ApplicationDetails";

interface ApplicantsTableProps {
  data: Application[];
  isLoading: boolean;
  pagination: any;
  handlePageChange: (page: number) => void;
  currentPage: number;
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ 
  data, 
  isLoading, 
  pagination, 
  handlePageChange,
  currentPage
}) => {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate starting index for serial numbers based on current page and items per page
  const itemsPerPage = pagination.per_page || 10;
  const serialNumberStart = ((currentPage || 1) - 1) * itemsPerPage + 1;

  if (isLoading) {
    return <LoadingAnimations loading={isLoading} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        <NotFound text="No applicant data found" />
      </div>
    );
  }

  const handleRowClick = (applicantId: number) => {
    setSelectedApplication(applicantId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left">
                <th className="py-4 font-normal text-[#757575] text-xs w-[60px]">
                  S/N
                </th>
                {/* <th className="py-4 font-normal text-[#757575] text-xs w-[60px]">
                  ID
                </th> */}
                <th className="py-4 px-6 font-normal text-[#757575] text-xs">Name</th>
                <th className="py-4 px-6 font-normal text-[#757575] text-xs">Email</th>
                <th className="py-4 px-6 font-normal text-[#757575] text-xs">Phone</th>
                <th className="py-4 px-6 font-normal text-[#757575] text-xs">Date Applied</th>
              </tr>
            </thead>
            <tbody>
              {data.map((applicant, index) => (
                <tr 
                  key={`applicant-${applicant.id}`} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(applicant.id)}
                >
                  <td className="py-4 text-dark text-sm truncate w-[60px]">
                    {serialNumberStart + index}
                  </td>
                  {/* <td className="py-4 text-dark text-sm truncate w-[60px]">
                    {applicant.id}
                  </td> */}
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate">
                    {applicant.name}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate">
                    {applicant.email}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate">
                    {applicant.phone}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate">
                    {formatDate(applicant.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8 mb-4" 
        />
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <AppViewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          careerId={selectedApplication}
        />
      )}
    </>
  );
};

export default ApplicantsTable;