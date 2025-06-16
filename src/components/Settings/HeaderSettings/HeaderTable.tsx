import { useState } from "react";
import {
  IoArrowDown,
  IoChevronBack,
  IoChevronForward,
  IoCopy,
  IoPencil,
  IoTrash,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ReusableTable } from "../../Tables/Table_one";

type HeaderItem = {
  id: number;
  slug: string;
  header: string;
  name: string;
  description: string;
  image: string;
  action_link: string;
  list_description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const mockData: HeaderItem[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  slug: "about-us",
  header: "Who we are",
  name: "About Us",
  description: "Adron Homes has a vision to be the leading PAN AFR..",
  image: "https://adron.microf10.sg-host.com/seed-images/adron...",
  action_link: "https://adrons.com/about",
  list_description: null,
  created_at: null,
  updated_at: null,
}));

export default function HeaderTable() {
  const [data] = useState<HeaderItem[]>(mockData);
  const [page] = useState(1);
  const navigate = useNavigate();

  return (
    <ReusableTable activeTab="Headers" tabs={["Headers"]}>
      <div className="overflow-x-auto bg-white pb-[20px]">
        <table className="text-sm text-left">
          <thead className="text-gray-600">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Header</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Action_link</th>
              <th className="px-4 py-2">List_description</th>
              <th className="px-4 py-2">Created_at</th>
              <th className="px-4 py-2">Updated_at</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-b-gray-100 hover:bg-gray-50 transition duration-150 text-xs"
              >
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.slug}</td>
                <td className="px-4 py-2">{row.header}</td>
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2 truncate max-w-[150px]">
                  {row.description}
                </td>
                <td className="px-4 py-2 truncate max-w-[150px]">
                  {row.image}
                </td>
                <td className="px-4 py-2 truncate max-w-[150px]">
                  {row.action_link}
                </td>
                <td className="px-4 py-2">{row.list_description ?? "Null"}</td>
                <td className="px-4 py-2">{row.created_at ?? "Null"}</td>
                <td className="px-4 py-2">{row.updated_at ?? "Null"}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <IoPencil
                    className="w-4 h-4 text-gray-600 cursor-pointer"
                    onClick={() => navigate(`edit/${row.id}`)}
                  />
                  <IoCopy className="w-4 h-4 text-gray-600 cursor-pointer" />
                  <IoTrash className="w-4 h-4 text-red-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReusableTable>
    // <div className="p-6 max-w-full bg-white rounded-4xl">
    //   <div className="flex justify-between items-center mb-4">
    //     <h2 className="text-lg font-semibold">Headers</h2>
    //     <input
    //       type="text"
    //       placeholder="Search Payment"
    //       className="bg-adron-gray rounded-full px-3 py-2 w-1/3"
    //     />
    //     <button className="border px-4 py-2 rounded-full text-sm flex items-center gap-1">
    //       Newest <IoArrowDown />
    //     </button>
    //   </div>

    //   <div className="overflow-x-auto bg-white">
    //     <table className="text-sm text-left">
    //       <thead className="text-gray-600">
    //         <tr>
    //           <th className="px-4 py-2">ID</th>
    //           <th className="px-4 py-2">Slug</th>
    //           <th className="px-4 py-2">Header</th>
    //           <th className="px-4 py-2">Name</th>
    //           <th className="px-4 py-2">Description</th>
    //           <th className="px-4 py-2">Image</th>
    //           <th className="px-4 py-2">Action_link</th>
    //           <th className="px-4 py-2">List_description</th>
    //           <th className="px-4 py-2">Created_at</th>
    //           <th className="px-4 py-2">Updated_at</th>
    //           <th className="px-4 py-2">Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {data.map((row) => (
    //           <tr
    //             key={row.id}
    //             className="border-b border-b-gray-100 hover:bg-gray-50 transition duration-150 text-xs"
    //           >
    //             <td className="px-4 py-2">{row.id}</td>
    //             <td className="px-4 py-2">{row.slug}</td>
    //             <td className="px-4 py-2">{row.header}</td>
    //             <td className="px-4 py-2">{row.name}</td>
    //             <td className="px-4 py-2 truncate max-w-[150px]">
    //               {row.description}
    //             </td>
    //             <td className="px-4 py-2 truncate max-w-[150px]">
    //               {row.image}
    //             </td>
    //             <td className="px-4 py-2 truncate max-w-[150px]">
    //               {row.action_link}
    //             </td>
    //             <td className="px-4 py-2">{row.list_description ?? "Null"}</td>
    //             <td className="px-4 py-2">{row.created_at ?? "Null"}</td>
    //             <td className="px-4 py-2">{row.updated_at ?? "Null"}</td>
    //             <td className="px-4 py-2 flex space-x-2">
    //               <IoPencil
    //                 className="w-4 h-4 text-gray-600 cursor-pointer"
    //                 onClick={() => navigate(`edit/${row.id}`)}
    //               />
    //               <IoCopy className="w-4 h-4 text-gray-600 cursor-pointer" />
    //               <IoTrash className="w-4 h-4 text-red-600 cursor-pointer" />
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>

    //   {/* Pagination */}
    // </div>
  );
}
