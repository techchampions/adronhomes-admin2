// SyncButton.tsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface SyncButtonProps {
  onClick?: () => Promise<void> | void;
  disabled?: boolean;
  label?: string;
  syncingLabel?: string;
  duration?: number;
  className?: string;
}

const SyncButton: React.FC<SyncButtonProps> = ({
  onClick,
  disabled = false,
  label = 'Sync Data',
  syncingLabel = 'Syncing...',
  duration = 2000,
  className
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleClick = async () => {
    if (isSyncing || disabled) return;

    setIsSyncing(true);
    
    try {
      if (onClick) {
        await onClick();
      }
    } finally {
      // Auto-reset after duration if not already reset by parent
      setTimeout(() => {
        setIsSyncing(false);
      }, duration);
    }
  };

  return (
    <ButtonContainer className={className}>
      <StyledButton
        onClick={handleClick}
        disabled={disabled || isSyncing}
        $isSyncing={isSyncing}
        $disabled={disabled}
      >
        <ButtonContent>
          {isSyncing ? (
            <>
              <SyncIcon />
              {syncingLabel}
            </>
          ) : (
            <>
              <SyncIconStatic />
              {label}
            </>
          )}
        </ButtonContent>
      </StyledButton>
      
      {isSyncing && (
        <ProgressIndicator>
          <ProgressBar />
        </ProgressIndicator>
      )}
    </ButtonContainer>
  );
};

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const progress = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

// Styled Components
const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
  width: fit-content;
`;

const StyledButton = styled.button<{ $isSyncing: boolean; $disabled: boolean }>`
  background-color: ${props => props.$isSyncing ? '#5a8a29' : props.$disabled ? '#cccccc' : '#79B833'};
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.$disabled || props.$isSyncing ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(121, 184, 51, 0.2);
  
  &:hover:not(:disabled) {
    background-color: ${props => props.$isSyncing ? '#5a8a29' : '#67a02a'};
    transform: ${props => props.$isSyncing ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$isSyncing 
      ? '0 4px 6px rgba(121, 184, 51, 0.2)' 
      : '0 6px 12px rgba(121, 184, 51, 0.3)'};
  }
  
  &:active:not(:disabled) {
    transform: ${props => props.$isSyncing ? 'none' : 'translateY(0)'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(121, 184, 51, 0.4);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    animation: ${props => props.$isSyncing ? 'shimmer 1.5s infinite' : 'none'};
  }
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
`;

// Keyframe for shimmer effect
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const SyncIcon = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SyncIconStatic = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
  
  &::before {
    content: '↻';
    font-size: 14px;
    font-weight: bold;
  }
`;

const ProgressIndicator = styled.div`
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: rgba(121, 184, 51, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #79B833;
  animation: ${progress} 2s linear infinite;
  border-radius: 2px;
`;

// Optional: Variant styles
export const SyncButtonVariants = {
  Primary: styled(SyncButton)``,
  Secondary: styled(SyncButton)`
    ${StyledButton} {
      background-color: #ffffff;
      color: #79B833;
      border: 2px solid #79B833;
      
      &:hover:not(:disabled) {
        background-color: #f5faf0;
      }
    }
    
    ${ProgressBar} {
      background-color: #79B833;
    }
  `,
  Small: styled(SyncButton)`
    ${StyledButton} {
      padding: 8px 16px;
      font-size: 14px;
      min-width: 120px;
    }
  `,
  Large: styled(SyncButton)`
    ${StyledButton} {
      padding: 16px 32px;
      font-size: 18px;
      min-width: 180px;
    }
  `
};

export default SyncButton;