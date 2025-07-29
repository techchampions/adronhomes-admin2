import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { allocateProperty, resetAllocatePropertyState } from '../../components/Redux/UpdateContract/allocateProperty';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/Redux/store';
import { fetchUserPropertyPlan } from '../../components/Redux/Marketer/user_property_plan';

interface ConfirmAllocationModalProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  plan_id: any;
  modalText?: string;
  user_id:any;
  isChecked:any, setIsChecked:any
}

export const ConfirmAllocationModal: React.FC<ConfirmAllocationModalProps> = ({ 
  onCancel, 
  onConfirm, 
  plan_id,
  modalText = "Please confirm you want to upload these documents.",
  user_id,isChecked,
   setIsChecked
}) => {
  const dispatch = useDispatch<AppDispatch>(); 
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleConfirm = async () => {
    await dispatch(allocateProperty({ plan_id: plan_id }));

  };

  const { loading, error, success } = useSelector(
    (state: RootState) => state.allocateProperty
  );

  useEffect(() => {
    if (success) {
      onCancel?.();
        dispatch(fetchUserPropertyPlan({ planId: plan_id, userId: user_id }));
      dispatch(resetAllocatePropertyState());
    } else if (error) {
      onCancel?.();
      dispatch(resetAllocatePropertyState());
    }
  }, [success, error, onConfirm, onCancel, dispatch]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000033] bg-opacity-50">
      <div
        className="bg-white max-w-[500px] w-full rounded-[40px] py-[60px] px-[20px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} 
      >
        <p className='text-[#272727] font-[350] text-2xl pb-5'>Confirm</p>
        <p className="text-dark text-[20px] font-[325] mb-[40px] text-center px-[40px] max-w-[600px]">
          {modalText}
        </p>
        <div className="flex gap-[60px]">
          <button
            onClick={()=>{    onCancel?.(); 
                setIsChecked(!isChecked)}}
            className="px-[30px] py-[10px]"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-[70px] py-[10px] rounded-full bg-[#79B833] text-white hover:bg-[#67a12e] transition"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};