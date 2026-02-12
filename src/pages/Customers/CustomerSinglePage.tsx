    
// CustomerSinglePage.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import ProfileCard from "../../general/ProfileCard";
import TableCard, { PaginationProps } from "../../general/TableCard";
import {
  fetchCustomerById,
  setActivePlanCurrentPage,
  setCompletedPropertyCurrentPage,
  setCittaContractCurrentPage,
  selectActivePlanPagination,
  selectCompletedPropertyPagination,
  selectCittaContractPagination,
  selectCustomerActivePlans,
  selectCustomerCompletedProperties,
  selectCustomerCittaContracts,
  setUsername,
} from "../../components/Redux/customers/customerByid";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { formatDate } from "../../utils/formatdate";
import { formatAsNaira } from "../../utils/formatcurrency";
import LoadingAnimations from "../../components/LoadingAnimations";
import Modal from "./Modal";
import { ContractData } from "../../components/Redux/customers/customerByid";
import CittaContractModal from "./CittaContractModal";
import {
  selectERPContractsSuccess,
} from "../../components/Redux/Contract/erpContractsSync/erpContractsSyncSlice";

import { ERPTransaction, fetchERPContractTransactions } from "../../components/Redux/Contract/erpContractTransactions/erpContractTransactionsThunk";
import ERPSyncButton from "./ ERPSyncButton";
import ERPContractTransactionsTable from "./ERPContractTransactionsTable";
import ERPTransactionModal from "./ERPTransactionModal";

interface TableRowData {
  id: number;
  name?: string;
  location: string;
  image?: string;
  price?: string;
  amountPaid?: string;
  amountLeft?: string;
  duration?: string;
  dueDate?: string;
  Duration?: string;
  StartDate?: string;
  FinalPayment?: string;
  property?: any;
  user_id?: number;
  plan_id?: number;
  contractDetails?: string;
  customerName?: string;
  netValue?: string;
  status?: string;
  tenant?: string;
  balance?: string | number;
  contractId?: string;
  balanceDisplay?: string;
  balanceClass?: string;
  customerPhone?: string;
  amountLeftRaw?: number;
  originalContractId?: number;
}

