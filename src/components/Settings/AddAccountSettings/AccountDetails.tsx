import React, { useContext, useState } from "react";
import Header from "../../../general/Header";
import Button from "../../input/Button";
import { IoPencil, IoTrash } from "react-icons/io5";
import { PropertyContext } from "../../../MyContext/MyContext";
import AddAccount from "./AddAccount";
import { useGetAccounts } from "../../../utils/hooks/query";
import LoadingAnimations from "../../LoadingAnimations";
import NotFound from "../../NotFound";
import EditAccount from "./EditAccount";
import { AccountDetail } from "../../../pages/Properties/types/AccountDetailsTypes";
import DeleteAccount from "./DeleteAccount";

const AccountDetails = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [account, setAccount] = useState<AccountDetail>();
  const { setIsCancelState } = useContext(PropertyContext)!;
  const { data, isLoading, isError } = useGetAccounts();
  const accounts = data?.data || [];

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
          buttonText={ `Add Account`}
        />
        <AddAccount
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
        <EditAccount
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          account={account}
        />
        <DeleteAccount
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          accountId={account?.id}
        />
        <div className="p-8">
          <div className="bg-white p-6 rounded-4xl">
            <div className="flex flex-col p-2 gap-5">
              <h2 className="font-bold">Account details</h2>
              <div className="">
                {isLoading ? (
                  <LoadingAnimations loading={isLoading} />
                ) : isError ? (
                  <NotFound text="Oops... unable to retrieve accounts" />
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {accounts.map((account, index) => (
                      <div
                        key={index}
                        className=" hover:bg-gray-100 border cursor-pointer border-gray-100 rounded-2xl p-4 flex flex-col gap-3"
                      >
                        <div className="text-xs text-center">
                          Bank Details for{" "}
                          <span className="font-bold">{account.type}</span>{" "}
                          Payments
                        </div>
                        <div className="">
                          <div className="text-sm">{account.account_name}</div>
                          <div className="text-xs text-gray-500">
                            Account Name
                          </div>
                        </div>
                        <div className="">
                          <div className="text-sm">
                            {account.account_number}
                          </div>
                          <div className="text-xs text-gray-500">
                            Account Number
                          </div>
                        </div>
                        <div className="">
                          <div className="text-sm">{account.bank_name}</div>
                          <div className="text-xs text-gray-500">Bank</div>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => {
                              setAccount(account);
                              setShowEditModal(true);
                            }}
                            label="Edit"
                            icon={<IoPencil />}
                            className="!bg-transparent !text-adron-green text-sm"
                          />
                          <Button
                            label="Delete"
                            icon={<IoTrash />}
                            className="!text-red-700 !bg-transparent text-sm"
                            onClick={() => {
                              setAccount(account);
                              setShowDeleteModal(true);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {accounts.length < 4 && (
                <Button
                  label="Add Account"
                  className="!w-fit px-8 !bg-black mt-10"
                  onClick={() => setShowAddModal(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
