import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { Download } from "lucide-react";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import ExportModal, {
  ExportModalRef,
} from "../../components/exportModal/modalexport";
import { AppDispatch } from "../../components/Redux/store";
import {
  clearSecurityCodesExportDownloadUrl,
  selectMaintenanceRequestsData,
  selectMaintenanceRequestsError,
  selectMaintenanceRequestsLoading,
  selectMaintenanceRequestsPagination,
  selectMaintenanceRequestsStats,
  selectSecurityCodesData,
  selectSecurityCodesError,
  selectSecurityCodesExportDownloadUrl,
  selectSecurityCodesExportError,
  selectSecurityCodesExportLastExportDate,
  selectSecurityCodesExportLoading,
  selectSecurityCodesExportSuccess,
  selectSecurityCodesLoading,
  selectSecurityCodesPagination,
  selectSecurityCodesStats,
  selectUtilityPaymentsData,
  selectUtilityPaymentsError,
  selectUtilityPaymentsLoading,
  selectUtilityPaymentsPagination,
  selectUtilityPaymentsStats,
  resetSecurityCodesExportState,
  setMaintenanceRequestsCurrentPage,
  setSecurityCodesCurrentPage,
  setUtilityPaymentsCurrentPage,
} from "../../components/Redux/estate/estateSlice";
import {
  exportEstateSecurityCodes,
  fetchEstateMaintenances,
  fetchEstateSecurityCodes,
  fetchEstateUtilityPayments,
} from "../../components/Redux/estate/estateThunk";
import {
  MaintenanceTable,
  SecurityCodesTable,
  UtilityPaymentsTable,
} from "./EstateOperationsTables";

type OperationMode = "maintenance" | "security" | "utility";

interface EstateOperationsPageProps {
  mode: OperationMode;
}

const config = {
  maintenance: {
    title: "Estate Maintenance",
    subtitle: "View all estate maintenance requests",
    tab: "Maintenance",
    search: "Search maintenance requests",
    empty: "No maintenance request found",
  },
  security: {
    title: "Estate Security Codes",
    subtitle: "View all generated estate security codes",
    tab: "Security Codes",
    search: "Search security codes",
    empty: "No security code found",
  },
  utility: {
    title: "Estate Utility Payments",
    subtitle: "View all estate utility payments",
    tab: "Utility Payments",
    search: "Search utility payments",
    empty: "No utility payment found",
  },
};

