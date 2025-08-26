// components/ExportCustomersModal.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  resetExportState, 
  clearDownloadUrl,
  selectExportCustomersLoading as selectExportLoading,
  selectExportCustomersError as selectExportError,
  selectExportCustomersSuccess as selectExportSuccess,
  selectCustomersDownloadUrl as selectDownloadUrl,
  selectCustomersLastExportDate as selectLastExportDate
}  from '../Redux/export/exportCustomersSlice';
import { exportCustomers } from '../Redux/export/exportCustomersThunk';
import ExportModal, { ExportModalRef } from './modalexport';

interface ExportCustomersModalProps {
  ref: React.RefObject<ExportModalRef | null>

}

const ExportCustomersModal: React.FC<ExportCustomersModalProps> = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const isLoading = useSelector(selectExportLoading);
  const error = useSelector(selectExportError);
  const success = useSelector(selectExportSuccess);
  const downloadUrl = useSelector(selectDownloadUrl);
  const lastExportDate = useSelector(selectLastExportDate);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  const handleExport = (startDate: string, endDate: string) => {
    dispatch(exportCustomers({
      start_date: startDate,
      end_date: endDate
    }) as any);
  };

  return (
    <ExportModal
      ref={ref}
      modalTitle="Export Customers"
      description="Select the date range to export customer data. The system will generate an Excel file containing all customers within the specified period."
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

ExportCustomersModal.displayName = 'ExportCustomersModal';

export default ExportCustomersModal;