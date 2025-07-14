import React, { useEffect, useState } from "react";

import { ReusableTable } from "../components/Tables/Table_one";
import ReferralModal from "../marketer/referalModal/referralModal";

import { FaUserShield } from "react-icons/fa6";

import NotFound from "../components/NotFound";
import { formatDate } from "../utils/formatdate";
import DashCard from "../director/DashCard";
import HumanResources, { JobData } from "./TABLE"; 
import Header from "./header";
import { AppDispatch, RootState } from "../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchCareers } from "../components/Redux/carreer/career_thunk";

// Define the expected structure of the data returned by useGetDirectorDashboard
interface DirectorDashboardData {
  director: {
    first_name: string;
    last_name: string;
    created_at: string;
    // Add other director properties if needed
  };
  total_careers: number;
  total_career_views: number;
  total_applications: number;
  properties: any[]; 
}

// Mock hook for demonstration purposes
const useGetDirectorDashboard = () => {
  const [data, setData] = useState<DirectorDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      // Simulate success
      setData({
        director: {
          first_name: "John",
          last_name: "Doe",
          created_at: "2024-01-15T10:00:00Z", 
        },
        total_careers: 203,
        total_career_views: 403,
        total_applications: 670,
        properties: [],
      });
      setIsLoading(false);

      // Simulate error (uncomment to test error state)
      // setIsError(true);
      // setIsLoading(false);
    }, 1500); // Simulate 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, isError };
};


// // Mock data for the HumanResources table (Careers)
// const mockJobData: JobData[] = [
//   {
//     id: "#485874FFG",
//     role: "Regional Manager",
//     date_posted: "19.07.2025",
//     views: 122,
//     compensation: "₦57,600,000",
//     applications: 2,
//   },
//   {
//     id: "#485874ABC",
//     role: "Software Engineer",
//     date_posted: "18.07.2025",
//     views: 850,
//     compensation: "₦75,000,000",
//     applications: 15,
//   },
//   {
//     id: "#485874XYZ",
//     role: "Marketing Specialist",
//     date_posted: "17.07.2025",
//     views: 300,
//     compensation: "₦40,000,000",
//     applications: 5,
//   },
//   {
//     id: "#485874DEF",
//     role: "HR Generalist",
//     date_posted: "16.07.2025",
//     views: 50,
//     compensation: "₦30,000,000",
//     applications: 1,
//   },
//   {
//     id: "#485874GHI",
//     role: "Data Analyst",
//     date_posted: "15.07.2025",
//     views: 600,
//     compensation: "₦50,000,000",
//     applications: 10,
//   },
// ];

export default function HRDashboard() {
  const { data, isLoading, isError } = useGetDirectorDashboard();


   const {
    data: carreerData,
    error: carreerError,
    loading: carreerLoading,
    name,
    totalCareer,
    totalCareerViews,
    totalApplications
  } = useSelector((state: RootState) => state.getcareers);
  const tabs = ["Jobs"];
  const [activeTab, setActiveTab] = useState("Jobs"); 
  const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchCareers());
  }, [dispatch]);

  // You can add an error handling display here if useGetDirectorDashboard reports an error
  if (isError) {
    return <NotFound />; 
  }

  return (
    <div className="mb-[52px]">
      <Header title="Dashboard" subtitle="Human Resources" />

      <div className="space-y-[30px]">
        <div className="grid lg:grid-cols-5 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <DashCard
            className="col-span-2"
            isHighlighted={true}
            valueText={'Human Resources'}
            mainText={`${name || 'Loading...'}`}
            // mutedText={`Created at ${data?.director.created_at ? formatDate(data.director.created_at) : 'Loading...'}`}
            actionText="Account Settings"
            icon={<FaUserShield />}
            isloading={isLoading} 
          />
          <DashCard
            className=""
            mainText="Total Jobs"
          valueText={totalCareer != null ? totalCareer : 'Loading...'}

            mutedText="Includes all Jobs"
            isloading={isLoading} 
          />
          <DashCard
            className=""
            mainText="Total Jobs Views"
              valueText={totalCareerViews != null ? totalCareerViews : 'Loading...'}
            mutedText="Includes all career views"
            isloading={isLoading} 
          />
          <DashCard
            className=""
            mainText="Applications"
            valueText={totalApplications != null ? totalApplications : 'Loading...'}
            mutedText="Includes all career applications"
            isloading={isLoading} 
          />
        </div>

        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <ReusableTable
            tabs={tabs}
            searchPlaceholder="Search Jobs" 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {/* The HumanResources component now receives the isLoading prop */}
            <HumanResources data={carreerData?.data} isLoading={carreerLoading} />
          </ReusableTable>

          {showModal && <ReferralModal onClose={() => setShowModal(false)} />}
        </div>
      </div>
    </div>
  );
}