export default function EstateOperationsPage({ mode }: EstateOperationsPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const securityExportModalRef = useRef<ExportModalRef>(null);
  const [search, setSearch] = useState("");

  const maintenanceRequests = useSelector(selectMaintenanceRequestsData);
  const maintenanceStats = useSelector(selectMaintenanceRequestsStats);
  const maintenancePagination = useSelector(selectMaintenanceRequestsPagination);
  const maintenanceLoading = useSelector(selectMaintenanceRequestsLoading);
  const maintenanceError = useSelector(selectMaintenanceRequestsError);

  const securityCodes = useSelector(selectSecurityCodesData);
  const securityStats = useSelector(selectSecurityCodesStats);
  const securityPagination = useSelector(selectSecurityCodesPagination);
  const securityLoading = useSelector(selectSecurityCodesLoading);
  const securityError = useSelector(selectSecurityCodesError);
  const securityExportLoading = useSelector(selectSecurityCodesExportLoading);
  const securityExportError = useSelector(selectSecurityCodesExportError);
  const securityExportSuccess = useSelector(selectSecurityCodesExportSuccess);
  const securityExportDownloadUrl = useSelector(
    selectSecurityCodesExportDownloadUrl,
  );
  const securityExportLastExportDate = useSelector(
    selectSecurityCodesExportLastExportDate,
  );

  const utilityPayments = useSelector(selectUtilityPaymentsData);
  const utilityStats = useSelector(selectUtilityPaymentsStats);
  const utilityPagination = useSelector(selectUtilityPaymentsPagination);
  const utilityLoading = useSelector(selectUtilityPaymentsLoading);
  const utilityError = useSelector(selectUtilityPaymentsError);

  const currentConfig = config[mode];

  useEffect(() => {
    if (mode === "maintenance") {
      dispatch(
        fetchEstateMaintenances({
          page: maintenancePagination.currentPage,
          search,
        }),
      );
    }

    if (mode === "security") {
      dispatch(fetchEstateSecurityCodes({ page: securityPagination.currentPage }));
    }

    if (mode === "utility") {
      dispatch(fetchEstateUtilityPayments({ page: utilityPagination.currentPage }));
    }
  }, [
    dispatch,
    maintenancePagination.currentPage,
    mode,
    search,
    securityPagination.currentPage,
    utilityPagination.currentPage,
  ]);

  const pageState = useMemo(() => {
    if (mode === "maintenance") {
      return {
        data: maintenanceRequests,
        stats: maintenanceStats,
        loading: maintenanceLoading,
        error: maintenanceError,
      };
    }

    if (mode === "security") {
      return {
        data: securityCodes,
        stats: securityStats,
        loading: securityLoading,
        error: securityError,
      };
    }

    return {
      data: utilityPayments,
      stats: utilityStats,
      loading: utilityLoading,
      error: utilityError,
    };
  }, [
    maintenanceError,
    maintenanceLoading,
    maintenanceRequests,
    maintenanceStats,
    mode,
    securityCodes,
    securityError,
    securityLoading,
    securityStats,
    utilityError,
    utilityLoading,
    utilityPayments,
    utilityStats,
  ]);

  const handleMaintenancePageChange = (page: number) => {
    dispatch(setMaintenanceRequestsCurrentPage(page));
    dispatch(fetchEstateMaintenances({ page, search }));
  };

  const handleSecurityPageChange = (page: number) => {
    dispatch(setSecurityCodesCurrentPage(page));
    dispatch(fetchEstateSecurityCodes({ page }));
  };

  const handleSecurityExport = (startDate: string, endDate: string) => {
    dispatch(
      exportEstateSecurityCodes({
        start_date: startDate,
        end_date: endDate,
        status: "active",
      }),
    );
  };

  const handleUtilityPageChange = (page: number) => {
    dispatch(setUtilityPaymentsCurrentPage(page));
    dispatch(fetchEstateUtilityPayments({ page }));
  };

  const renderTable = () => {
    if (pageState.loading) {
      return <LoadingAnimations loading={pageState.loading} />;
    }

    if (pageState.error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 font-medium">{pageState.error}</p>
        </div>
      );
    }

    if (pageState.data.length === 0) {
      return (
        <div className="max-h-screen">
          <p className="text-center font-normal text-[#767676]">
            {currentConfig.empty}
          </p>
          <NotFound />
        </div>
      );
    }

    if (mode === "maintenance") {
      return (
        <MaintenanceTable
          data={maintenanceRequests}
          pagination={maintenancePagination}
          onPageChange={handleMaintenancePageChange}
        />
      );
    }

    if (mode === "security") {
      return (
        <SecurityCodesTable
          data={securityCodes}
          pagination={securityPagination}
          onPageChange={handleSecurityPageChange}
        />
      );
    }

    return (
      <UtilityPaymentsTable
        data={utilityPayments}
        pagination={utilityPagination}
        onPageChange={handleUtilityPageChange}
      />
    );
  };

  return (
    <div className="pb-[52px] relative">
      <Header
        title={currentConfig.title}
        subtitle={currentConfig.subtitle}
        showSearchAndButton={false}
      />

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[24px] flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate("/estates")}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#79B833] bg-white px-5 text-sm font-bold text-[#79B833] hover:bg-[#79B833]/10"
        >
          <IoArrowBackSharp className="text-base" />
          Back to Estates
        </button>
        {mode === "security" && (
          <button
            onClick={() => securityExportModalRef.current?.openModal()}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#272727] px-5 text-sm font-bold text-white hover:bg-[#101010]"
          >
            <Download size={16} />
            Export Security Codes
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          title="Total"
          value={pageState.stats?.total || 0}
          change="All records"
        />
        <MatrixCard
          title={mode === "utility" ? "Total Amount" : "Pending"}
          value={
            mode === "utility"
              ? pageState.stats?.total_amount || 0
              : pageState.stats?.total_pending || 0
          }
          change={mode === "utility" ? "Utility payments" : "Pending records"}
        />
        <MatrixCard
          title="Attended"
          value={pageState.stats?.total_attended_to || 0}
          change="Completed or attended records"
        />
        <MatrixCard
          title={mode === "security" ? "Used Count" : "Per Page"}
          value={
            mode === "security"
              ? pageState.stats?.total_used_count || 0
              : pageState.data.length
          }
          change="Current view"
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          tabs={[currentConfig.tab]}
          activeTab={currentConfig.tab}
          searchPlaceholder={currentConfig.search}
          onSearch={setSearch}
          showTabs={false}
        >
          {renderTable()}
        </ReusableTable>
      </div>

      {mode === "security" && (
        <ExportModal
          ref={securityExportModalRef}
          modalTitle="Export Security Codes"
          description="Select the date range to export active estate security codes. The system will generate an Excel file for the selected period."
          exportType="security-codes"
          onExport={handleSecurityExport}
          isLoading={securityExportLoading}
          error={securityExportError}
          success={securityExportSuccess}
          downloadUrl={securityExportDownloadUrl}
          lastExportDate={securityExportLastExportDate}
          resetExportState={() => dispatch(resetSecurityCodesExportState())}
          clearDownloadUrl={() =>
            dispatch(clearSecurityCodesExportDownloadUrl())
          }
          baseUrl={import.meta.env.VITE_API_BASE_URL || ""}
        />
      )}
    </div>
  );
}
