import React, { useEffect, useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import UsersTableComponent from "./Personnel_Table";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { personnels } from "../../components/Redux/personnel/personnel_thunk";
import { User } from "../../components/Redux/personnel/edithPersonelle";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";

interface UsersTable {
  id: number;
  User: string;
  Email: string;
  Role: string;
  Created: string;
  user: User;
}

const getRoleName = (roleId: number) => {
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
    default:
      return "Unknown";
  }
};

export default function Personnel() {
  const tabs = ["All"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const dispatch = useDispatch<AppDispatch>();
  const { data, error, loading } = useSelector(
    (state: RootState) => state.getpersonnel
  );

  useEffect(() => {
    dispatch(personnels());
  }, [dispatch]);

  const personnelData = (): any[] => {
    if (!data?.data) return [];

    return data.data.map((item) => ({
      id: item.id,
      User: item ? `${item.first_name} ${item.last_name}` : "N/A",
      Email: item.email,
      Role: getRoleName(item.role),
      Created: item.created_at,
      user: {
        ...item,
        country: item.country || "",
      },
    }));
  };

  const filteredData = personnelData();
  const isEmpty = filteredData.length === 0;

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
        >
          {loading ? (
            <div className=" w-full flex items-center justify-center">
              {" "}
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
            <UsersTableComponent userData={filteredData} />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}
