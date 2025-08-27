// components/ExportCustomersModal.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  resetExportState,
  clearDownloadUrl,
  selectExportLoading,
  selectExportError,
  selectExportSuccess,
  selectDownloadUrl,
  selectLastExportDate
} from "../Redux/export/exportContractSlice";
import { exportCustomers } from "../Redux/export/exportCustomersThunk";
import ExportModal, { ExportModalRef } from "./modalexport";
import { BASE_URL } from "../Redux/UpdateContract/viewcontractFormDetails";
import { exportContracts } from "../Redux/export/expoertContractThunk";

interface ExportCustomersModalProps {
  ref: React.RefObject<ExportModalRef | null>;
}

const ExportContractModal: React.FC<ExportCustomersModalProps> =
  React.forwardRef((props, ref) => {
    const dispatch = useDispatch();

    // Redux selectors
    const isLoading = useSelector(selectExportLoading);
    const error = useSelector(selectExportError);
    const success = useSelector(selectExportSuccess);
    const downloadUrl = useSelector(selectDownloadUrl);
    const lastExportDate = useSelector(selectLastExportDate);

    const handleExport = (startDate: string, endDate: string) => {
      dispatch(
        exportContracts({
          start_date: startDate,
          end_date: endDate,
        }) as any
      );
    };

    return (
      <ExportModal
        ref={ref}
        modalTitle="Export Contract"
        description="Select the date range to export contract data. The system will generate an Excel file containing all contract within the specified period."
        exportType="customers"
        onExport={handleExport}
        isLoading={isLoading}
        error={error}
        success={success}
        downloadUrl={downloadUrl}
        lastExportDate={lastExportDate}
        resetExportState={() => dispatch(resetExportState())}
        clearDownloadUrl={() => dispatch(clearDownloadUrl())}
        baseUrl={BASE_URL}
      />
    );
  });

ExportContractModal.displayName = "ExportCustomersModal";

export default ExportContractModal;
