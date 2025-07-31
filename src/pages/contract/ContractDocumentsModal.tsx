import React, { ReactNode, useState, useEffect } from "react";
import { ContractDocument } from "../../components/Redux/Marketer/user_property_plan";
import { toast } from "react-toastify";

import { AppDispatch, RootState } from "../../components/Redux/store";
import Pagination from "../../components/Tables/Pagination";

import { deleteContractDocument } from "../../components/Redux/UpdateContract/deleteContractDocument";
import { fetchUserPropertyPlan } from "../../components/Redux/Marketer/user_property_plan";
import { useDispatch } from "react-redux";
import { fetchContractDocuments } from "../../components/Redux/UpdateContract/viewDocs";
import { resetContractDocuments, selectContractDocumentsPagination, setContractDocumentsPage } from "../../components/Redux/UpdateContract/contractDocumentsSlice";
import { useAppSelector } from "../../components/Redux/hook";

interface ContractDocumentsModalProps {
  onClose: () => void;
  onDocumentDeleted?: (documentId: number) => void;
  plan_id: any;
  user_id: any;
}

export const ContractDocumentsModal: React.FC<ContractDocumentsModalProps> = ({
  onClose,
  onDocumentDeleted,
  plan_id,
  user_id
}) => {
  const [currentDocument, setCurrentDocument] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { data: documents, loading, error } = useAppSelector((state:RootState) => state.ViewcontractDocuments);
  const pagination = useAppSelector(selectContractDocumentsPagination);

  useEffect(() => {
    dispatch(fetchContractDocuments({ planId: plan_id }));
    return () => {
      dispatch(resetContractDocuments());
    };
  }, [dispatch, plan_id]);

  const handlePageChange = (page: number) => {
    dispatch(setContractDocumentsPage(page));
    dispatch(fetchContractDocuments({ planId: plan_id, page }));
  };

  const handleDeleteDocument = async (documentId: number) => {
    setIsDeleting(documentId);
    try {
      const result = await dispatch(deleteContractDocument({ documentId })).unwrap();
      
      if (result.success) {
        toast.success(result.message || 'Document deleted successfully');
        // Refresh the documents list and property plan
        dispatch(fetchContractDocuments({ planId: plan_id, page: pagination.currentPage }));
        dispatch(fetchUserPropertyPlan({ planId: plan_id, userId: user_id }));
        
        if (onDocumentDeleted) {
          onDocumentDeleted(documentId);
        }
      } else {
        toast.error(result.message || 'Failed to delete document');
      }
    } catch (error: unknown) {
      let errorMessage = 'An error occurred while deleting the document';
      if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }
      toast.error(errorMessage);
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading && !documents.length) return <div>Loading documents...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Modal onClose={onClose} title="Contract Documents">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {documents.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No documents available</p>
          ) : (
            documents.map((doc:any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.document_name}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentDocument({
                      url: doc.document_file,
                      name: doc.document_name
                    })}
                    className="p-2 text-gray-500 hover:text-blue-600"
                    title="View document"
                    disabled={isDeleting === doc.id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-2 text-gray-500 hover:text-red-600"
                    title="Delete document"
                    disabled={isDeleting === doc.id}
                  >
                    {isDeleting === doc.id ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Modal>

      {currentDocument && (
        <DocumentViewerModal
          documentUrl={currentDocument.url}
          documentName={currentDocument.name}
          onClose={() => setCurrentDocument(null)}
        />
      )}
    </>
  );
};

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000033] bg-opacity-50">
      <div className="bg-white w-full max-w-2xl max-h-full rounded-[40px] shadow-lg flex flex-col overflow-hidden m-2 sm:m-4">
        
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
          {children}
        </div>
        
      </div>
    </div>
  );
};


export default Modal;





interface DocumentViewerModalProps {
  documentUrl: string;
  documentName: string;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  documentUrl,
  documentName,
  onClose,
}) => {
  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension || '')) {
      return 'image';
    } else if (['pdf'].includes(extension || '')) {
      return 'pdf';
    }
    return 'other';
  };

  const fileType = getFileType(documentUrl);

  return (
    <Modal onClose={onClose} title={documentName}>
      <div className="h-[70vh] flex items-center justify-center">
        {fileType === 'image' ? (
          <img 
            src={documentUrl} 
            alt={documentName}
            className="max-h-full max-w-full object-contain"
          />
        ) : fileType === 'pdf' ? (
          <iframe 
            src={documentUrl}
            className="w-full h-full"
            title={documentName}
          />
        ) : (
          <div className="text-center p-4">
            <p>This file type cannot be previewed.</p>
            <a 
              href={documentUrl} 
              download={documentName}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Download instead
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
};