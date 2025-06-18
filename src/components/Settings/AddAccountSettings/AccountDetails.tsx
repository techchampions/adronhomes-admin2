import React, { useContext, useState } from "react";
import Header from "../../../general/Header";
import Button from "../../input/Button";
import { IoPencil, IoTrash } from "react-icons/io5";
import { PropertyContext } from "../../../MyContext/MyContext";
import AddAccount from "./AddAccount";

const AccountDetails = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { setIsCancelState } = useContext(PropertyContext)!;

  return (
    <div>
      {" "}
      <div className="">
        <Header
          title="Settings"
          subtitle="Manage settings"
          history={true}
          onButtonClick={() => {
            setShowAddModal(!showAddModal);
            setIsCancelState(false);
          }}
          buttonText="Add Account"
        />
        <AddAccount
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
        <div className="p-8">
          <div className="bg-white p-6 rounded-4xl">
            <div className="flex flex-col p-2 gap-5">
              <h2 className="font-bold">Account details</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="even:bg-gray-100 odd:bg-white odd:border odd:border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="">
                    <div className="text-sm">Adron Account</div>
                    <div className="text-xs text-gray-500">Account Name</div>
                  </div>
                  <div className="">
                    <div className="text-sm">839408293942</div>
                    <div className="text-xs text-gray-500">Account Number</div>
                  </div>
                  <div className="">
                    <div className="text-sm">First Bank PLC</div>
                    <div className="text-xs text-gray-500">Bank</div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowAddModal(true)}
                      label="Edit"
                      icon={<IoPencil />}
                      className="!bg-transparent !text-adron-green text-sm"
                    />
                    <Button
                      label="Delete"
                      icon={<IoTrash />}
                      className="!text-red-700 !bg-transparent text-sm"
                    />
                  </div>
                </div>
                <div className="even:bg-gray-100 odd:bg-white odd:border odd:border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="">
                    <div className="text-sm">Adron Other Fees Account</div>
                    <div className="text-xs text-gray-500">Account Name</div>
                  </div>
                  <div className="">
                    <div className="text-sm">839408293942</div>
                    <div className="text-xs text-gray-500">Account Number</div>
                  </div>
                  <div className="">
                    <div className="text-sm">First Bank PLC</div>
                    <div className="text-xs text-gray-500">Bank</div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowAddModal(true)}
                      label="Edit"
                      icon={<IoPencil />}
                      className="!bg-transparent !text-adron-green text-sm"
                    />
                    <Button
                      label="Delete"
                      icon={<IoTrash />}
                      className="!text-red-700 !bg-transparent text-sm"
                    />
                  </div>
                </div>
                <div className="even:bg-gray-100 odd:bg-white odd:border odd:border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="">
                    <div className="text-sm">Adron Infrastructure Account</div>
                    <div className="text-xs text-gray-500">Account Name</div>
                  </div>
                  <div className="">
                    <div className="text-sm">839408293942</div>
                    <div className="text-xs text-gray-500">Account Number</div>
                  </div>
                  <div className="">
                    <div className="text-sm">First Bank PLC</div>
                    <div className="text-xs text-gray-500">Bank</div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowAddModal(true)}
                      label="Edit"
                      icon={<IoPencil />}
                      className="!bg-transparent !text-adron-green text-sm"
                    />
                    <Button
                      label="Delete"
                      icon={<IoTrash />}
                      className="!text-red-700 !bg-transparent text-sm"
                    />
                  </div>
                </div>
                <div className="even:bg-gray-100 odd:bg-white odd:border odd:border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="">
                    <div className="text-sm">Adron Wallet Account</div>
                    <div className="text-xs text-gray-500">Account Name</div>
                  </div>
                  <div className="">
                    <div className="text-sm">839408293942</div>
                    <div className="text-xs text-gray-500">Account Number</div>
                  </div>
                  <div className="">
                    <div className="text-sm">First Bank PLC</div>
                    <div className="text-xs text-gray-500">Bank</div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowAddModal(true)}
                      label="Edit"
                      icon={<IoPencil />}
                      className="!bg-transparent !text-adron-green text-sm"
                    />
                    <Button
                      label="Delete"
                      icon={<IoTrash />}
                      className="!text-red-700 !bg-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
              <Button
                label="Add Account"
                className="!w-fit px-8 !bg-black mt-10"
                onClick={() => setShowAddModal(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
