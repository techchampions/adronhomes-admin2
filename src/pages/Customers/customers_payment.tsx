import React, { useEffect, useState } from "react";
import ProfileCard from "../../general/SmallProfileCard";
import { RiFolderCheckFill } from "react-icons/ri";
import PaymentListCard from "../../general/PaymentListCard";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import Pagination from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useParams } from "react-router-dom";
import {
  clearUserPropertyPlan,
  fetchUserPropertyPlan,
} from "../../components/Redux/Marketer/user_property_plan";
import PaymentModal, { PaymentStatus } from "../../pages/Customers/PaymentList";
import { fetchPropertyPlanPayments } from "../../components/Redux/Marketer/PaymentList";
import { PaymentCard } from "../../pages/Customers/PaymentTable";
import LoadingAnimations from "../../components/LoadingAnimations";
import InvoiceCard from "../../general/invioceCardTwo";
// import { PropertyDocumentsModal } from "./PropertyDocumentsModal";
import { toast } from "react-toastify";
import createContractDocuments, {
  createContractDocumentsThunk,
} from "../../components/Redux/UpdateContract/createContractDocuments";
import { getContract } from "../../components/Redux/UpdateContract/viewcontractFormDetails";
// import { ContractModal } from "./ContractFormModal";
// import { ContractDocumentsModal } from "./ContractDocumentsModal";
// import { UserProfileCard } from "./contractProfileCard";
import { formatDate } from "../../utils/formatdate";
import { UserProfileCard } from "../contract/contractProfileCard";
import { ConfirmAllocationModal } from "../contract/confirmDocumentSubmited";
import { ContractModal } from "../contract/ContractFormModal";
import { ContractDocumentsModal } from "../contract/ContractDocumentsModal";
import { PropertyDocumentsModal } from "../contract/PropertyDocumentsModal";
// import { ConfirmAllocationModal } from "./confirmDocumentSubmited";

