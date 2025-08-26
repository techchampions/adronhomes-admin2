import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetTestimonials } from "../../../utils/hooks/query";
import { formatDate } from "../../../utils/formatdate";
import { FiEdit } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
import SmallLoader from "../../SmallLoader";
import NotFound from "../../NotFound";
import Button from "../../input/Button";
import { IoAdd } from "react-icons/io5";
import EditTestimonial from "./EditTestimonial";
import { Testimonial } from "../../../pages/Properties/types/TestimonialTypes";
import CreateTestimony from "./CreateTestimony";
import DeleteTestimonial from "./DeleteTestimony";
import { FaYoutube } from "react-icons/fa";
import { PiImageBrokenDuotone } from "react-icons/pi";

const tabs = ["All", "Approved", "Pending"] as const;
type Tab = (typeof tabs)[number];

const TestimonialList: React.FC = () => {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useGetTestimonials();
  const testimonials = data?.data.data || [];
  const [showEditModal, setshowEditModal] = useState(false);
  const [showCreateModal, setshowCreateModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [client, setclient] = useState<Testimonial>();

  const renderList = () => {
    return (
      <ul className="space-y-2">
        {testimonials.map((item, index) => (
          <li
            key={index}
            className={`p-2 cursor-pointer rounded-lg gap-2 text-gray-600 even:bg-gray-50 flex justify-between items-center`}
          >
            <div
              className="h-10 min-w-10 max-w-10 relative rounded-md overflow-hidden
            "
            >
              {/* <div className="bg-black/20 absolute inset-0"></div> */}
              {item.video_link ? (
                <FaYoutube className="h-full w-full" />
              ) : (
                <PiImageBrokenDuotone className="h-full w-full" />
              )}
            </div>
            <div
              className="h-10 min-w-10 max-w-10 relative rounded-md overflow-hidden
            "
            >
              <div className="bg-black/20 absolute inset-0"></div>
              <img
                src={item.client_image}
                alt={item.client_name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0 text-left overflow-hidden">
              {" "}
              {/* Added min-w-0 and overflow-hidden */}
              <p className="font-medium text-xs md:text-sm truncate">
                {" "}
                {/* Removed w-full as it's not needed */}
                {item.client_name}
              </p>
              <p className="text-xs truncate hover:underline underline-offset-2">
                {item.client_comment}
              </p>{" "}
              {/* Added truncate for category too */}
            </div>
            <div className="text-right h-full flex flex-col justify-between gap-1 text-xs">
              <div className="">{formatDate(item.updated_at)}</div>
              <div className="flex gap-2 justify-end">
                <div
                  className="flex gap-1 items-center text-blue-300"
                  onClick={() => {
                    setclient(item);
                    setshowEditModal(true);
                  }}
                >
                  <FiEdit size={15} />
                </div>
                <div
                  className="flex gap-1 items-center text-red-300"
                  onClick={() => {
                    setclient(item);
                    setshowDeleteModal(true);
                  }}
                >
                  <BiTrash size={15} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <SmallLoader />;
    }

    if (isError) {
      return (
        <div className="text-center py-4">
          <NotFound />
        </div>
      );
    }

    if (testimonials.length === 0) {
      return (
        <div className="text-center py-4">
          <NotFound />
        </div>
      );
    }

    return renderList();
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      <EditTestimonial
        isOpen={showEditModal}
        onClose={() => setshowEditModal(false)}
        client={client}
      />
      <DeleteTestimonial
        isOpen={showDeleteModal}
        onClose={() => setshowDeleteModal(false)}
        client={client}
      />
      <CreateTestimony
        isOpen={showCreateModal}
        onClose={() => setshowCreateModal(false)}
      />
      <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-6 px-4">
        <h4 className="text-xl text-left text-gray-800 font-bold">
          Testimonials
        </h4>
        <Button
          label="New Testimonial"
          onClick={() => setshowCreateModal(true)}
          className="!w-fit px-6 text-sm"
          icon={<IoAdd size={20} className="!text-white" />}
        />
      </div>

      {/* LIST */}
      {renderContent()}
    </div>
  );
};

export default TestimonialList;
