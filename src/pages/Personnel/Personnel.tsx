import React, { useContext, useEffect, useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import UsersTableComponent from "./Personnel_Table";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { personnels } from "../../components/Redux/personnel/personnel_thunk";
import { User } from "../../components/Redux/personnel/edithPersonelle";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import { PropertyContext } from "../../MyContext/MyContext";

interface UsersTable {
  id: number;
  User: string;
  Email: string;
  Role: string;
  Created: string;
  user: User;
  referral_code: any;
}

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
      return "Customer service";
    default:
      return "Unknown";
  }
};


export default function Personnel() {
  const sortOptions = [
    { value: 0, name: "All" },
    { value: 1, name: "Admin" },
    { value: 2, name: "Marketer" },
    { value: 3, name: "Sales Director" },
    { value: 4, name: "Accountant" },
    { value: 5, name: "Human Resources" },
    { value: 6, name: "Legal", },
    { value: 7, name: "Info Tech", },
    { value: 8, name: "Customer service", }
  ];



  const tabs = ["All"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { data, error, loading } = useSelector(
    (state: RootState) => state.getpersonnel
  );

  const { option, setOption } = useContext(PropertyContext)!;

  useEffect(() => {
    // const roleValues = sortOptions.map(option => option.value);
    dispatch(personnels({ role: option.value }));
  }, [dispatch, option]);

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

  // Filter data based on search term
  const filteredData = allData.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.User.toLowerCase().includes(searchLower) ||
      item.Email.toLowerCase().includes(searchLower) ||
      item.Role.toLowerCase().includes(searchLower)
    );
  });

  const isEmpty = filteredData.length === 0;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

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
          searchPlaceholder="search for personnel"
          onSearch={handleSearch}
          sortOptions={sortOptions}
          onSortChange={setOption}
          defaultSort={0}
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