export default function CustomerSinglePage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.customerById,
  );

  const { loading: messagingcustomerloading } = useSelector(
    (state: RootState) => state.messagingcustomer,
  );

  const { loading: loadingdelete } = useSelector(
    (state: RootState) => state.deleteUserSlice,
  );

  // Pagination states from Redux
  const activePlanPagination = useSelector(selectActivePlanPagination);
  const completedPropertyPagination = useSelector(
    selectCompletedPropertyPagination,
  );
  const cittaContractPagination = useSelector(selectCittaContractPagination);

  // Data arrays for tables (paginated data)
  const activePlansData = useSelector(selectCustomerActivePlans);
  const completedPropertiesData = useSelector(
    selectCustomerCompletedProperties,
  );
  const cittaContractsData = useSelector(selectCustomerCittaContracts);

  // State for modals
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(
    null,
  );
  const [selectedTransaction, setSelectedTransaction] = useState<ERPTransaction | null>(null);
  
  // State for ERP Transactions
  const [selectedContractForTransactions, setSelectedContractForTransactions] = useState<ContractData | null>(null);
  const [showTransactionsTable, setShowTransactionsTable] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const erpSuccess = useSelector(selectERPContractsSuccess);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<TableRowData[]>([]);
  const [modalColumns, setModalColumns] = useState<any[]>([]);
  const [modalPagination, setModalPagination] = useState<PaginationProps | null>(null);
  const [modalHandlePageChange, setModalHandlePageChange] = useState<
    ((page: number) => void) | null
  >(null);

  // Open Citta Contract modal
  const openContractModal = (contract: ContractData) => {
    setSelectedContract(contract);
    setContractModalOpen(true);
  };

  // Close Citta Contract modal
  const closeContractModal = () => {
    setContractModalOpen(false);
    setSelectedContract(null);
  };

  // Open ERP Transaction modal
  const openTransactionModal = (transaction: ERPTransaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  // Close ERP Transaction modal
  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedTransaction(null);
  };

  // Handle View ERP Transactions (opens the transactions table)
  const handleViewContractTransactions = (contract: ContractData) => {
    setSelectedContractForTransactions(contract);
    setShowTransactionsTable(true);
  };

  // Handle Close ERP Transactions table
  const handleCloseTransactions = () => {
    setShowTransactionsTable(false);
    setSelectedContractForTransactions(null);
  };

  // Listen for custom event from CittaContractModal
  useEffect(() => {
    const handleViewTransactionsEvent = (event: CustomEvent) => {
      const contractData = event.detail;
      handleViewContractTransactions(contractData);
    };

    window.addEventListener('viewContractTransactions', handleViewTransactionsEvent as EventListener);
    
    return () => {
      window.removeEventListener('viewContractTransactions', handleViewTransactionsEvent as EventListener);
    };
  }, []);

  // Handlers for pagination
  const handlePageChange = (page: number) => {
    dispatch(setActivePlanCurrentPage(page));
  };

  const handlePageChange2 = (page: number) => {
    dispatch(setCompletedPropertyCurrentPage(page));
  };

  const handlePageChange3 = (page: number) => {
    dispatch(setCittaContractCurrentPage(page));
  };

  useEffect(() => {
    if (id) {
      dispatch(
        fetchCustomerById({
          customerId: Number(id),
          activePage: activePlanPagination.currentPage,
          completedPage: completedPropertyPagination.currentPage,
          cittaContractPage: cittaContractPagination.currentPage,
        }),
      );
    }
  }, [
    dispatch,
    id,
    activePlanPagination.currentPage,
    completedPropertyPagination.currentPage,
    cittaContractPagination.currentPage,
    erpSuccess,
  ]);

  const openModal = (
    title: string,
    data: TableRowData[],
    columns: any[],
    pagination: PaginationProps,
    handlePageChangeFunc: (page: number) => void,
  ) => {
    setModalTitle(title);
    setModalData(data);
    setModalColumns(columns);
    setModalPagination(pagination);
    setModalHandlePageChange(() => handlePageChangeFunc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalData([]);
    setModalColumns([]);
    setModalPagination(null);
    setModalHandlePageChange(null);
  };

  // Data transformations
  const activePlans: TableRowData[] =
    data?.limit_active_plan.map((plan) => ({
      id: plan.id,
      name: plan.property?.name || "Unknown Property",
      location: plan.property
        ? `${plan.property.lga}, ${plan.property.state}`
        : "Unknown Location",
      price: formatAsNaira(plan.total_amount),
      amountPaid: formatAsNaira(plan.paid_amount),
      amountLeft: formatAsNaira(plan.remaining_balance),
      duration: plan.monthly_duration
        ? `${plan.monthly_duration} Months`
        : "One-time",
      dueDate: plan.end_date ? formatDate(plan.end_date) : "N/A",
      image: plan.property?.display_image || "/default-property.jpg",
      property: plan.property,
      user_id: plan.user_id,
      plan_id: plan.id,
    })) || [];

  const completedProperties: TableRowData[] =
    data?.limit_completed_property.map((item) => {
      const getDurationLabel = (type: any) => {
        if (type === "2") return "Installment Payment";
        if (type === "1") return "One-Time Payment";
        return "N/A";
      };
      return {
        id: item.id,
        name: item.property.name,
        location: `${item.property.lga}, ${item.property.state}`,
        image: item.property.display_image || "/default-property.jpg",
        price: formatAsNaira(item.property.price),
        amountPaid: formatAsNaira(item.paid_amount),
        Duration: getDurationLabel(item.payment_type),
        StartDate: item.start_date ? formatDate(item.start_date) : "N/A",
        FinalPayment: item.end_date ? formatDate(item.end_date) : "N/A",
        property: item.property,
        user_id: item.user_id,
        plan_id: item.id,
      };
    }) || [];

  // Citta Contracts data for main page (limited view)
  const cittaContracts: TableRowData[] =
    data?.citta_contract?.data?.slice(0, 5).map((contract: ContractData) => {
      const balance = parseFloat(contract.currentbalance);
      const isCredit = balance < 0;

      return {
        id: contract.id,
        contractId: contract.contractId,
        contractDetails: contract.propertyName,
        location: contract.propertyEstate,
        price: formatAsNaira(parseFloat(contract.propertyCost)),
        netValue: formatAsNaira(parseFloat(contract.propertyNetValue)),
        amountLeft: formatAsNaira(Math.abs(balance)),
        duration: `${contract.propertyTenor} months`,
        dueDate: formatDate(contract.lastPaymentDate),
        status: contract.fullPayment === "Y" ? "Full Payment" : "Installment",
        customerName: contract.customerName,
        balance: contract.currentbalance,
        balanceDisplay: `${isCredit ? "+" : balance > 0 ? "-" : ""}${formatAsNaira(Math.abs(balance))}`,
        balanceClass: isCredit
          ? "text-green-600"
          : balance > 0
            ? "text-red-600"
            : "text-gray-600",
        user_id: contract.userId,
        originalContractId: contract.id,
      };
    }) || [];

  // All data for modal views
  const activePlansAll: TableRowData[] =
    activePlansData.map((plan) => ({
      id: plan.id,
      name: plan.property?.name || "Unknown Property",
      location: plan.property
        ? `${plan.property.lga}, ${plan.property.state}`
        : "Unknown Location",
      price: formatAsNaira(plan.total_amount),
      amountPaid: formatAsNaira(plan.paid_amount),
      amountLeft: formatAsNaira(plan.remaining_balance),
      duration: plan.monthly_duration
        ? `${plan.monthly_duration} Months`
        : "One-time",
      dueDate: plan.end_date ? formatDate(plan.end_date) : "N/A",
      image: plan.property?.display_image || "/default-property.jpg",
      property: plan.property,
      user_id: plan.user_id,
      plan_id: plan.id,
    })) || [];

  const completedPropertiesAll: TableRowData[] =
    completedPropertiesData.map((item) => {
      const getDurationLabel = (type: any) => {
        if (type === "2") return "Installment Payment";
        if (type === "1") return "One-Time Payment";
        return "N/A";
      };
      return {
        id: item.id,
        name: item.property.name,
        location: `${item.property.lga}, ${item.property.state}`,
        image: item.property.display_image || "/default-property.jpg",
        price: formatAsNaira(item.property.price),
        amountPaid: formatAsNaira(item.paid_amount),
        Duration: getDurationLabel(item.payment_type),
        StartDate: item.start_date ? formatDate(item.start_date) : "N/A",
        FinalPayment: item.end_date ? formatDate(item.end_date) : "N/A",
        property: item.property,
        user_id: item.user_id,
        plan_id: item.id,
      };
    }) || [];

  // All Citta Contracts for modal view
  const cittaContractsAll: TableRowData[] =
    cittaContractsData.map((contract: ContractData) => {
      const balance = parseFloat(contract.currentbalance);
      const isCredit = balance < 0;

      return {
        id: contract.id,
        contractId: contract.contractId,
        contractDetails: contract.propertyName,
        location: contract.propertyEstate,
        price: formatAsNaira(parseFloat(contract.propertyCost)),
        netValue: formatAsNaira(parseFloat(contract.propertyNetValue)),
        amountLeft: formatAsNaira(Math.abs(balance)),
        amountLeftRaw: balance,
        duration: `${contract.propertyTenor} months`,
        dueDate: formatDate(contract.lastPaymentDate),
        status: contract.fullPayment === "Y" ? "Full Payment" : "Installment",
        customerName: contract.customerName,
        customerPhone: contract.customerPhone,
        balance: contract.currentbalance,
        balanceDisplay: `${isCredit ? "+" : balance > 0 ? "-" : ""}${formatAsNaira(Math.abs(balance))}`,
        balanceClass: isCredit
          ? "text-green-600"
          : balance > 0
            ? "text-red-600"
            : "text-gray-600",
        user_id: contract.userId,
        originalContractId: contract.id,
      };
    }) || [];

  // Columns configuration
  const activePlansColumns = [
    {
      key: "property",
      title: "Property",
      width: 220,
      render: (_: any, row: TableRowData) => (
        <div className="flex items-center w-full">
          <img
            src={row.image}
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover mr-3 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-medium text-dark truncate w-full">
              {row.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <img src="/location.svg" className="mr-1" alt="location" />
              <span className="truncate">{row.location}</span>
            </div>
          </div>
        </div>
      ),
    },
    { key: "price", title: "Price", width: 150 },
    { key: "amountPaid", title: "Amount Paid", width: 150 },
    { key: "amountLeft", title: "Amount Left", width: 150 },
    { key: "duration", title: "Duration", width: 120 },
    { key: "dueDate", title: "Due Date", width: 120 },
  ];

  const completedPropertiesColumns = [
    {
      key: "property",
      title: "Property",
      width: 220,
      render: (_: any, row: TableRowData) => (
        <div className="flex items-center w-full">
          <img
            src={row.image}
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover mr-3 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-medium text-dark truncate w-full">
              {row.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <img src="/location.svg" className="mr-1" alt="location" />
              <span className="truncate">{row.location}</span>
            </div>
          </div>
        </div>
      ),
    },
    { key: "price", title: "Price", width: 150 },
    { key: "amountPaid", title: "Amount Paid", width: 150 },
    { key: "Duration", title: "Duration", width: 150 },
    { key: "StartDate", title: "Start Date", width: 120 },
    { key: "FinalPayment", title: "Final Payment", width: 120 },
  ];

  // FULL Citta Contracts Columns with TWO buttons for modal view
  const cittaContractsColumns = [
    {
      key: "contractDetails",
      title: "Contract Details",
      width: 250,
      render: (_: any, row: TableRowData) => {
        return (
          <div>
            <div className="font-medium text-dark truncate">
              {row.contractDetails?.split("/")[0] || row.contractDetails}
            </div>
            <div className="text-sm text-gray-500 truncate mt-1">
              {row.location}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ID: {row.contractId}
            </div>
          </div>
        );
      },
    },
    {
      key: "customerName",
      title: "Customer",
      width: 180,
      render: (_: any, row: TableRowData) => {
        return (
          <div className="min-w-0">
            <div className="font-medium truncate">{row.customerName}</div>
          </div>
        );
      },
    },
    {
      key: "netValue",
      title: "Net Value",
      width: 130,
      render: (value: string) => <div className="font-medium">{value}</div>,
    },
    {
      key: "balanceDisplay",
      title: "Balance",
      width: 130,
      render: (value: string, row: TableRowData) => (
        <div className={`font-medium ${row.balanceClass || ""}`}>
          {value}
        </div>
      ),
    },
    {
      key: "duration",
      title: "Tenor",
      width: 100,
    },
    {
      key: "dueDate",
      title: "Due Date",
      width: 120,
    },
    {
      key: "status",
      title: "Status",
      width: 120,
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Full Payment"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: 200,
      render: (_: any, row: TableRowData) => {
        const originalContract = cittaContractsData.find(
          (c: ContractData) =>
            c.id === row.id || c.id === row.originalContractId,
        );

        const handleViewCittaDetails = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (originalContract) {
            openContractModal(originalContract);
          }
        };

        const handleViewERPTransactions = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (originalContract) {
            handleViewContractTransactions(originalContract);
          }
        };

        return (
          <div className="flex gap-2 overflow-auto">
            <button
              onClick={handleViewCittaDetails}
              className="px-3 py-1.5 text-[10px] bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-medium flex items-center gap-1"
              title="View Citta Contract Details"
            >
              <span>📄</span>
              <span>Citta Details</span>
            </button>
            <button
              onClick={handleViewERPTransactions}
              className="px-3 py-1.5 text-xs bg-[#79B833] text-white rounded-full hover:bg-[#67a02a] transition-colors font-medium flex items-center gap-1"
              title="View ERP Transactions"
            >
              <span>📋</span>
              <span>ERP Transactions</span>
            </button>
          </div>
        );
      },
    },
  ];

  // SIMPLIFIED Citta Contracts Columns for main page with TWO buttons
  const cittaContractsColumnsSimple = [
    {
      key: "contractDetails",
      title: "Contract",
      width: 250,
      render: (_: any, row: TableRowData) => {
        return (
          <div>
            <div className="font-medium text-dark truncate">
              {row.contractDetails?.split("/")[0] || row.contractDetails}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ID: {row.contractId}
            </div>
          </div>
        );
      },
    },
    {
      key: "netValue",
      title: "Amount",
      width: 130,
      render: (value: string) => <div className="font-medium">{value}</div>,
    },
    {
      key: "balanceDisplay",
      title: "Balance",
      width: 130,
      render: (value: string, row: TableRowData) => (
        <div className={`font-medium ${row.balanceClass || ""}`}>
          {value}
        </div>
      ),
    },
    {
      key: "duration",
      title: "Tenor",
      width: 100,
    },
    {
      key: "dueDate",
      title: "Due Date",
      width: 120,
    },
    {
      key: "actions",
      title: "Actions",
      width: 200,
      render: (_: any, row: TableRowData) => {
        const originalContract = cittaContractsData.find(
          (c: ContractData) =>
            c.id === row.id || c.id === row.originalContractId,
        );

        const handleViewCittaDetails = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (originalContract) {
            openContractModal(originalContract);
          }
        };

        const handleViewERPTransactions = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (originalContract) {
            handleViewContractTransactions(originalContract);
          }
        };

        return (
          <div className="flex gap-2 overflow-auto">
            <button
              onClick={handleViewCittaDetails}
              className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-medium flex items-center gap-1"
              title="View Citta Contract Details"
            >
              <span>📄</span>
              <span>Citta 

                details
              </span>
            </button>
            <button
              onClick={handleViewERPTransactions}
              className="px-3 py-1.5 text-xs bg-[#79B833] text-white rounded-full hover:bg-[#67a02a] transition-colors font-medium flex items-center gap-1"
              title="View ERP Transactions"
            >
              <span>📋</span>
              <span>ERP TRNX</span>
            </button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <LoadingAnimations loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-8">No client data found</div>;
  }

  return (
    <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] space-y-[30px] pb-[52px]">
      <Header
        history={true}
        title="Client"
        subtitle="Manage the list of registered clients"
        showSearchAndButton={false}
      />

      <div className="grid md:grid-cols-2 gap-[20px]">
        <div className="w-full relative">
          <button
            className="absolute z-50 right-5 top-5 text-xs font-semibold text-white py-1 px-2 rounded-full border"
            onClick={() => {
              const path = location.pathname;
              const basePath = path.startsWith("/payments/customers")
                ? "/payments/customers/payment/"
                : path.startsWith("/client/customers")
                  ? "/client/customers/payment"
                  : "/customers/payment";

              navigate(`${basePath}/${id}`);
              if (data?.customer) {
                const fullName =
                  `${data.customer.first_name} ${data.customer.last_name}`.trim();
                dispatch(setUsername(fullName || "Unknown Customer"));
              }
            }}
          >
            View property payments
          </button>
          <MatrixCardGreen
            title="Total Amount Paid"
            value={formatAsNaira(parseInt(data.total_paid))}
            change="Includes total amount paid by this client"
          />
        </div>

        <div className="w-full relative">
          <button
            className="absolute z-50 right-5 top-5 text-xs font-semibold py-1 px-2 rounded-full border"
            onClick={() => {
              const path = location.pathname;
              const basePath = path.startsWith("/payments/customers")
                ? "/payments/customers/transactions"
                : path.startsWith("/client/customers")
                  ? "/client/customers/transactions"
                  : "/customers/transactions";
              if (data?.customer) {
                const fullName =
                  `${data.customer.first_name} ${data.customer.last_name}`.trim();
                dispatch(setUsername(fullName || "Unknown Customer"));
              }
              navigate(`${basePath}/${id}`);
            }}
          >
            view Wallet Trnx
          </button>
          <MatrixCard
            title="Total Wallet Balance"
            value={formatAsNaira(data?.wallet_amount?.account_balance) ?? "N/A"}
            change="Includes total wallet balance of this client"
          />
        </div>
        <MatrixCard
          title="Total Pending Payments"
          value={formatAsNaira(data.pending_paid)}
          change="Includes total pending payments of this client"
        />
        <MatrixCard
          title="Total Active Properties"
          value={data.active_property.toString()}
          change="Includes all active property plans of this client"
        />
      </div>

      {data.citta_contract?.total > 0 && (
        <MatrixCard
          title="Citta Contracts"
          value={data.citta_contract.total.toString()}
          change={`Total property purchase contracts`}
        />
      )}

      <ProfileCard
        profileImage={data.customer.profile_picture || "/unknown.png"}
        name={`${data.customer.first_name} ${data.customer.last_name}`}
        dateJoined={formatDate(data.customer.created_at)}
        email={data.customer.email}
        phone={data.customer.phone_number}
        stats={{
          viewedProperties: data.viewed_property,
          savedProperties: data.saved_property,
          ownedProperties: data.owned_property,
        }}
        paymentInfo={{
          amount: data.customer.unique_customer_id,
          date: formatDate(data.customer.updated_at),
        }}
        marketerName={data.customer.referral_code || "Unknown Marketer"}
        buttonTexts={{
          sendMessage: "Send Message",
          removeClient: "Remove Client",
        }}
        userId={data.customer.id}
        userNmae={`${data.customer.first_name} ${data.customer.last_name}`}
        userImage={data.customer.profile_picture}
        loading={messagingcustomerloading}
        loadingdelete={loadingdelete}
      />

      {/* ERP Sync Button */}
      {/* <ERPSyncButton 
        userId={String(id)}
        customerData={data}
      /> */}

      {/* Citta Contracts Table - WITH TWO BUTTONS */}
      <TableCard
      citta={true}
      headerComponent={
          <ERPSyncButton 
        userId={String(id)}
        customerData={data}
      />
      }
        title="Citta Contracts"
        data={cittaContracts}
        columns={cittaContractsColumnsSimple}
        viewAllText={data?.citta_contract?.total > 0 ? "View All" : null}
        rowKey="id"
        onViewAllClick={() =>
          openModal(
            "All Citta Contracts",
            cittaContractsAll,
            cittaContractsColumns,
            cittaContractPagination,
            handlePageChange3,
          )
        }
      />

      {/* ERP Transactions Section - Shows when ERP button is clicked */}
      {showTransactionsTable && selectedContractForTransactions && (
        <div className="mt-6 relative bg-white rounded-[30px] p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-dark">
                ERP Transactions
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Contract: {selectedContractForTransactions.contractId} • {selectedContractForTransactions.customerName}
              </p>
            </div>
            <button
              onClick={handleCloseTransactions}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <FaXmark size={20} />
            </button>
          </div>
          <ERPContractTransactionsTable
            contractId={selectedContractForTransactions.contractId}
            customerName={selectedContractForTransactions.customerName}
            onViewTransaction={openTransactionModal}
          />
        </div>
      )}

      {/* Active Plans Table */}
      <TableCard
        title="Active Plans"
        data={activePlans}
        columns={activePlansColumns}
        viewAllText={data?.active_plan?.total > 0 ? "View All" : null}
        rowKey="id"
        onViewAllClick={() =>
          openModal(
            "All Active Plans",
            activePlansAll,
            activePlansColumns,
            activePlanPagination,
            handlePageChange,
          )
        }
      />

      {/* Completed Properties Table */}
      <TableCard
        title="Completed Properties"
        data={completedProperties}
        columns={completedPropertiesColumns}
        viewAllText={data?.completed_property?.total > 0 ? "View All" : null}
        rowKey="id"
        onViewAllClick={() =>
          openModal(
            "All Completed Properties",
            completedPropertiesAll,
            completedPropertiesColumns,
            completedPropertyPagination,
            handlePageChange2,
          )
        }
      />

      {/* Citta Contract Details Modal */}
      <CittaContractModal
        isOpen={contractModalOpen}
        onClose={closeContractModal}
        contractData={selectedContract!}
        // onViewTransactions={handleViewContractTransactions}
      />

      {/* ERP Transaction Details Modal */}
      <ERPTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        transactionData={selectedTransaction!}
        contractId={selectedTransaction?.ContractId}
        customerName={selectedContractForTransactions?.customerName}
      />

      {/* View All Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        className="min-w-[80vw]"
      >
        <TableCard
          data={modalData}
          columns={modalColumns}
          viewAllText={null}
          rowKey="id"
          className="shadow-none p-0"
          onPageChange={modalHandlePageChange || undefined}
          pagination={modalPagination || undefined}
        />
      </Modal>
    </div>
  );
}