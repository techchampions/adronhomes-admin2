import React from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import Pagination from "../../components/Pagination";
import { FaCaretDown } from "react-icons/fa";

interface UsersTable {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
}

interface UsersTableProps {
  data: UsersTable[];
}

export default function UsersTableComponent() {
  // Using the data from the image
  const userData = [
    {
      id: "1",
      name: "Sarah Mka",
      email: "SarahMka@yahoo.com",
      status: "Active",
      role: "Marketer"
    },
    {
      id: "2",
      name: "Sarah Mka",
      email: "SarahMka@yahoo.com",
      status: "Active",
      role: "Marketer"
    },
    {
      id: "3",
      name: "Sarah Mka",
      email: "SarahMka@yahoo.com",
      status: "Active",
      role: "Marketer"
    },
    {
      id: "4",
      name: "Sarah Mka",
      email: "SarahMka@yahoo.com",
      status: "Active",
      role: "Marketer"
    },
    {
      id: "5",
      name: "Sarah Mka",
      email: "SarahMka@yahoo.com",
      status: "Active",
      role: "Marketer"
    }
  ];

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0"> 
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-6 font-medium   text-[#757575] text-sm pr-8 whitespace-nowrap">
                  User
                </th>
                <th className="pb-6 font-medium   text-[#757575] text-sm pr-8 whitespace-nowrap">
                  Email
                </th>
                <th className="pb-6 font-medium   text-[#757575] text-sm pr-8 whitespace-nowrap">
                  Status
                </th>
                <th className="pb-6 font-medium   text-[#757575] text-sm pr-8 whitespace-nowrap">
                  Role
                </th>
                <th className="pb-6 font-medium   text-[#757575] text-sm whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user.id} className="">
                  <td className="py-4 font-normal   text-dark text-sm whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="py-4 font-normal   text-dark text-sm whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="py-4 font-normal   text-dark text-sm whitespace-nowrap">
                    {user.status}
                  </td>
                  <td className="py-4 font-normal   text-dark text-sm whitespace-nowrap">
                    <div className="flex items-center">
                      {user.role}
                      <span className="ml-2"> <FaCaretDown  className="w-4 h-4"/></span>
                     
                    
                    </div>
                  </td>
                  <td className="py-4 font-normal   text-dark text-sm whitespace-nowrap">
                    <button className="text-red-500">
                       <img src="mingcute_delete-fill.svg"  className="w-5 h-5" />
                 
                   
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full mt-4">
        <Pagination />
      </div>
    </>
  );
}