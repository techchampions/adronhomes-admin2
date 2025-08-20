// components/ExportPaymentsModal.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  resetExportState, 
  clearDownloadUrl,
  selectExportLoading,
  selectExportError,
  selectExportSuccess,
  selectDownloadUrl,
  selectLastExportDate
} from '../Redux/export/exportPaymentsSlice';
import ExportModal, { ExportModalRef } from './modalexport';
import { exportPayments } from '../Redux/export/ exportPaymentsThunk';

interface ExportPaymentsModalProps {
 ref: React.RefObject<ExportModalRef | null>

}

const ExportPaymentsModal: React.FC<ExportPaymentsModalProps> = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const isLoading = useSelector(selectExportLoading);
  const error = useSelector(selectExportError);
  const success = useSelector(selectExportSuccess);
  const downloadUrl = useSelector(selectDownloadUrl);
  const lastExportDate = useSelector(selectLastExportDate);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  const handleExport = (startDate: string, endDate: string) => {
    dispatch(exportPayments({
      start_date: startDate,
      end_date: endDate
    }) as any);
  };

  return (
    <ExportModal
      ref={ref}
      modalTitle="Export Payments"
      description="Select the date range to export payment data. The system will generate an Excel file containing all payments within the specified period."
      exportType="payments"
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

ExportPaymentsModal.displayName = 'ExportPaymentsModal';

export default ExportPaymentsModal;