import React, { useState, useEffect } from "react";
import LoadingAnimations from "../components/LoadingAnimations";
import { formatDate } from "../utils/formatdate";
import Pagination from "../components/Tables/Pagination";
import { selectCareerPagination, setCurrentPage } from "../components/Redux/carreer/career_slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCareers } from "../components/Redux/carreer/career_thunk";
import { AppDispatch } from "../components/Redux/store";
import NotFound from "../components/NotFound";
import { formatAsNaira } from "../utils/formatcurrency";
import {
  resetDeleteJobState,
  selectDeleteJobError,
  selectDeleteJobLoading,
  selectDeleteJobSuccess,
} from "../components/Redux/carreer/delete_job_slice";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/Modals/delete";
import { deleteJob } from "../components/Redux/carreer/delete_job_thunk";
import {
  selectEditJobLoading,
  selectEditJobSuccess,
  selectEditJobError,
  resetEditJobState,
} from "../components/Redux/carreer/edit_job_slice";
import { editJob } from "../components/Redux/carreer/edit_job_thunk";
import EditJobModal from "./EdithHr";
import { useNavigate } from "react-router-dom";
import {  selectJobDetails,  } from "../components/Redux/carreer/Single_job_slice"; // Added loading/error selectors
import { fetchJobDetails, } from "../components/Redux/carreer/Single_job_Thunk";

export interface JobData {
  id: number;
  job_title: string;
  created_at: string | null;
  views: number;
  compensation: number | null;
  total_applications: number;
  description?: string;
  location?: string;
  job_type?: string;
  key_responsibility?: string | null;
  requirements?: string | null;
  qualifications?: string | null;
  address?: string | null;
}

interface JobTableProps {
  data: JobData[];
  isLoading: boolean;
  currentPage: number;
}

const HumanResources: React.FC<JobTableProps> = ({ data, isLoading, currentPage }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobData | null>(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [jobToEditId, setJobToEditId] = useState<number | null>(null); // Track which job we're editing

  // Redux selectors
  const deleteloading = useSelector(selectDeleteJobLoading);
  const deleteSuccess = useSelector(selectDeleteJobSuccess);
  const deleteError = useSelector(selectDeleteJobError);

  const editLoading = useSelector(selectEditJobLoading);
  const editSuccess = useSelector(selectEditJobSuccess);
  const editError = useSelector(selectEditJobError);

  const jobDetails = useSelector(selectJobDetails);
  // const jobDetailsLoading = useSelector(selectJobDetailsLoading);
  // const jobDetailsError = useSelector(selectJobDetailsError);

  const pagination = useSelector(selectCareerPagination);

  const itemsPerPage = pagination.perPage || 10;
  const serialNumberStart = (currentPage - 1) * itemsPerPage + 1;

  const handlePageChange = async (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchCareers({ page }));
  };

  // --- Delete Handlers ---
  const handleDeleteClick = (job: JobData) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
    dispatch(resetDeleteJobState());
  };

  const handleConfirmDelete = async () => {
    if (jobToDelete) {
      await dispatch(deleteJob(jobToDelete.id));
    }
  };

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Job deleted successfully");
      handleCloseDeleteModal();
      dispatch(fetchCareers({ page: currentPage }));
    }
    if (deleteError) {
      toast.error(deleteError || "Failed to delete job");
      handleCloseDeleteModal();
    }
  }, [deleteSuccess, deleteError, dispatch, currentPage]);

  // --- Edit Handlers ---
  const handleEditClick = async (jobId: any) => {
    setJobToEditId(jobId);
    setIsEditModalOpen(true); // Open modal immediately for better UX

    // Fetch job details
    try {
      await dispatch(fetchJobDetails(jobId)).unwrap();
    } catch (err: any) {
      toast.error(err.message || "Failed to load job details for editing");
      setIsEditModalOpen(false);
      setJobToEditId(null);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setJobToEditId(null);
    dispatch(resetEditJobState());
  };

  const handleSaveEdit = async (updatedJobData: FormData) => {
    if (jobToEditId) {
      await dispatch(editJob({ id: jobToEditId, credentials: updatedJobData }));
    }
  };

  useEffect(() => {
    if (editSuccess) {
      toast.success("Job updated successfully");
      handleCloseEditModal();
      dispatch(fetchCareers({ page: currentPage }));
    }
    if (editError) {
      toast.error(editError || "Failed to update job");
      // Do NOT close modal on error — let user fix and retry
    }
  }, [editSuccess, editError, dispatch, currentPage]);

  if (isLoading) {
    return <LoadingAnimations loading={isLoading} />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] md:min-w-0">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left">
              <th className="py-4 font-normal text-[#757575] text-xs w-[60px]">S/N</th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[300px]">Role</th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[80px]">Views</th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[100px]">Applications</th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[160px]">Compensation</th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[140px]">Date Posted</th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((job: JobData, index: number) => (
                <tr key={`job-${job.id}`} className="cursor-pointer hover:bg-gray-50">
                  <td
                    className="py-4 text-dark text-sm truncate w-[60px]"
                    onClick={() => navigate(`/human-resources/view-job/${job.id}`)}
                  >
                    {serialNumberStart + index}
                  </td>
                  <td
                    className="py-4 px-6 font-[325] text-dark text-sm truncate w-[300px]"
                    onClick={() => navigate(`/human-resources/view-job/${job.id}`)}
                  >
                    {job.job_title}
                  </td>
                  <td
                    className="py-4 px-6 font-[325] text-dark text-sm truncate w-[80px]"
                    onClick={() => navigate(`/human-resources/view-job/${job.id}`)}
                  >
                    {job.views}
                  </td>
                  <td
                    className="py-4 px-6 font-[325] text-dark text-sm truncate w-[100px]"
                    onClick={() => navigate(`/human-resources/view-job/${job.id}`)}
                  >
                    {job.total_applications}
                  </td>
                  <td
                    className="py-4 px-6 font-[325] text-dark text-sm truncate w-[160px]"
                    onClick={() => navigate(`/human-resources/view-job/${job.id}`)}
                  >
                    {formatAsNaira(job.compensation)}
                  </td>
                  <td
                    className="py-4 px-6 font-[325] text-dark text-sm truncate w-[140px]"
                    onClick={() => navigate(`/human-resources/view-job/${job.id}`)}
                  >
                    {formatDate(job.created_at)}
                  </td>
                  <td className="py-4 pl-4 text-sm">
                    <div className="flex space-x-3">
                      <button
                        aria-label="Edit job"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(job.id);
                        }}
                        className="hover:opacity-70"
                      >
                        <img src="/ic_round-edit.svg" className="w-[18px] h-[18px]" alt="Edit" />
                      </button>
                      <button
                        aria-label="Delete job"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(job);
                        }}
                        className="hover:opacity-70"
                      >
                        <img src="mingcute_delete-fill.svg" className="w-[18px] h-[18px]" alt="Delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    No job data found
                    <NotFound />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full mt-8 mb-4">
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Job"
        description="Are you sure you want to delete"
        subjectName={jobToDelete?.job_title || ""}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteloading}
        confirmButtonText="Delete Job"
        cancelButtonText="Cancel"
      />

      {/* Edit Job Modal */}
      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        jobData={jobDetails} // This now correctly receives fetched details
        loading={false}        // loading={editLoading || jobDetailsLoading} // Show loading while fetching or saving
        // error={jobDetailsError}
      />
    </div>
  );
};

export default HumanResources;
