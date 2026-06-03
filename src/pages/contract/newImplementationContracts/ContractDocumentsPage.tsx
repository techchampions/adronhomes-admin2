// pages/ContractDocumentsPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch } from '../../components/Redux/store';
import {
  fetchContractDocuments,
  downloadContractDocument,
  selectContractOfSale,
  selectAllocationDocument,
  selectContractDocumentsList,
  selectIsLoading,
  clearError,
  clearSuccess,
} from '../../../components/Redux/ContractDocument/contractDocumentsSlice';
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaRegFile,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaFileContract,
  FaFileAlt,
  FaFileInvoice,
} from 'react-icons/fa';
import { MdClose, MdDescription } from 'react-icons/md';

import { AppDispatch } from '../../../components/Redux/store';
import NotFound from '../../../components/NotFound';
import { toast } from "react-toastify";
import LoadingAnimations from '../../../components/LoadingAnimations';

interface ContractDocumentsPageProps {
  planId: number;
}

const ContractDocumentsPage: React.FC<ContractDocumentsPageProps> = ({ planId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const contractOfSale = useSelector(selectContractOfSale);
  const allocationDocument = useSelector(selectAllocationDocument);
  const documentsList = useSelector(selectContractDocumentsList);
  const isLoading = useSelector(selectIsLoading);

  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'contract_sale' | 'allocation' | 'other'>('all');

  useEffect(() => {
    if (planId) {
      dispatch(fetchContractDocuments(planId));
    }
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch, planId]);

  const getFileIcon = (fileName: string, size: number = 40) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    const iconProps = { size, className: 'text-red-500' };

    if (extension === 'pdf') return <FaFilePdf {...iconProps} />;
    if (extension === 'doc' || extension === 'docx') return <FaFileWord {...iconProps} className="text-blue-500" />;
    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') return <FaFileImage {...iconProps} className="text-green-500" />;
    return <FaRegFile {...iconProps} className="text-gray-400" />;
  };

  const handleDownload = async (documentId: number, documentName: string) => {
    if (downloadingId === documentId) return;

    setDownloadingId(documentId);
    // const toastId = toast.loading(`Downloading ${documentName}...`);

    try {
      await dispatch(downloadContractDocument(documentId)).unwrap();
      toast.success(`${documentName} downloaded successfully!`);
    } catch (error) {
      toast.error(`Failed to download ${documentName}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = (document: any) => {
    setSelectedDocument(document);
    if (document.download_link || document.document_file) {
      let previewLink = document.download_link || document.document_file;
      if (previewLink.includes('localhost:8000') || previewLink.includes('127.0.0.1:8000')) {
        previewLink = previewLink.replace('http://localhost:8000', 'https://adron.microf10.sg-host.com');
        previewLink = previewLink.replace('http://127.0.0.1:8000', 'https://adron.microf10.sg-host.com');
      }
      setPreviewUrl(previewLink);
    }
  };

  const closePreview = () => {
    setSelectedDocument(null);
    setPreviewUrl(null);
  };

  const getStatusBadge = (isApproved: boolean | number | undefined) => {
    const approved = isApproved === true || isApproved === 1;
    return approved ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        <FaCheckCircle size={12} />
        Approved
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
        <FaTimesCircle size={12} />
        Pending
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const DocumentCard = ({ document, title, icon, type }: { document: any; title: string; icon: React.ReactNode; type: string }) => {
    if (!document) {
      return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-gray-400 to-gray-500 px-6 py-4">
            <div className="flex items-center gap-3">
              {icon}
              <h3 className="text-white font-semibold text-lg">{title}</h3>
            </div>
          </div>
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-500">No {title} document available</p>
            <p className="text-sm text-gray-400 mt-2">Generate or upload to create</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-[#79B833] to-[#68a32b] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon}
              <h3 className="text-white font-semibold text-lg">{title}</h3>
            </div>
            {getStatusBadge(document.is_approved)}
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            {getFileIcon(document.document_name, 48)}
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-lg">{document.document_name}</p>
              <p className="text-sm text-gray-500 mt-1">
                ID: {document.id} | Plan: {document.plan_id}
              </p>
              {document.created_at && (
                <p className="text-xs text-gray-400 mt-2">
                  Created: {formatDate(document.created_at)}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            {document.download_link && (
              <button
                onClick={() => handlePreview(document)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#121212]/87 text-white rounded-[30px] transition-colors"
              >
                <FaEye size={16} />
                View Document
              </button>
            )}
            <button
              onClick={() => handleDownload(document.id, document.document_name)}
              disabled={downloadingId === document.id}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#79B833] text-white rounded-[30px] hover:bg-[#68a32b] transition-colors disabled:opacity-50"
            >
              <FaDownload size={16} className={downloadingId === document.id ? 'animate-pulse' : ''} />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  const OtherDocumentCard = ({ doc, index }: { doc: any; index: number }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          {getFileIcon(doc.document_name, 32)}
          <div className="flex-1 min-w-0">
            <p
              className="font-medium text-gray-800 truncate"
              title={doc.document_name}
            >
              {doc.document_name || `Document ${index + 1}`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(doc.is_approved)}
              <p className="text-xs text-gray-400">
                {formatDate(doc.created_at)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {doc.document_file && (
              <button
                onClick={() => handlePreview(doc)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Preview"
              >
                <FaEye size={16} />
              </button>
            )}
            <button
              onClick={() => handleDownload(doc.id, doc.document_name)}
              disabled={downloadingId === doc.id}
              className="p-2 text-[#79B833] hover:bg-[#79B833]/10 rounded-lg transition-colors disabled:opacity-50"
              title="Download"
            >
              <FaDownload
                size={16}
                className={downloadingId === doc.id ? "animate-pulse" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getFilteredDocuments = () => {
    const otherDocs = documentsList || [];
    switch (activeTab) {
      case 'contract_sale':
        return { contractOfSale, allocationDocument: null, otherDocs: [] };
      case 'allocation':
        return { contractOfSale: null, allocationDocument, otherDocs: [] };
      case 'other':
        return { contractOfSale: null, allocationDocument: null, otherDocs };
      default:
        return { contractOfSale, allocationDocument, otherDocs };
    }
  };

  const { contractOfSale: filteredContract, allocationDocument: filteredAllocation, otherDocs: filteredOtherDocs } = getFilteredDocuments();
  const hasAnyDocuments = contractOfSale || allocationDocument || (documentsList && documentsList.length > 0);

  return (
    <>
     
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Contract Documents</h1>
            <p className="text-gray-600">Plan ID: {planId}</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'text-[#79B833] border-b-2 border-[#79B833]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Documents
              </button>
              <button
                onClick={() => setActiveTab('contract_sale')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'contract_sale'
                    ? 'text-[#79B833] border-b-2 border-[#79B833]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaFileContract size={14} />
                  Contract of Sale
                </div>
              </button>
              <button
                onClick={() => setActiveTab('allocation')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'allocation'
                    ? 'text-[#79B833] border-b-2 border-[#79B833]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaFileInvoice size={14} />
                  Allocation Letter
                </div>
              </button>
              <button
                onClick={() => setActiveTab('other')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'other'
                    ? 'text-[#79B833] border-b-2 border-[#79B833]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaFileAlt size={14} />
                  Other Documents
                  {documentsList && documentsList.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">
                      {documentsList.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              < LoadingAnimations loading={isLoading} />
            </div>
          )}

          {/* Documents Grid */}
          {!isLoading && (
            <div className="space-y-6">
              {/* Contract of Sale Section */}
              {(activeTab === 'all' || activeTab === 'contract_sale') && (
                <DocumentCard
                  document={filteredContract}
                  title="Contract of Sale"
                  icon={<FaFileContract size={24} className="text-white" />}
                  type="contract_sale"
                />
              )}

              {/* Allocation Document Section */}
              {(activeTab === 'all' || activeTab === 'allocation') && (
                <DocumentCard
                  document={filteredAllocation}
                  title="Provisional Letter of Allocation"
                  icon={<FaFileInvoice size={24} className="text-white" />}
                  type="allocation"
                />
              )}

              {/* Other Documents Section */}
              {(activeTab === 'all' || activeTab === 'other') && filteredOtherDocs.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FaFileAlt size={24} className="text-white" />
                      <h3 className="text-white font-semibold text-lg">Other Documents</h3>
                      <span className="ml-auto px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                        {filteredOtherDocs.length} document{filteredOtherDocs.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {filteredOtherDocs.map((doc, index) => (
                        <OtherDocumentCard key={doc.id || index} doc={doc} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !hasAnyDocuments && (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                  <LoadingAnimations loading={isLoading}/>
                </div>
              )}

              {/* No Results for Filter */}
              {!isLoading && hasAnyDocuments && 
               !filteredContract && !filteredAllocation && filteredOtherDocs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                  <div className="text-6xl mb-4"><NotFound/></div>
                  <p className="text-gray-500 text-lg">No documents found</p>
                  <button
                    onClick={() => setActiveTab('all')}
                    className="mt-4 px-4 py-2 text-[#79B833] hover:text-[#68a32b] font-medium"
                  >
                    View all documents
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {selectedDocument && previewUrl && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedDocument.document_name, 24)}
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedDocument.document_name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {getStatusBadge(selectedDocument.is_approved)}
                  </p>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MdClose size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              {previewUrl.endsWith('.pdf') ? (
                <iframe
                  src={previewUrl}
                  title={selectedDocument.document_name}
                  className="w-full h-full min-h-[600px] rounded-lg bg-white"
                  frameBorder="0"
                />
              ) : previewUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={previewUrl}
                  alt={selectedDocument.document_name}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                  {getFileIcon(selectedDocument.document_name, 64)}
                  <p className="mt-4 text-gray-500">Preview not available for this file type</p>
                  <button
                    onClick={() => handleDownload(selectedDocument.id, selectedDocument.document_name)}
                    className="mt-4 px-6 py-2 bg-[#79B833] text-white rounded-lg hover:bg-[#68a32b] transition-colors flex items-center gap-2"
                  >
                    <FaDownload size={16} />
                    Download to view
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={closePreview}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedDocument.id, selectedDocument.document_name)}
                disabled={downloadingId === selectedDocument.id}
                className="px-4 py-2 bg-[#79B833] text-white rounded-lg hover:bg-[#68a32b] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <FaDownload size={16} className={downloadingId === selectedDocument.id ? 'animate-pulse' : ''} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContractDocumentsPage;