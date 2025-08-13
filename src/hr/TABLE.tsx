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
import { resetDeleteJobState, selectDeleteJobError, selectDeleteJobLoading, selectDeleteJobSuccess } from "../components/Redux/carreer/delete_job_slice";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/Modals/delete";
import { deleteJob } from "../components/Redux/carreer/delete_job_thunk";
import { selectEditJobLoading, selectEditJobSuccess, selectEditJobError, resetEditJobState } from "../components/Redux/carreer/edit_job_slice";
import { editJob } from "../components/Redux/carreer/edit_job_thunk";
import EditJobModal from "./EdithHr";
import { useNavigate } from "react-router-dom";




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
  data: any 
  isLoading: boolean;
}

const HumanResources: React.FC<JobTableProps> = ({ data, isLoading }) => {
  const dispatch = useDispatch<AppDispatch>();
const navigate =useNavigate()
  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobData | null>(null);

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<JobData | null>(null);

  // Redux states for delete operation
  const deleteloading = useSelector(selectDeleteJobLoading);
  const deleteSuccess = useSelector(selectDeleteJobSuccess);
  const deleteError = useSelector(selectDeleteJobError);

  // Redux states for edit operation
  const editLoading = useSelector(selectEditJobLoading);
  const editSuccess = useSelector(selectEditJobSuccess);
  const editError = useSelector(selectEditJobError);

  const pagination = useSelector(selectCareerPagination);

  // Handle page change for career listings
  const handlePageChange = async (page: number) => {
    await dispatch(setCurrentPage(page));
    await dispatch(fetchCareers());
  };

  // --- Delete Job Handlers ---
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

  // Effect for delete operation feedback
  useEffect(() => {
    if (deleteSuccess) {
      // toast.success("Job deleted successfully!");
      handleCloseDeleteModal();
      dispatch(fetchCareers());
    }
    if (deleteError) {
      // Error toast is already handled in the thunk, but you can add more logic here if needed
      handleCloseDeleteModal();
    }
  }, [deleteSuccess, deleteError, dispatch]);

  // --- Edit Job Handlers ---
  const handleEditClick = (job: JobData) => {
    setJobToEdit(job);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setJobToEdit(null);
    dispatch(resetEditJobState()); 
  };

  const handleSaveEdit = async (updatedJobData: FormData) => {
    if (jobToEdit) {
      await dispatch(editJob({ id: jobToEdit.id, credentials: updatedJobData }));
    }
  };

  // Effect for edit operation feedback
  useEffect(() => {
    if (editSuccess) {
      // toast.success("Job updated successfully!");
      handleCloseEditModal();
      dispatch(fetchCareers()); 
    }
    if (editError) {
      handleCloseEditModal();
    }
  }, [editSuccess, editError, dispatch]);


  if (isLoading) {
    return <LoadingAnimations loading={isLoading} />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] md:min-w-0">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left">
              <th className="py-4 font-normal text-[#757575] text-xs w-[60px]">
                ID
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[300px]">
                Role
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[80px]">
                Views
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[100px]">
                Applications
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[160px]">
                Compensation
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[140px]">
                Date Posted
              </th>
              <th className="py-4 px-6 font-normal text-[#757575] text-xs w-[100px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((job: JobData) => (
                <tr key={`job-${job.id}`} className="cursor-pointer">
                  <td className="py-4 text-dark text-sm truncate w-[60px]" onClick={()=>navigate(`/human-resources/view-job/${job.id}`)}>
                    {job.id}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate w-[300px]" onClick={()=>navigate(`/human-resources/view-job/${job.id}`)}>
                    {job.job_title}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate w-[80px]" onClick={()=>navigate(`/human-resources/view-job/${job.id}`)}>
                    {job.views}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate w-[100px]" onClick={()=>navigate(`/human-resources/view-job/${job.id}`)}>
                    {job.total_applications}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate w-[160px]" onClick={()=>navigate(`/human-resources/view-job/${job.id}`)}>
                    {formatAsNaira(job.compensation)}
                  </td>
                  <td className="py-4 px-6 font-[325] text-dark text-sm truncate w-[140px]" onClick={()=>navigate(`/human-resources/view-job/${job.id}`)}>
                    {formatDate(job.created_at)}
                  </td>
                  <td className="py-4 pl-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        aria-label="Edit job"
                        onClick={() => handleEditClick(job)}
                      >
                        <img
                          src="/ic_round-edit.svg"
                          className="w-[18px] h-[18px]"
                          alt="Edit"
                        />
                      </button>
                      <button
                        aria-label="Delete job"
                        onClick={() => handleDeleteClick(job)}
                      >
                        <img
                          src="mingcute_delete-fill.svg"
                          className="w-[18px] h-[18px]"
                          alt="Delete"
                        />
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
      <div className="w-full">
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8 mb-4"
        />
      </div>

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Job"
          description="Are you sure you want to delete"
          subjectName={jobToDelete.job_title} 
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          loading={deleteloading}
          confirmButtonText="Delete Job"
          cancelButtonText="Cancel"
        />
      )}

      {/* Edit Job Modal */}
      {jobToEdit && (
        <EditJobModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          jobData={jobToEdit}
          loading={editLoading}
        />
      )}
    </div>
  );
};

export default HumanResources;
