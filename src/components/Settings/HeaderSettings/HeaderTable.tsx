import { useState } from "react";
import { IoCopy, IoPencil, IoTrash } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ReusableTable } from "../../Tables/Table_one";
import { useGetHeaders } from "../../../utils/hooks/query";
import LoadingAnimations from "../../LoadingAnimations";
import EditHeaderDetails from "./EditHeaderDetails";
import { HeaderItem } from "../../../pages/Properties/types/HeaderDataTypes";

export default function HeaderTable() {
  const { data, isError, isLoading } = useGetHeaders();
  const headers = data?.data.data || [];
  const [page] = useState(1);
  const navigate = useNavigate();
  const [editModal, setEditModal] = useState(false);
  const [headerItem, setHeaderItem] = useState<HeaderItem>();

  return (
    <ReusableTable activeTab="Headers" tabs={["Headers"]}>
      <EditHeaderDetails
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        headerDetails={headerItem}
      />
      {isLoading ? (
        <LoadingAnimations loading={isLoading} />
      ) : (
        <div className="overflow-x-auto bg-white pb-[20px]">
          <table className="text-sm text-left">
            <thead className="text-gray-600">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Header</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Action_link</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {headers.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-b-gray-100 hover:bg-gray-50 transition duration-150 text-xs"
                >
                  <td className="px-4 py-2 max-w-[150px] truncate">{row.id}</td>
                  <td className="px-4 py-2 max-w-[150px] truncate">
                    {row.header}
                  </td>
                  <td className="px-4 py-2 max-w-[150px] truncate">
                    {row.name}
                  </td>
                  <td className="px-4 py-2 truncate max-w-[300px]">
                    {row.description || "Empty"}
                  </td>
                  <td className="px-4 py-2 truncate max-w-[150px]">
                    {row.action_link}
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    <IoPencil
                      className="w-4 h-4 text-gray-600 cursor-pointer"
                      onClick={() => {
                        setEditModal(true);
                        setHeaderItem(row);
                      }}
                    />
                    <IoCopy className="w-4 h-4 text-gray-600 cursor-pointer" />
                    <IoTrash className="w-4 h-4 text-red-600 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ReusableTable>
  );
}
