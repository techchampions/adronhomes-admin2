// pages/ContractDocumentsPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContractDocuments,
  selectContractOfSale,
  selectAllocationDocument,
  selectContractDocumentsList,
  selectIsLoading,
  clearError,
  clearSuccess,
} from "../../../components/Redux/ContractDocument/contractDocumentsSlice";
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
} from "react-icons/fa";
import { MdClose } from "react-icons/md";

import { AppDispatch } from "../../../components/Redux/store";
import NotFound from "../../../components/NotFound";
import { toast } from "react-toastify";
import LoadingAnimations from "../../../components/LoadingAnimations";

interface ContractDocumentsPageProps {
  planId: number;
}

// Cache for downloaded file blobs
const fileBlobCache = new Map<number, { blob: Blob; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const ContractDocumentsPage: React.FC<ContractDocumentsPageProps> = ({
  planId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const contractOfSale = useSelector(selectContractOfSale);
  const allocationDocument = useSelector(selectAllocationDocument);
  const documentsList = useSelector(selectContractDocumentsList);
  const isLoading = useSelector(selectIsLoading);

  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "contract_sale" | "allocation" | "other"
  >("all");

  // Store recently uploaded files in memory
  const recentFilesRef = useRef<Map<number, File>>(new Map());

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
    const extension = fileName?.split(".").pop()?.toLowerCase();
    const iconProps = { size, className: "text-red-500" };

    if (extension === "pdf") return <FaFilePdf {...iconProps} />;
    if (extension === "doc" || extension === "docx")
      return <FaFileWord {...iconProps} className="text-blue-500" />;
    if (extension === "jpg" || extension === "jpeg" || extension === "png")
      return <FaFileImage {...iconProps} className="text-green-500" />;
    return <FaRegFile {...iconProps} className="text-gray-400" />;
  };

  const getFileUrl = (document: any): string | null => {
    let fileUrl = document.download_link || document.document_file;
    if (!fileUrl) return null;
    if (typeof fileUrl === "string") {
      if (
        fileUrl.includes("localhost:8000") ||
        fileUrl.includes("127.0.0.1:8000")
      ) {
        fileUrl = fileUrl.replace(
          "http://localhost:8000",
          "https://adron.microf10.sg-host.com",
        );
        fileUrl = fileUrl.replace(
          "http://127.0.0.1:8000",
          "https://adron.microf10.sg-host.com",
        );
      }
    }
    return fileUrl;
  };

  // Download without server request if file is in cache
  const downloadFromBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownload = async (document: any, documentName: string) => {
    if (downloadingId === document.id) return;

    setDownloadingId(document.id);

    try {
      // Check cache first
      const cached = fileBlobCache.get(document.id);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log("Using cached blob for:", documentName);
        downloadFromBlob(cached.blob, document.document_name || documentName);
        toast.success(`${documentName} downloaded from cache!`);
        setDownloadingId(null);
        return;
      }

      // Check if it's a recently uploaded file
      const recentFile = recentFilesRef.current.get(document.id);
      if (recentFile) {
        console.log("Using recent file for:", documentName);
        downloadFromBlob(recentFile, document.document_name || documentName);
        toast.success(`${documentName} downloaded!`);
        setDownloadingId(null);
        return;
      }

      // If not in cache, we MUST make a server request
      const fileUrl = getFileUrl(document);
      if (!fileUrl) {
        toast.error(`Download link not available for ${documentName}`);
        setDownloadingId(null);
        return;
      }

      const loadingToast = toast.loading(`Downloading ${documentName}...`);

      const response = await fetch(fileUrl);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();

      // Cache the blob for future downloads
      fileBlobCache.set(document.id, { blob, timestamp: Date.now() });

      downloadFromBlob(blob, document.document_name || documentName);

      toast.dismiss(loadingToast);
      toast.success(`${documentName} downloaded successfully!`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Failed to download ${documentName}`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Method to cache a file after upload (call this when upload succeeds)
  const cacheFileAfterUpload = (documentId: number, file: File) => {
    recentFilesRef.current.set(documentId, file);
    // Clear after 10 minutes
    setTimeout(
      () => {
        recentFilesRef.current.delete(documentId);
      },
      10 * 60 * 1000,
    );
  };

  const handlePreview = (document: any) => {
    setSelectedDocument(document);
    const fileUrl = getFileUrl(document);
    if (fileUrl) {
      setPreviewUrl(fileUrl);
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
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const DocumentCard = ({
    document,
    title,
    icon,
  }: {
    document: any;
    title: string;
    icon: React.ReactNode;
    type: string;
  }) => {
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
            <p className="text-sm text-gray-400 mt-2">
              Generate or upload to create
            </p>
          </div>
        </div>
      );
    }

    const hasFileUrl = !!(document.download_link || document.document_file);

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
              <p className="font-semibold text-gray-800 text-lg">
                {document.document_name}
              </p>
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
            {hasFileUrl && (
              <button
                onClick={() => handlePreview(document)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#121212]/87 text-white rounded-[30px] transition-colors"
              >
                <FaEye size={16} />
                View Document
              </button>
            )}
            {hasFileUrl && (
              <button
                onClick={() => handleDownload(document, document.document_name)}
                disabled={downloadingId === document.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#79B833] text-white rounded-[30px] hover:bg-[#68a32b] transition-colors disabled:opacity-50"
              >
                <FaDownload
                  size={16}
                  className={
                    downloadingId === document.id ? "animate-pulse" : ""
                  }
                />
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const OtherDocumentCard = ({ doc, index }: { doc: any; index: number }) => {
    const hasFileUrl = !!(doc.document_file || doc.download_link);

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
            {hasFileUrl && (
              <button
                onClick={() => handlePreview(doc)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Preview"
              >
                <FaEye size={16} />
              </button>
            )}
            {hasFileUrl && (
              <button
                onClick={() => handleDownload(doc, doc.document_name)}
                disabled={downloadingId === doc.id}
                className="p-2 text-[#79B833] hover:bg-[#79B833]/10 rounded-lg transition-colors disabled:opacity-50"
                title="Download"
              >
                <FaDownload
                  size={16}
                  className={downloadingId === doc.id ? "animate-pulse" : ""}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getFilteredDocuments = () => {
    const otherDocs = documentsList || [];
    switch (activeTab) {
      case "contract_sale":
        return { contractOfSale, allocationDocument: null, otherDocs: [] };
      case "allocation":
        return { contractOfSale: null, allocationDocument, otherDocs: [] };
      case "other":
        return { contractOfSale: null, allocationDocument: null, otherDocs };
      default:
        return { contractOfSale, allocationDocument, otherDocs };
    }
  };

  const {
    contractOfSale: filteredContract,
    allocationDocument: filteredAllocation,
    otherDocs: filteredOtherDocs,
  } = getFilteredDocuments();
  const hasAnyDocuments =
    contractOfSale ||
    allocationDocument ||
    (documentsList && documentsList.length > 0);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Contract Documents
            </h1>
            <p className="text-gray-600">Plan ID: {planId}</p>
          </div>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === "all" ? "text-[#79B833] border-b-2 border-[#79B833]" : "text-gray-500 hover:text-gray-700"}`}
              >
                All Documents
              </button>
              <button
                onClick={() => setActiveTab("contract_sale")}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === "contract_sale" ? "text-[#79B833] border-b-2 border-[#79B833]" : "text-gray-500 hover:text-gray-700"}`}
              >
                <div className="flex items-center gap-2">
                  <FaFileContract size={14} />
                  Contract of Sale
                </div>
              </button>
              <button
                onClick={() => setActiveTab("allocation")}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === "allocation" ? "text-[#79B833] border-b-2 border-[#79B833]" : "text-gray-500 hover:text-gray-700"}`}
              >
                <div className="flex items-center gap-2">
                  <FaFileInvoice size={14} />
                  Allocation Letter
                </div>
              </button>
              <button
                onClick={() => setActiveTab("other")}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === "other" ? "text-[#79B833] border-b-2 border-[#79B833]" : "text-gray-500 hover:text-gray-700"}`}
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

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <LoadingAnimations loading={isLoading} />
            </div>
          )}

          {!isLoading && (
            <div className="space-y-6">
              {(activeTab === "all" || activeTab === "contract_sale") && (
                <DocumentCard
                  document={filteredContract}
                  title="Contract of Sale"
                  icon={<FaFileContract size={24} className="text-white" />}
                  type="contract_sale"
                />
              )}
              {(activeTab === "all" || activeTab === "allocation") && (
                <DocumentCard
                  document={filteredAllocation}
                  title="Provisional Letter of Allocation"
                  icon={<FaFileInvoice size={24} className="text-white" />}
                  type="allocation"
                />
              )}
              {(activeTab === "all" || activeTab === "other") &&
                filteredOtherDocs.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FaFileAlt size={24} className="text-white" />
                        <h3 className="text-white font-semibold text-lg">
                          Other Documents
                        </h3>
                        <span className="ml-auto px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                          {filteredOtherDocs.length} document
                          {filteredOtherDocs.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {filteredOtherDocs.map((doc, index) => (
                          <OtherDocumentCard
                            key={doc.id || index}
                            doc={doc}
                            index={index}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              {!isLoading && !hasAnyDocuments && (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                  <LoadingAnimations loading={isLoading} />
                </div>
              )}
              {!isLoading &&
                hasAnyDocuments &&
                !filteredContract &&
                !filteredAllocation &&
                filteredOtherDocs.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-xl shadow-md">
                    <div className="text-6xl mb-4">
                      <NotFound />
                    </div>
                    <p className="text-gray-500 text-lg">No documents found</p>
                    <button
                      onClick={() => setActiveTab("all")}
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

      {selectedDocument && previewUrl && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedDocument.document_name, 24)}
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedDocument.document_name}
                  </h3>
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
              {previewUrl.endsWith(".pdf") ? (
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
                  <p className="mt-4 text-gray-500">
                    Preview not available for this file type
                  </p>
                  <button
                    onClick={() =>
                      handleDownload(
                        selectedDocument,
                        selectedDocument.document_name,
                      )
                    }
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
                onClick={() =>
                  handleDownload(
                    selectedDocument,
                    selectedDocument.document_name,
                  )
                }
                disabled={downloadingId === selectedDocument.id}
                className="px-4 py-2 bg-[#79B833] text-white rounded-lg hover:bg-[#68a32b] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <FaDownload
                  size={16}
                  className={
                    downloadingId === selectedDocument.id ? "animate-pulse" : ""
                  }
                />
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
