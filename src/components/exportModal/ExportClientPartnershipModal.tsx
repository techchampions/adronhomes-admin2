// components/ExportClientPartnershipModal.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  resetExportState,
  clearDownloadUrl,
  selectExportClientPartnershipLoading,
  selectExportClientPartnershipError,
  selectExportClientPartnershipSuccess,
  selectExportClientPartnershipDownloadUrl,
  selectExportClientPartnershipLastExportDate
} from "../Redux/export/exportClientPartnershipSlice";
import { exportClientPartnership } from "../Redux/export/exportClientPartnershipThunk";
import ExportModal, { ExportModalRef } from "./modalexport";
import { BASE_URL } from "../Redux/UpdateContract/viewcontractFormDetails";

interface ExportClientPartnershipModalProps {
  ref: React.RefObject<ExportModalRef | null>;
}

const ExportClientPartnershipModal: React.FC<ExportClientPartnershipModalProps> =
  React.forwardRef((props, ref) => {
    const dispatch = useDispatch();

    // Redux selectors
    const isLoading = useSelector(selectExportClientPartnershipLoading);
    const error = useSelector(selectExportClientPartnershipError);
    const success = useSelector(selectExportClientPartnershipSuccess);
    const downloadUrl = useSelector(selectExportClientPartnershipDownloadUrl);
    const lastExportDate = useSelector(selectExportClientPartnershipLastExportDate);

    const handleExport = (startDate: string, endDate: string) => {
      dispatch(
        exportClientPartnership({
          start_date: startDate,
          end_date: endDate,
        }) as any
      );
    };

    return (
      <ExportModal
        ref={ref}
        modalTitle="Export Client Partnership"
        description="Select the date range to export client partnership data. The system will generate an Excel file containing all client partnerships within the specified period."
        exportType="clientPartnership"
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

ExportClientPartnershipModal.displayName = "ExportClientPartnershipModal";

export default ExportClientPartnershipModal;