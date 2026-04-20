// Usage example - App.tsx or parent component
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GiftForm from '../GiftForm';
import { AppDispatch } from '../../Redux/store';
import Header from '../../../general/Header';
import { useNavigate } from 'react-router-dom';

function GiftFormPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [editingGift, setEditingGift] = useState<{ id: string; data: any } | null>(null);
  const navigate = useNavigate();

  // REMOVE this local service - let GiftForm handle submission via Redux
  // const handleSubmit = async (data: any, isEditing: boolean, id?: string) => { ... }

  const handleCancel = () => {
    setEditingGift(null);
  };

  const handleSuccess = () => {
    console.log('Operation successful');
    setEditingGift(null);
    navigate('/gifts'); // Navigate back to gifts list
    // Refresh your gift list or show notification
  };

  return (
    <div className="container mx-auto py-8 bg-white">
      
      <GiftForm
        editingData={editingGift}
        // REMOVE onSubmit prop - this lets GiftForm use Redux thunks
        onCancel={handleCancel}
        onSuccess={handleSuccess}
        isEditingcondition={!!editingGift}
      />
    </div>
  );
}

export default GiftFormPage;