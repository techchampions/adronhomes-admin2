import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetExportState,
  clearDownloadUrl,
  selectExportPropertyRequestsLoading,
  selectExportPropertyRequestsError,
  selectExportPropertyRequestsSuccess,
  selectExportPropertyRequestsDownloadUrl,
  selectExportPropertyRequestsLastExportDate,
} from "../Redux/export/exportPropertyRequestsSlice";
import { exportPropertyRequests } from "../Redux/export/exportPropertyRequestsThunk";
import ExportModal, { ExportModalRef } from "./modalexport";

interface PropertyRequestsExportModalProps {
  propertyId?: number;
  directorId?: number;
}

const PropertyRequestsExportModal = React.forwardRef<
  ExportModalRef,
  PropertyRequestsExportModalProps
>(({ propertyId, directorId }, ref) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectExportPropertyRequestsLoading);
  const error = useSelector(selectExportPropertyRequestsError);
  const success = useSelector(selectExportPropertyRequestsSuccess);
  const downloadUrl = useSelector(selectExportPropertyRequestsDownloadUrl);
  const lastExportDate = useSelector(selectExportPropertyRequestsLastExportDate);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const handleExport = (startDate: string, endDate: string) => {
    dispatch(
      exportPropertyRequests({
        start_date: startDate,
        end_date: endDate,
        property_id: propertyId,
        director_id: directorId,
      }) as any,
    );
  };

  return (
    <ExportModal
      ref={ref}
      modalTitle="Export Requests & Enquiries"
      description="Select any start and end date to download a PDF list of requests and enquiries in that period."
      exportType="requests-enquiries"
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

PropertyRequestsExportModal.displayName = "PropertyRequestsExportModal";

export default PropertyRequestsExportModal;
