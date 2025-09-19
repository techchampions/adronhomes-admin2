import React, { useContext, useEffect, useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import UsersTableComponent from "./Personnel_Table";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { personnels } from "../../components/Redux/personnel/personnel_thunk";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import { PropertyContext } from "../../MyContext/MyContext";
import {
  setPersonnelSearch,
  setCurrentPage,
} from "../../components/Redux/personnel/personnel_slice";

const getRoleName = (roleId: number): string => {
  switch (roleId) {
    case 0:
      return "Customer";
    case 1:
      return "Admin";
    case 2:
      return "Marketer";
    case 3:
      return "Director";
    case 4:
      return "Accountant";
    case 5:
      return "HR";
    case 6:
      return "Legal";
    case 7:
      return "Info Tech";
    case 8:
      return "Client service";
    default:
      return "Unknown";
  }
};

export default function Personnel() {
  const tabs = ["All"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const dispatch = useDispatch<AppDispatch>();
  const { data, error, loading, search, pagination } = useSelector(
    (state: RootState) => state.getpersonnel
  );

  const { option } = useContext(PropertyContext)!;

  // Fetch data on mount, and when search or role changes
  useEffect(() => {
    dispatch(personnels({ role: option.value, search }));
  }, [dispatch, option.value, search, pagination.currentPage]);

  const handleSearch = (term: string) => {
    dispatch(setPersonnelSearch(term)); // Resets page to 1 inside reducer
    dispatch(personnels({ role: option.value, search: term }));
  };

  const personnelData = (): any[] => {
    if (!data?.data) return [];

    return data.data.map((item) => ({
      id: item.id,
      User: item ? `${item.first_name} ${item.last_name}` : "N/A",
      Email: item.email,
      Role: getRoleName(item.role),
      Created: item.created_at,
      referral_code: item.referral_code,
      user: {
        ...item,
        country: item.country || "",
      },
    }));
  };

  const allData = personnelData();
  const isEmpty = allData.length === 0;

  return (
    <div className="mb-[52px]">
      <Header
        title="Personnel"
        subtitle="Manage the list of personnel and their access"
      />

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] relative">
        <ReusableTable
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchPlaceholder="Search for personnel"
          onSearch={handleSearch}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center">
              <LoadingAnimations loading={loading} />
            </div>
          ) : isEmpty ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">
                No data found
              </p>
              <NotFound />
            </div>
          ) : (
            <UsersTableComponent userData={allData} />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}
