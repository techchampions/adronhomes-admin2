// components/ExportCustomersModal.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  resetExportState, 
  clearDownloadUrl,
  selectExportPersonnelLoading as selectExportLoading,
  selectExportPersonnelError as selectExportError,
  selectExportPersonnelSuccess as selectExportSuccess,
  selectPersonnelDownloadUrl as selectDownloadUrl,
  selectPersonnelLastExportDate as selectLastExportDate
}  from '../Redux/export/exportPersonnelSlice';
import { exportPersonnel } from '../Redux/export/exportPersonnelThunk';
import ExportModal, { ExportModalRef } from './modalexport';

interface ExportPersonnelModalProps {
  ref: React.RefObject<ExportModalRef | null>

}

const ExportPersonnelModal: React.FC<ExportPersonnelModalProps> = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const isLoading = useSelector(selectExportLoading);
  const error = useSelector(selectExportError);
  const success = useSelector(selectExportSuccess);
  const downloadUrl = useSelector(selectDownloadUrl);
  const lastExportDate = useSelector(selectLastExportDate);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  const handleExport = (startDate: string, endDate: string) => {
    dispatch(exportPersonnel({
      start_date: startDate,
      end_date: endDate
    }) as any);
  };

  return (
    <ExportModal
      ref={ref}
      modalTitle="Export Personnel"
      description="Select the date range to export Personnel data. The system will generate an Excel file containing all Personnel within the specified period."
      exportType="Personnel"
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

ExportPersonnelModal.displayName = 'ExportPersonnelModal';

export default ExportPersonnelModal;