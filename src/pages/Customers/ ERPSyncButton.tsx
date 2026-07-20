// ERPSyncButton.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import SyncButton from './SyncButton';
import { 
  selectERPContractsSync, 
  selectERPContractsLoading, 
  selectERPContractsError, 
  selectERPContractsSuccess, 
  resetERPContractsSyncState 
} from '../../components/Redux/Contract/erpContractsSync/erpContractsSyncSlice';
import { fetchERPContractsSync } from '../../components/Redux/Contract/erpContractsSync/erpContractsSyncThunk';

interface ERPSyncButtonProps {
  userId: string;
  customerData?: any; // Customer data to check origin and contracts
  onSyncComplete?: (data: any) => void;
  onSyncError?: (error: string) => void;
  className?: string;
}

const ERPSyncButton: React.FC<ERPSyncButtonProps> = ({
  userId,
  customerData,
  onSyncComplete,
  onSyncError,
  className
}) => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const erpData = useSelector(selectERPContractsSync);
  const isLoading = useSelector(selectERPContractsLoading);
  const error = useSelector(selectERPContractsError);
  const isSuccess = useSelector(selectERPContractsSuccess);

  // Check if user can fetch data (must be from citta origin)
  const canFetchERPData = () => {
    if (!customerData?.customer) return false;
    
    // Only allow fetching if user was created via citta
    const isCittaOrigin = customerData.customer.created_origin === "citta";
    
    return isCittaOrigin;
  };

  // Check if user has existing citta contracts (already fetched before)
  const hasExistingContracts = () => {
    return customerData?.citta_contract?.total > 0;
  };

  // Handle success state auto-reset
  useEffect(() => {
    if (isSuccess && erpData) {
    //   const timer = setTimeout(() => {
        dispatch(resetERPContractsSyncState());
    //   }, 3000);
      
    //   return () => clearTimeout(timer);
    }
  }, [isSuccess, erpData, dispatch]);

  // Handle error state auto-reset
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetERPContractsSyncState());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSync = async () => {
    // Don't allow fetch if not from citta origin
    if (!canFetchERPData()) {
      if (onSyncError) {
        onSyncError('Only Citta users can fetch ERP data');
      }
      return;
    }

    // Reset previous state before starting new sync
    dispatch(resetERPContractsSyncState());
    
    try {
      // Dispatch the thunk action
      const result = await dispatch(fetchERPContractsSync({ userId }) as any);
      
      if (fetchERPContractsSync.fulfilled.match(result)) {
        const data = result.payload;
        
        // Show success message based on response
        if (data?.status && onSyncComplete) {
          onSyncComplete(data);
        }
        
        // Log the sync result
        console.log('ERP Contracts Sync Successful:', {
          userId,
          linkedContracts: data?.contract_ids?.linkedContracts?.length || 0,
          erpContracts: data?.contract_ids?.erpContracts?.length || 0
        });
      } else if (fetchERPContractsSync.rejected.match(result)) {
        const errorMessage = result.payload?.message || 'Sync failed';
        if (onSyncError) {
          onSyncError(errorMessage);
        }
      }
    } catch (error: any) {
      if (onSyncError) {
        onSyncError(error.message || 'Failed to sync ERP contracts');
      }
      console.error('ERP Sync Error:', error);
    }
  };

  const handleReset = () => {
    dispatch(resetERPContractsSyncState());
  };

  // Determine button label based on state
  const getButtonLabel = () => {
    // Check if user is from citta origin
    const isCittaOrigin = customerData?.customer?.created_origin === "citta";
    
    if (!isCittaOrigin) {
      return 'Only for Citta Users';
    }
    
    // Show loading state
    if (isLoading) {
      return 'Fetching ERP Data...';
    }
    
    // Show success state from current sync
    if (erpData && isSuccess) {
      const contractCount = erpData.contract_ids?.erpContracts?.length || 0;
      return `Refetch (${contractCount} contracts)`;
    }
    
    // Show refetch if user already has contracts
    if (hasExistingContracts()) {
      const contractCount = customerData?.citta_contract?.total || 0;
      return `Refetch ERP Contracts (${contractCount})`;
    }
    
    // Default state for eligible users
    return 'Fetch ERP Contracts';
  };

  // Determine if button should be disabled
  const getButtonDisabled = () => {
    if (isLoading) return true;
    
    // Disable if not from citta origin
    if (customerData?.customer?.created_origin !== "citta") return true;
    
    return false;
  };

  // Show status messages based on user type
  const getUserStatusMessage = () => {
    if (!customerData?.customer) return null;
    
    const isCittaOrigin = customerData.customer.created_origin === "citta";
    const hasCittaContracts = hasExistingContracts();
    
    if (!isCittaOrigin) {
      return (
        <StatusMessage $type="info">
          ℹ️ This user was not created via Citta ERP
        </StatusMessage>
      );
    }
    
    // if (hasCittaContracts) {
    //   return (
    //     // <StatusMessage $type="success">
    //     //   ✅ {customerData.citta_contract.total} ERP contracts available - Click Refetch to update
    //     // </StatusMessage>
    //   );
    // }
    
    return null;
  };

  // Don't show button at all for non-citta users
  if (customerData?.customer && customerData.customer.created_origin !== "citta") {
    return null;
  }

  return (
    <Container className={className}>
      <ButtonWrapper>
        <SyncButton
          onClick={handleSync}
          disabled={getButtonDisabled()}
          label={getButtonLabel()}
          syncingLabel="Fetching ERP Data..."
          duration={3000}
        />
        
        {(erpData && isSuccess) || error ? (
          <ResetButton onClick={handleReset}>
            {error ? 'Dismiss Error' : 'Clear Data'}
          </ResetButton>
        ) : null}
      </ButtonWrapper>

      {/* Status Display */}
      <StatusContainer>
        {getUserStatusMessage()}
        
        {isLoading && (
          <StatusMessage $type="loading">
            ⏳ Connecting to ERP system...
          </StatusMessage>
        )}
        
        {error && (
          <StatusMessage $type="error">
            ❌ Error: {error}
          </StatusMessage>
        )}
        
        {erpData && isSuccess && (
          <StatusMessage $type="success">
            ✅ {erpData.message || 'Sync completed successfully!'}
          </StatusMessage>
        )}
      </StatusContainer>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
//   margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

`;
const ResetButton = styled.button`
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:active {
    background-color: #d0d0d0;
  }
`;

const StatusContainer = styled.div`
  min-height: 24px;
`;

interface StatusMessageProps {
  $type: 'loading' | 'error' | 'success' | 'info';
}

const StatusMessage = styled.div<StatusMessageProps>`
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.$type) {
      case 'loading': return '#fff3cd';
      case 'error': return '#f8d7da';
      case 'success': return '#d1e7dd';
      case 'info': return '#cff4fc';
      default: return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'loading': return '#856404';
      case 'error': return '#721c24';
      case 'success': return '#0f5132';
      case 'info': return '#055160';
      default: return 'inherit';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$type) {
      case 'loading': return '#ffeaa7';
      case 'error': return '#f5c6cb';
      case 'success': return '#badbcc';
      case 'info': return '#b6effb';
      default: return 'transparent';
    }
  }};
`;

export default ERPSyncButton;