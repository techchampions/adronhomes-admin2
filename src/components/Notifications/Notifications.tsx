import React, { useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../Tables/Table_one";
import Notifications_table from "./Notifications_table";
// import SendNotification from "./SendNotification";
import SelectCustomersToSendNtf from "./SelectCustomerstoSend";
import Modal from "./SendNotification";

export default function Notifications() {
  const tab = ["Notifications"];

  const [showModal, setshowModal] = useState<boolean>(false);
  return (
    <div className="pb-[52px]">
      <Header
        title="Notifications"
        subtitle="Manage notifications"
        history={true}
        buttonText="Send Notification"
        onButtonClick={() => setshowModal(true)}
      />
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setshowModal(false)} />
      )}
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          activeTab={"Notifications"}
          tabs={tab}

          searchPlaceholder="Search Notifications..."

          // sortButtonText="Latest"
        >
          <Notifications_table />{" "}
        </ReusableTable>
      </div>
    </div>
  );
}
