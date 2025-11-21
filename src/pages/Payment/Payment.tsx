import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import PaymentTableComponent from "./PaymentTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { payments } from "../../components/Redux/Payment/payment_thunk";
import { formatDate } from "../../utils/formatdate";
import NotFound from "../../components/NotFound";
import { toast } from "react-toastify";
import LoadingAnimations from "../../components/LoadingAnimations";
import {
  resetErrorMessage,
  resetPayments,
  setPaymentSearch,
} from "../../components/Redux/Payment/payment_slice";
import { useLocation } from "react-router-dom";
import ExportPaymentsModal from "../../components/exportModal/PaymentsExportModal";
import { ExportModalRef } from "../../components/exportModal/modalexport";

export default function Payment() {
  const dispatch = useDispatch<AppDispatch>();
  const tabs = useMemo(() => ["All", "Approved", "Pending", "Rejected"], []);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const location = useLocation();

  const { data, error, loading, pagination, search } = useSelector(
    (state: RootState) => state.payments
  );

  const basePath = useMemo(
    () => location.pathname.startsWith("/payments/payments"),
    [location.pathname]
  );
  useEffect(() => {
    return () => {
      dispatch(setPaymentSearch(""));
    };
  }, [dispatch]);
  // Memoized card titles and values
  const cardConfigs = useMemo(
    () => ({
      totalAmount: {
        title: "Total Amount Paid",
        value: data?.amount_total
          ? `${data.amount_total.toLocaleString()}`
          : "0",
        change: basePath ? "Includes all payments" : "Includes all contracts",
      },
      pending: {
        title: basePath ? "Total Pending payments" : "Total Pending Contracts",
        value: data?.amount_pending
          ? `${data.amount_pending.toLocaleString()}`
          : "0",
        change: basePath
          ? "Includes all pending payments"
          : "Includes all pending contracts",
      },
      active: {
        title: basePath ? "Total Active payments" : "Total Active Contracts",
        value: data?.total ? data.total.toString() : "0",
        change: basePath
          ? "Includes all active payments"
          : "Includes all active contracts",
      },
    }),
    [data, basePath]
  );

  // Memoized payment data transformation
  const paymentData = useMemo(() => {
    if (!data?.list?.data) return [];

    return data.list.data
      .filter((payment) => {
        if (activeTab === "All") return true;
        if (activeTab === "Approved") return payment.status === 1;
        if (activeTab === "Rejected") return payment.status === 2;
        if (activeTab === "Pending")
          return payment.status !== 1 && payment.status !== 2;
        return true;
      })
      .map((payment) => ({
        id: `#${payment.id}`,
        customerName: payment.user
          ? `${payment.user.first_name} ${payment.user.last_name}`
          : "N/A",
        amount: `₦${payment.amount_paid.toLocaleString()}`,
        status:
          payment.status === 1
            ? "Approved"
            : payment.status === 2
            ? "Rejected"
            : "Pending",
        paymentDate: formatDate(payment.created_at),
        description: payment.description,
      }));
  }, [data, activeTab]);

  const filteredData = useMemo(() => paymentData, [paymentData]);
  const isEmpty = useMemo(() => filteredData.length === 0, [filteredData]);

  const handleSearch = useCallback(
    (value: string) => {
      dispatch(setPaymentSearch(value));
    },
    [dispatch]
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const openPaymentsModal = useCallback(() => {
    paymentsModalRef.current?.openModal();
  }, []);

  // Effects
  useEffect(() => {
    dispatch(payments({ page: pagination.currentPage, search }));
  }, [dispatch, pagination.currentPage, search]);

  useEffect(() => {
    if (error) {
      dispatch(resetErrorMessage());
      dispatch(resetPayments());
    }
  }, [error, dispatch]);

  const paymentsModalRef = useRef<ExportModalRef>(null);

  return (
    <div className="pb-[52px] relative">
      <Header
        title="Payments"
        subtitle="Manage the list of payments made by customers"
        buttonText="Export"
        onButtonClick={openPaymentsModal}
      />

      <div className="grid lg:grid-cols-3 gap-[20px] lg:pl-[38px] items-center lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          currency={true}
          title={cardConfigs.totalAmount.title}
          value={cardConfigs.totalAmount.value}
          change={cardConfigs.totalAmount.change}
        />
        <MatrixCard
          currency={true}
          title={cardConfigs.pending.title}
          value={cardConfigs.pending.value}
          change={cardConfigs.pending.change}
        />
        <MatrixCard
          title={cardConfigs.active.title}
          value={cardConfigs.active.value}
          change={cardConfigs.active.change}
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          onSearch={handleSearch}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabs}
        >
          {isEmpty ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">
                No data found
              </p>
              <NotFound />
            </div>
          ) : loading ? (
            <LoadingAnimations loading={loading} />
          ) : (
            <PaymentTableComponent data={filteredData} />
          )}
        </ReusableTable>
      </div>

      <ExportPaymentsModal ref={paymentsModalRef} />
    </div>
  );
}
