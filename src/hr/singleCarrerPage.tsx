// job_details_page.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "../components/Redux/store";

import { formatDate } from "../utils/formatdate";
import Header from "./header";
import DashCard, { DashCard2 } from "../director/DashCard";
import { FaUserShield } from "react-icons/fa6";
import { ReusableTable } from "../components/Tables/Table_one";
import NotFound from "../components/NotFound";
import LoadingAnimations from "../components/LoadingAnimations";

import {
  selectJobDetails,
  selectApplications,
  selectApplicationsPagination,
  setCurrentPage,
  selectTotalCareerViews,
  selectTotalApplications
} from "../components/Redux/carreer/Single_job_slice";

import { fetchJobDetails } from "../components/Redux/carreer/Single_job_Thunk";
import ApplicantsTable from "./singleCareerTable";
import JobDescriptionModal from "./JobDescriptionModal";

export default function SingleJob() {
  const { jobId } = useParams<{ jobId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const jobDetails = useSelector(selectJobDetails);
  const applications = useSelector(selectApplications);
  const pagination = useSelector(selectApplicationsPagination);
  const totalCareerViews = useSelector(selectTotalCareerViews);
  const total_applications = useSelector(selectTotalApplications);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    if (jobId) {
      setIsLoading(true);
      dispatch(fetchJobDetails(jobId))
        .unwrap()
        .then(() => setIsLoading(false))
        .catch((err: any) => {
          setError(err.message || "Failed to fetch job details.");
          setIsLoading(false);
        });
    }
  }, [dispatch, jobId, pagination.currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <LoadingAnimations loading={isLoading} />;
  }

  if (error) {
    return <NotFound text={error} />;
  }

  if (!jobDetails) {
    return <NotFound text="Job details not found." />;
  }

  return (
    <div className="mb-[52px]">
      <Header title="Job Details" subtitle={jobDetails.job_title} isbutton={false}/>

      <div className="space-y-[30px]">
        <div className="grid lg:grid-cols-3 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <DashCard2
            className=""
            isHighlighted={true}
            valueText={jobDetails.job_title}
            mainText={`${jobDetails.job_type} - ${jobDetails.location}`}
            mutedText={`Posted on ${formatDate(jobDetails.created_at)}`}
            actionText="View Job Description"
            icon={<FaUserShield />}
            isloading={isLoading}
            onActionClick={openModal}
          />
          <DashCard
            className=""
            mainText="Total Views"
            valueText={totalCareerViews !== null ? totalCareerViews.toString() : '0'}
            mutedText="All views from visitors"
            isloading={isLoading}
          />
          <DashCard
            className=""
            mainText="Total Applications"
            valueText={total_applications !== null ? total_applications.toString() : '0'}
            mutedText="Total applications for this job"
            isloading={isLoading}
          />
        </div>

        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <ReusableTable
            tabs={["Applicants"]}
            searchPlaceholder="Search Applicants"
            activeTab="Applicants"
            onTabChange={() => {}}
          >
            <ApplicantsTable
              data={applications || []}
              isLoading={isLoading}
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </ReusableTable>
        </div>
      </div>

      {isModalOpen && (
        <JobDescriptionModal job={jobDetails} onClose={closeModal} />
      )}
    </div>
  );
}