export default function ContractInvoice() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentListOpen, setIsPaymentListOpen] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { plan_id, user_id } = useParams<{
    plan_id: string;
    user_id: string;
  }>();

  const [showModal, setShowModal] = useState(false);
  // Get data from Redux store
  const {
    data: { planProperties, nextRepayment, transactions, contractDocuments },
    loading,
    error,
  } = useSelector((state: RootState) => state.marketerUserPropertyPlan);
  const {
    data: documents,
    loading: docLoading,
    error: errordoc,
  } = useSelector((state: RootState) => state.ViewcontractDocuments);
  // Add this near the top of your component with other state declarations
  const [hasContractDocuments, setHasContractDocuments] = useState(false);

  // Update this useEffect to check for contract documents
  useEffect(() => {
    if (contractDocuments && contractDocuments.length > 0) {
      setHasContractDocuments(true);
    } else {
      setHasContractDocuments(false);
    }
  }, [contractDocuments]);
  const {
    data,
    loading: loadingpropertyPlanPayments,
    error: ErrorpropertyPlanPayments,
  } = useSelector((state: RootState) => state.propertyPlanPayments);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (plan_id && user_id) {
      dispatch(fetchUserPropertyPlan({ planId: plan_id, userId: user_id }));
    }

    return () => {
      dispatch(clearUserPropertyPlan());
    };
  }, [dispatch, plan_id, user_id]);

  useEffect(() => {
    if (planProperties?.id) {
      dispatch(fetchPropertyPlanPayments(planProperties?.id!));
    }
  }, [dispatch, planProperties?.id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [isChecked, setIsChecked] = useState(
    planProperties?.is_allocated === 1
  );
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

  // Function to handle checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);

    if (checked) {
      setIsAllocationModalOpen(true);
    } else {
      setIsAllocationModalOpen(true);
    }
  };

  const formatTransactions = () => {
    if (!transactions) return [];

    return transactions.map((transaction) => ({
      title: transaction.description || "Property Payment",
      date: new Date(transaction.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: `₦${transaction.amount_paid?.toLocaleString() || "0"}`,
      status:
        transaction.status === 1
          ? "Completed"
          : transaction.status === 0
          ? "Pending"
          : "Failed",
      transactionData: {
        from:
          `${planProperties?.user?.first_name} ${planProperties?.user?.last_name}` ||
          "Customer",
        description: transaction.description || "Property Payment",
        type: "Property Investment",
        method: transaction.payment_type || "Bank Transfer",
        fees: "0",
        reference: transaction.reference || "N/A",
        status:
          transaction.status === 1
            ? "Completed"
            : transaction.status === 0
            ? "Pending"
            : "Failed",
        bankIcon: "/bank-icon.svg",
        property: {
          name:
            transaction.property?.name ||
            planProperties?.property?.name ||
            "Property",
          price:
            transaction.property?.price || planProperties?.property?.price || 0,
          size:
            transaction.property?.size ||
            planProperties?.property?.size ||
            "N/A",
          image:
            transaction.property?.display_image ||
            planProperties?.property?.display_image ||
            "/land.svg",
          address:
            `${transaction.property?.lga || planProperties?.property?.lga}, ${
              transaction.property?.state || planProperties?.property?.state
            }` || "N/A",
        },
        user: {
          name:
            `${planProperties?.user?.first_name} ${planProperties?.user?.last_name}` ||
            "Customer",
          email: planProperties?.user?.email || "N/A",
          phone: planProperties?.user?.phone_number || "N/A",
        },
      },
    }));
  };

  const propertyDetails = {
    name: planProperties?.property?.name || "Property",
    address:
      `${planProperties?.property?.lga || ""}, ${
        planProperties?.property?.state || ""
      }`.trim() || "Address not available",
    size: planProperties?.property?.size || "N/A",
    display_image: planProperties?.property?.display_image || "/land.svg",
    features: planProperties?.property?.features || [],
  };
  const { loading: documentUploadLoading } = useSelector(
    (state: RootState) => state.contractDocuments
  );

  const handleSubmit = async (values: {
    documents: Array<{ plan_id: number; document_file: File | string }>;
    removedDocuments?: number[];
  }) => {
    if (!plan_id) {
      toast.error("Plan ID is missing");
      return;
    }

    try {
      const filesToUpload = values.documents
        .filter((doc) => doc.document_file instanceof File)
        .map((file) => ({
          plan_id: Number(plan_id),
          document_file: file.document_file as File,
        }));

      if (hasContractDocuments && values.removedDocuments) {
        console.log("Removed documents:", values.removedDocuments);
      }

      const payload = {
        documents: filesToUpload,
        ...(hasContractDocuments && {
          removedDocuments: values.removedDocuments,
        }),
      };

      const resultAction = await dispatch(
        createContractDocumentsThunk(payload)
      );

      if (createContractDocumentsThunk.fulfilled.match(resultAction)) {
        setShowModal(false);
        dispatch(fetchUserPropertyPlan({ planId: plan_id, userId: user_id }));
        toast.success(
          hasContractDocuments
            ? "Documents updated successfully!"
            : "Documents uploaded successfully!"
        );
      }
    } catch (error) {
      console.error("Document upload failed:", error);
      toast.error("Failed to process documents");
    }
  };
  const [showContractModal, setShowContractModal] = useState(false);
  const { contract, loading: contractLoading } = useSelector(
    (state: RootState) => state.contractForm
  );
  useEffect(() => {
    if (planProperties?.contract_id) {
      dispatch(getContract(planProperties.contract_id));
    }
  }, [planProperties?.contract_id, dispatch]);

  // Calculate pagination
  const paginatedPayments = formatTransactions().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pagination = {
    currentPage,
    totalPages: Math.ceil(formatTransactions().length / itemsPerPage),
    itemsPerPage,
    totalItems: formatTransactions().length,
  };

  const tabs = ["All", "Completed", "Pending", "Failed"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-center ">
        <LoadingAnimations loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-center text-red-500">
        Error: {error}
      </div>
    );
  }
  if (!planProperties)
    return (
      <div className="flex items-center justify-center h-screen text-center ">
        No data found
      </div>
    );

  return (
    <>
      <div className="relative w-full pb-[30px]">
        {/* <button className='absolute lg:top-32 md:top-56 top-48 lg:right-20 right-9 text-xs border-2 border-[#79B833] p-2 rounded-full text-[#79B833] font-bold' onClick={() => setShowContractModal(true)} >
          View Purchase Form
        </button> */}
        <Header
          viewForm={true}
          title="Contracts"
          subtitle="Manage contracts for property bought by user"
          history={true}
          buttonText={"Upload Document"}
          onButtonClick={() => setShowModal(true)}
          showSearchAndButton={planProperties.status === 2 ? true : false}
          handleViewPurchaseFormClick={() => setShowContractModal(true)}
        />
      </div>
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] space-y-[30px] pb-[52px]">
        <div className="flex items-center  mb-6">
          {/* Custom Checkbox */}
          <input
            type="checkbox"
            id="confirmCheckbox"
            className="
                            mr-3
                            appearance-none inline-block w-6 h-6 border-2 border-gray-300 rounded-md
                            relative cursor-pointer outline-none transition-colors duration-200 ease-in-out
                            checked:bg-[#79B833] checked:border-[#79B833]
                            after:content-['✔'] after:text-white after:text-base after:absolute
                            after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                            after:block
                        "
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <div className="flex flex-col">
            <label
              htmlFor="confirmCheckbox"
              className="text-lg text-gray-700 select-none cursor-pointer"
            >
              I confirm that i have uploaded all required documents
            </label>
            <p className="text-xs italic">
              This confirms that all the required documents have been uploaded and that the property will be allocated to the customer. Please ensure the documents have been properly reviewed.
            </p>
          </div>
        </div>

        <UserProfileCard
          name={contract?.contract_subscriber_name_1}
          joinDate={formatDate(contract?.created_at)}
          documentLinkText="list of Documents"
          viewActionText="Click to view"
          hasContractDocuments={hasContractDocuments}
          openDoc={() => setShowDocumentsModal(true)}
          name2={contract?.contract_subscriber_name_2}
          marketer={contract?.contract_main_marketer ?? "N/A"}
          businestype={contract?.contract_business_type ?? "N/A"}
          jointType={contract?.contract_business_type === "Joint"}
        />
        {/* {hasContractDocuments && ( */}
        {/* <div className="relative">
            <div
              className="absolute top-6 right-6 font-[350] text-[#79B833] md:flex items-center hidden"
              onClick={() => setShowDocumentsModal(true)}
            >
              <RiFolderCheckFill size={20} className="mr-2" />
              list of Documents
            </div>
            <div className="absolute top-16 right-6 font-[350] items-center md:flex hidden">
              Click to view
            </div>
            <div className="absolute top-6 right-6 font-[350] items-center md:hidden flex">
              view Documents
            </div>
            <ProfileCard
              imageUrl={planProperties.user?.profile_picture || "/unknown.png"}
              name={`${planProperties.user?.first_name} ${planProperties.user?.last_name}`}
              dateJoined={new Date(
                planProperties.user?.created_at
              ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              customerId={planProperties.user?.referral_code}
            />
          </div> */}
        {/* )} */}

        <InvoiceCard
          other={
            planProperties.other_amount > 0
              ? {
                  percentage: planProperties.other_percentage,
                  amount: planProperties.other_amount,
                  remainingBalance: planProperties.remaining_other_balance,
                  paidAmount: planProperties.paid_other_amount,
                }
              : undefined
          }
          invoiceAmount={`₦${planProperties.paid_amount?.toLocaleString()}`}
          paidAmount={`₦${planProperties.total_amount?.toLocaleString()}`}
          paymentSchedule={planProperties?.repayment_schedule}
          progressPercentage={
            planProperties.payment_percentage ??
            (planProperties.paid_amount / planProperties.total_amount) * 100
          }
          duration={`${planProperties.monthly_duration} Months`}
          nextPaymentDate={
            planProperties.next_payment_date
              ? new Date(planProperties.next_payment_date).toLocaleDateString()
              : "N/A"
          }
          dueDate={
            nextRepayment?.due_date
              ? new Date(nextRepayment.due_date).toLocaleDateString()
              : "N/A"
          }
          property={{
            name: planProperties.property?.name || "Property",
            address: `${planProperties.property?.lga}, ${planProperties.property?.state}`,
            image: planProperties.property?.display_image || "/land.svg",
            size: planProperties.property?.size || "N/A",
            features: planProperties.property?.features || [],
            type: getPropertyType(planProperties.property_type),
          }}
          infrastructure={
            planProperties.infrastructure_amount > 0
              ? {
                  percentage: planProperties.infrastructure_percentage,
                  amount: planProperties.infrastructure_amount,
                  remainingBalance:
                    planProperties.remaining_infrastructure_balance,
                  paidAmount: planProperties.paid_infrastructure_amount,
                }
              : undefined
          }
          number_of_unit={planProperties.number_of_unit}
        />

        <PaymentListCard
          title="Payment Schedule"
          description="View all upcoming payments for your property plan."
          buttonText="Show Payments"
          onButtonClick={() => setIsModalOpen(true)}
        />

        <p className="md:text-[20px] font-[325] text-base text-dark">
          Payments
        </p>

        <ReusableTable activeTab={"All"} tabs={tabs}>
          <div className="w-full overflow-x-auto">
            <div className="space-y-[10px]">
              {paginatedPayments.map((payment, index) => (
                <PaymentCard
                  key={index}
                  index={index}
                  title={payment.title}
                  date={payment.date}
                  amount={payment.amount}
                  status={payment.status as "Completed" | "Pending" | "Failed"}
                  transactionData={payment.transactionData}
                />
              ))}
            </div>
          </div>
        </ReusableTable>

        {isModalOpen && data && (
          <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="rounded-lg sm:rounded-[30px] bg-white p-3 sm:p-6 w-full max-w-full min-w-0 md:min-w-[800px] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold">
                  Payment Schedule
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#767676] hover:text-dark text-sm sm:text-base"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2 sm:space-y-4">
                {data?.map((item, index) => {
                  const status = statusMap[item.status];
                  const style = statusStyles[status];
                  const bgColor = index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]";

                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg sm:rounded-[30px] ${bgColor} p-3 sm:p-6`}
                    >
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full items-center">
                        <div className="min-w-0 col-span-1 xs:col-span-2 sm:col-span-1">
                          <p className="text-sm sm:text-base font-[325] text-dark truncate">
                            Payment {item.property?.name || "Property"}
                          </p>
                          <p className="font-[400] text-xs sm:text-sm text-[#767676] truncate">
                            Payment #{item.id}
                          </p>
                        </div>

                        <div className="flex justify-start sm:justify-center col-span-1">
                          <button
                            className={`text-xs sm:text-sm font-[400] ${style.text} ${style.bg} border ${style.border} py-2 sm:py-[11px] rounded-[20px] sm:rounded-[30px] px-3 sm:px-6 whitespace-nowrap`}
                          >
                            {status}
                          </button>
                        </div>

                        <p className="text-dark font-bold text-sm sm:text-base text-left sm:text-right col-span-1 truncate">
                          ₦{item.amount.toLocaleString()}
                        </p>

                        <div className="flex justify-start sm:justify-end col-span-1">
                          {status === "Rejected" ? (
                            <button className="text-xs sm:text-sm font-[400] text-white bg-[#272727] py-2 sm:py-[11px] rounded-[20px] sm:rounded-[30px] px-3 sm:px-6 whitespace-nowrap">
                              Mark Paid
                            </button>
                          ) : (
                            <button
                              onClick={() => {}}
                              className="text-xs sm:text-sm font-[400] text-[#767676] bg-transparent py-2 sm:py-[11px] rounded-[20px] sm:rounded-[30px] px-3 sm:px-6 whitespace-nowrap hover:bg-[#EAEAEA]"
                            >
                              {new Date(item.due_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <>
        {isAllocationModalOpen && (
          <ConfirmAllocationModal
            onCancel={() => setIsAllocationModalOpen(false)}
            plan_id={plan_id}
            user_id={user_id}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
          />
        )}
        {showContractModal && (
          <ContractModal
            contract={contract}
            onClose={() => setShowContractModal(false)}
          />
        )}
        {showDocumentsModal && hasContractDocuments && (
          <ContractDocumentsModal
            onClose={() => setShowDocumentsModal(false)}
            plan_id={plan_id}
            user_id={user_id}
          />
        )}
        {showModal && (
          <PropertyDocumentsModal
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmit}
            propertyDetails={propertyDetails}
            isLoading={documentUploadLoading}
            isEditMode={hasContractDocuments}
          />
        )}
      </>
    </>
  );
}

function getPropertyType(type: number): string {
  switch (type) {
    case 1:
      return "Apartment";
    case 2:
      return "House";
    case 3:
      return "Land";
    default:
      return "Property";
  }
}

const statusMap: Record<number, PaymentStatus> = {
  0: "Pending",
  1: "Completed",
  2: "Rejected",
};

const statusStyles: Record<
  PaymentStatus,
  { text: string; bg: string; border: string }
> = {
  Completed: {
    text: "text-[#2E9B2E]",
    bg: "bg-[#ECFFEC]",
    border: "border-[#2E9B2E]",
  },
  Pending: {
    text: "text-[#767676]",
    bg: "bg-[#EAEAEA]",
    border: "border-[#767676]",
  },
  Rejected: {
    text: "text-[#D70E0E]",
    bg: "bg-white",
    border: "border-[#D70E0E]",
  },
};
