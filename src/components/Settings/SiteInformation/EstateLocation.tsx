import { useState } from "react";
import { useGetEstateLocations } from "../../../utils/hooks/query";
import SmallLoader from "../../SmallLoader";
import { FiEdit } from "react-icons/fi";
import EditEstate from "./EditEstate";
import { Location } from "../../../pages/Properties/types/EstateLocationTypes";

const EstateLocation = () => {
  const { data, isLoading } = useGetEstateLocations();
  const [editItem, setEditItem] = useState<Location>();
  const [showEditModal, setShowEditModal] = useState(false);
  const estateData = data?.locations || [];
  if (isLoading) {
    return <SmallLoader />;
  }

  return (
    <div className="bg-white p-6 rounded-4xl">
      <EditEstate
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={editItem}
      />
      <div className="flex flex-col gap-2 max-h-[400px] pb-6 overflow-scroll scrollbar-hide">
        <h4 className="mb-4">Edit Estates Locations Here</h4>
        <ul className="space-y-2">
          {estateData.map((item, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer rounded-lg gap-2 text-gray-600 even:bg-gray-50 flex justify-between items-center`}
            >
              <div
                className="h-10 min-w-10 max-w-10 relative rounded-md overflow-hidden
            "
              >
                <div className="bg-black/20 absolute inset-0"></div>
                <img
                  src={item.photo}
                  alt={item.state_name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0 text-left overflow-hidden">
                {" "}
                {/* Added min-w-0 and overflow-hidden */}
                <p className="font-medium text-xs md:text-sm truncate">
                  {" "}
                  {/* Removed w-full as it's not needed */}
                  {item.state_name} Estate
                </p>
                <p className="text-xs truncate hover:underline underline-offset-2">
                  {item.total_property} Estates
                </p>{" "}
                {/* Added truncate for category too */}
              </div>
              <div className="text-right h-full flex flex-col justify-between gap-1 text-xs">
                <div
                  className="flex flex-col gap-1 items-center text-blue-300"
                  onClick={() => {
                    setEditItem(item);
                    setShowEditModal(true);
                  }}
                >
                  <FiEdit size={15} />
                  <span>Edit</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EstateLocation;
