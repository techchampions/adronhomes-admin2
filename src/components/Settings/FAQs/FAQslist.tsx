import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetFAQs,
  useGetSocials,
  useGetTestimonials,
} from "../../../utils/hooks/query";
import { formatDate } from "../../../utils/formatdate";
import { FiEdit } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
import SmallLoader from "../../SmallLoader";
import NotFound from "../../NotFound";
import Button from "../../input/Button";
import { IoAdd } from "react-icons/io5";
import { Testimonial } from "../../../pages/Properties/types/TestimonialTypes";
import { FAQItem } from "../../../pages/Properties/types/FAQsTypes";
import CreateFAQs from "./CreateFAQ";
import EditFAQs from "./EditFAQ";
import DeleteFAQ from "./DeleteFAQ";

const tabs = ["All", "Approved", "Pending"] as const;
type Tab = (typeof tabs)[number];

const FAQList: React.FC = () => {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useGetFAQs();
  const faqs = data?.data || [];
  const [showEditModal, setshowEditModal] = useState(false);
  const [showCreateModal, setshowCreateModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [faqsItem, setFaqItem] = useState<FAQItem>();

  const renderList = () => {
    return (
      <ul className="space-y-2">
        {faqs.map((item, index) => (
          <li
            key={index}
            className={`p-2 cursor-pointer rounded-lg gap-2 text-gray-600 even:bg-gray-50 flex justify-between items-center`}
          >
            <div className="flex-1 min-w-0 text-left overflow-hidden">
              {" "}
              {/* Added min-w-0 and overflow-hidden */}
              <p className="font-medium text-xs md:text-sm truncate">
                {" "}
                {/* Removed w-full as it's not needed */}
                {item.question}
              </p>
              <p className="text-xs truncate hover:underline underline-offset-2">
                {item.answer}
              </p>{" "}
              {/* Added truncate for category too */}
            </div>
            <div className="text-right h-full flex flex-col justify-between gap-1 text-xs">
              <div className="">{formatDate(item.updated_at)}</div>
              <div className="flex gap-2 justify-end">
                <div
                  className="flex gap-1 items-center text-blue-300"
                  onClick={() => {
                    setFaqItem(item);
                    setshowEditModal(true);
                  }}
                >
                  <FiEdit size={15} />
                </div>
                <div
                  className="flex gap-1 items-center text-red-300"
                  onClick={() => {
                    setFaqItem(item);
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

    if (faqs.length === 0) {
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
      <EditFAQs
        isOpen={showEditModal}
        onClose={() => setshowEditModal(false)}
        faqItem={faqsItem}
      />

      <DeleteFAQ
        isOpen={showDeleteModal}
        onClose={() => setshowDeleteModal(false)}
        faqItem={faqsItem}
      />

      <CreateFAQs
        isOpen={showCreateModal}
        onClose={() => setshowCreateModal(false)}
      />
      <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-6 px-4">
        <h4 className="text-xl text-left text-gray-800 font-bold">
          Frequenty Asked Questions
        </h4>
        <Button
          label="New Question"
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

export default FAQList;
