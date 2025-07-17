import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import ProfileCard from "../../general/ProfileCard";
import TableCard, { PaginationProps } from "../../general/TableCard";

import {
  fetchCustomerById,
  setActivePlanCurrentPage,
  setCompletedPropertyCurrentPage,
  selectActivePlanPagination,
  selectCompletedPropertyPagination,
  selectCustomerActivePlans,
  selectCustomerCompletedProperties,
} from "../../components/Redux/customers/customerByid";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { formatDate } from "../../utils/formatdate";
import { formatAsNaira } from "../../utils/formatcurrency";
import LoadingAnimations from "../../components/LoadingAnimations";
import { PlanData } from "../../components/Redux/customers/customerByid";
import Modal from "./Modal";

interface TableRowData {
  id: number;
  name: string;
  location: string;
  image: string;
  price?: string;
  amountPaid?: string;
  amountLeft?: string;
  duration?: string;
  dueDate?: string;
  Duration?: string;
  StartDate?: string;
  FinalPayment?: string;
  property: any;
  user_id?: number;
  plan_id?: number;
}

export default function CustomerSinglePage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.customerById
  );

  const { loading: messagingcustomerloading } = useSelector(
    (state: RootState) => state.messagingcustomer
  );

  const { loading: loadingdelete } = useSelector(
    (state: RootState) => state.deleteUserSlice
  );

  // Pagination states from Redux
  const activePlanPagination = useSelector(selectActivePlanPagination);
  const completedPropertyPagination = useSelector(
    selectCompletedPropertyPagination
  );

  // Data arrays for tables (paginated data)
  const activePlansData = useSelector(selectCustomerActivePlans);
  const completedPropertiesData = useSelector(
    selectCustomerCompletedProperties
  );

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const [modalData, setModalData] = useState<TableRowData[]>([]);

  const [modalColumns, setModalColumns] = useState<any[]>([]);
  const [modalPagination, setModalPagination] =
    useState<PaginationProps | null>(null);

  const [modalHandlePageChange, setModalHandlePageChange] = useState<
    ((page: number) => void) | null
  >(null);

  // Handlers for main page table pagination
  const handlePageChange = (page: number) => {
    dispatch(setActivePlanCurrentPage(page));
  };

  const handlePageChange2 = (page: number) => {
    dispatch(setCompletedPropertyCurrentPage(page));
  };

  useEffect(() => {
    if (id) {
      dispatch(
        fetchCustomerById({
          customerId: Number(id),
          activePage: activePlanPagination.currentPage,
          completedPage: completedPropertyPagination.currentPage,
        })
      );
    }
  }, [
    dispatch,
    id,
    activePlanPagination.currentPage,
    completedPropertyPagination.currentPage,
  ]);

  const openModal = (
    title: string,
    data: TableRowData[],
    columns: any[],
    pagination: PaginationProps,
    handlePageChangeFunc: (page: number) => void
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

  // Data for the main page tables (limited by API response)
  const activePlans =
    data?.limit_active_plan.map((plan) => {
      const property = plan.property;
      return {
        id: plan.id,
        name: property?.name || "Unknown Property",
        location: property
          ? `${property.lga}, ${property.state}`
          : "Unknown Location",
        price: formatAsNaira(plan.total_amount),
        amountPaid: formatAsNaira(plan.paid_amount),
        amountLeft: formatAsNaira(plan.remaining_balance),
        duration: plan.monthly_duration
          ? `${plan.monthly_duration} Months`
          : "One-time",
        dueDate: plan.end_date ? formatDate(plan.end_date) : "N/A",
        image: property?.display_image || "/default-property.jpg",
        property,
        user_id: plan.user_id,
        plan_id: plan.id,
      };
    }) || [];

  const completedProperties =
    data?.limit_completed_property.map((item) => {
      const property = item.property;
         const getDurationLabel = (type: any) => {
        if (type === "2") return "Installment Payment";
        if (type === "1") return "One-Time Payment";
        return "N/A";
      };
      return {
        id: item.id,
        name: property.name,
        location: `${property.lga}, ${property.state}`,
        image: property.display_image || "/default-property.jpg",
        price: formatAsNaira(property.price),
        amountPaid: formatAsNaira(item.paid_amount),
          Duration: getDurationLabel(item.payment_type),
        StartDate: item.start_date ? formatDate(item.start_date) : "N/A",
        FinalPayment: item.end_date ? formatDate(item.end_date) : "N/A",
        property: item.property,
      };
    }) || [];

  const completedPropertiesAll =
    completedPropertiesData.map((item) => {
      const property = item.property;

      const getDurationLabel = (type: any) => {
        if (type === "2") return "Installment Payment";
        if (type === "1") return "One-Time Payment";
        return "N/A";
      };

      return {
        id: item.id,
        name: property.name,
        location: `${property.lga}, ${property.state}`,
        image: property.display_image || "/default-property.jpg",
        price: formatAsNaira(property.price),
        amountPaid: formatAsNaira(item.paid_amount),
        Duration: getDurationLabel(item.payment_type),
        StartDate: item.start_date ? formatDate(item.start_date) : "N/A",
        FinalPayment: item.end_date ? formatDate(item.end_date) : "N/A",
        property: item.property,
      };
    }) || [];

  const activePlansAll =
    activePlansData.map((plan) => {
      const property = plan.property;
      return {
        id: plan.id,
        name: property?.name || "Unknown Property",
        location: property
          ? `${property.lga}, ${property.state}`
          : "Unknown Location",
        price: formatAsNaira(plan.total_amount),
        amountPaid: formatAsNaira(plan.paid_amount),
        amountLeft: formatAsNaira(plan.remaining_balance),
        duration: plan.monthly_duration
          ? `${plan.monthly_duration} Months`
          : "One-time",
        dueDate: plan.end_date ? formatDate(plan.end_date) : "N/A",
        image: property?.display_image || "/default-property.jpg",
        property,
        user_id: plan.user_id,
        plan_id: plan.id,
      };
    }) || [];

  const activePlansColumns = [
    {
      key: "property",
      title: "Property",
      width: 220,
      render: (_: any, row: any) => (
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
              <img src="/location.svg" className="mr-1" />
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
      render: (_: any, row: any) => (
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
              <img src="/location.svg" className="mr-1" />
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
    return <div className="text-center py-8">No customer data found</div>;
  }

  return (
    <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] space-y-[30px] pb-[52px]">
      <Header
        history={true}
        title="Customers"
        subtitle="Manage the list of registered customers"
        showSearchAndButton={false}
      />

      <div className="grid md:grid-cols-3 gap-[20px]">
        <MatrixCardGreen
          title="Total Amount Paid"
          value={formatAsNaira(parseInt(data.total_paid))}
          change="Includes total amount paid by this customer"
        />
        <MatrixCard
          title="Total Pending Payments"
          value={formatAsNaira(data.pending_paid)}
          change="Includes total pending payments of this customer"
        />
        <MatrixCard
          title="Total Active Properties"
          value={data.active_property.toString()}
          change="Includes all active property plans of this customer"
        />
      </div>

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
          amount: formatAsNaira(parseInt(data.total_paid)),
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

      <TableCard
        title="Active Plans"
        data={activePlans}
        columns={activePlansColumns}
        viewAllText="View All"
        rowKey="id"
        className=""
        onViewAllClick={() =>
          openModal(
            "All Active Plans",
            activePlansAll,
            activePlansColumns,
            activePlanPagination,
            handlePageChange
          )
        }
      />

      <TableCard
        title="Completed Properties"
        data={completedProperties}
        columns={completedPropertiesColumns}
        viewAllText="View All"
        rowKey="id"
        className=""
        onViewAllClick={() =>
          openModal(
            "All Completed Properties",
            completedPropertiesAll,
            completedPropertiesColumns,
            completedPropertyPagination,
            handlePageChange2
          )
        }
      />

      {/* Modal Component */}
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
