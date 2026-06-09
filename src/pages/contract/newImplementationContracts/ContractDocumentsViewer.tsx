// components/ContractDocumentsViewer.tsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../components/Redux/store";
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
  FaDownload,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFileWord,
  FaFileImage,
  FaRegFile,
  FaSync,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

interface ContractDocumentsViewerProps {
  planId: number;
  refreshTrigger?: number;
}

interface Document {
  id: number;
  document_name: string;
  download_link?: string;
  plan_id?: number;
  is_approved?: boolean | number;
  is_generated?: boolean;
  created_at?: string;
  updated_at?: string;
  document_file?: any | string;
}

// Cache for downloaded file blobs
const fileBlobCache = new Map<number, { blob: Blob; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const ContractDocumentsViewer: React.FC<ContractDocumentsViewerProps> = ({
  planId,
  refreshTrigger = 0,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const contractOfSale = useSelector(selectContractOfSale);
  const allocationDocument = useSelector(selectAllocationDocument);
  const documentsList = useSelector(selectContractDocumentsList);
  const isLoading = useSelector(selectIsLoading);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper function to get the correct file URL
  const getFileUrl = (document: Document | null | undefined): string | null => {
    if (!document) return null;

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

  // Download from blob (no server request)
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

  // Optimized download with caching
  const handleDownload = async (document: Document, documentName: string) => {
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

      // If not in cache, fetch from server
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

  const handlePreview = async (document: Document) => {
    setSelectedDocument(document);
    const fileUrl = getFileUrl(document);

    if (fileUrl) {
      setPreviewUrl(fileUrl);
    } else {
      toast.error("Preview not available for this document");
      setPreviewUrl(null);
    }
  };

  const closePreview = () => {
    setSelectedDocument(null);
    setPreviewUrl(null);
  };

  // Fetch documents when planId or refreshTrigger changes
  useEffect(() => {
    if (planId) {
      console.log("Viewer: Fetching documents for planId:", planId);
      dispatch(fetchContractDocuments(planId));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch, planId, refreshTrigger]);

  // Debug effect to log when documents are updated
  useEffect(() => {
    console.log("Viewer: Documents updated:", {
      contractOfSale: contractOfSale
        ? {
            id: contractOfSale.id,
            name: contractOfSale.document_name,
            approved: contractOfSale.is_approved,
          }
        : null,
      allocationDocument: allocationDocument
        ? {
            id: allocationDocument.id,
            name: allocationDocument.document_name,
            approved: allocationDocument.is_approved,
          }
        : null,
      documentsListCount: documentsList?.length || 0,
    });
  }, [contractOfSale, allocationDocument, documentsList]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(fetchContractDocuments(planId));
    setIsRefreshing(false);
    toast.success("Documents refreshed successfully");
  };

  const getFileIcon = (documentName: string) => {
    const extension = documentName?.split(".").pop()?.toLowerCase();

    if (extension === "pdf")
      return <FaFilePdf size={40} className="text-red-500" />;
    if (extension === "doc" || extension === "docx")
      return <FaFileWord size={40} className="text-blue-500" />;
    if (extension === "jpg" || extension === "jpeg" || extension === "png")
      return <FaFileImage size={40} className="text-green-500" />;
    return <FaRegFile size={40} className="text-gray-400" />;
  };

  const getSmallFileIcon = (documentName: string) => {
    const extension = documentName?.split(".").pop()?.toLowerCase();

    if (extension === "pdf")
      return <FaFilePdf size={20} className="text-red-500" />;
    if (extension === "doc" || extension === "docx")
      return <FaFileWord size={20} className="text-blue-500" />;
    if (extension === "jpg" || extension === "jpeg" || extension === "png")
      return <FaFileImage size={20} className="text-green-500" />;
    return <FaRegFile size={20} className="text-gray-400" />;
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
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const DocumentCard = ({
    document,
    title,
  }: {
    document: Document | null | undefined;
    title: string;
  }) => {
    if (!document) {
      return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-gray-400 to-gray-500 px-4 py-3">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
          </div>
          <div className="p-8 text-center">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-gray-500">No {title} document available</p>
            <p className="text-xs text-gray-400 mt-1">
              Generate or upload to create
            </p>
          </div>
        </div>
      );
    }

    const hasFileUrl = !!getFileUrl(document);

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#79B833] to-[#68a32b] px-4 py-3">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            {getFileIcon(document.document_name)}
            <div className="flex-1">
              <p className="font-medium text-gray-800 line-clamp-2">
                {document.document_name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ID: {document.id} | Plan: {document.plan_id}
              </p>
              {document.created_at && (
                <p className="text-xs text-gray-400 mt-1">
                  Created: {formatDate(document.created_at)}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            {getStatusBadge(document.is_approved)}
            <div className="flex gap-2">
              {hasFileUrl && (
                <button
                  onClick={() => handlePreview(document)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Preview"
                >
                  <FaEye size={16} />
                </button>
              )}
              {hasFileUrl && (
                <button
                  onClick={() =>
                    handleDownload(document, document.document_name)
                  }
                  disabled={downloadingId === document.id}
                  className="p-2 text-[#79B833] hover:bg-[#79B833]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Download"
                >
                  <FaDownload
                    size={16}
                    className={
                      downloadingId === document.id ? "animate-pulse" : ""
                    }
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OtherDocumentCard = ({
    doc,
    index,
  }: {
    doc: Document;
    index: number;
  }) => {
    const hasFileUrl = !!getFileUrl(doc);

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-3">
        <div className="flex items-center gap-3">
          {getSmallFileIcon(doc.document_name)}
          <div className="flex-1 min-w-0">
            <p
              className="font-medium text-gray-800 truncate"
              title={doc.document_name}
            >
              {doc.document_name || `Document ${index + 1}`}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(doc.is_approved)}
              <p className="text-xs text-gray-400">
                {formatDate(doc.created_at)}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {hasFileUrl && (
              <button
                onClick={() => handlePreview(doc)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Preview"
              >
                <FaEye size={14} />
              </button>
            )}
            {hasFileUrl && (
              <button
                onClick={() => handleDownload(doc, doc.document_name)}
                disabled={downloadingId === doc.id}
                className="p-1.5 text-[#79B833] hover:bg-[#79B833]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download"
              >
                <FaDownload
                  size={14}
                  className={downloadingId === doc.id ? "animate-pulse" : ""}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const hasDocuments =
    contractOfSale ||
    allocationDocument ||
    (documentsList && documentsList.length > 0);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#79B833] rounded-full"></span>
            Contract Documents
          </h2>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1 text-sm text-[#79B833] hover:text-[#68a32b] transition-colors disabled:opacity-50"
          >
            <FaSync className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentCard document={contractOfSale} title="Contract of Sale" />
          <DocumentCard
            document={allocationDocument}
            title="Provisional Letter of Allocation"
          />
        </div>

        {documentsList && documentsList.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#79B833] rounded-full"></span>
                Other Documents
              </h3>
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                {documentsList.length} document
                {documentsList.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {documentsList.map((doc, index) => (
                <OtherDocumentCard
                  key={doc.id || index}
                  doc={doc}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79B833]"></div>
            <span className="ml-3 text-gray-600">Loading documents...</span>
          </div>
        )}

        {!isLoading && !hasDocuments && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-5xl mb-3">📄</div>
            <p className="text-gray-500">No documents found for this plan</p>
            <p className="text-sm text-gray-400 mt-1">
              Generate or upload documents to see them here
            </p>
          </div>
        )}

        {/* Document Preview Modal */}
        {selectedDocument && previewUrl && (
          <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[30px] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-3">
                  {getSmallFileIcon(selectedDocument.document_name)}
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
                  <MdClose size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-gray-100">
                {previewUrl.endsWith(".pdf") ? (
                  <iframe
                    src={previewUrl}
                    title={selectedDocument.document_name}
                    className="w-full h-full min-h-[500px] rounded-lg bg-white"
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
                    {getFileIcon(selectedDocument.document_name)}
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
                      className="mt-4 px-4 py-2 bg-[#79B833] text-white rounded-lg hover:bg-[#68a32b] transition-colors flex items-center gap-2"
                    >
                      <FaDownload size={14} />
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
                  className="px-4 py-2 bg-[#79B833] text-white rounded-[30px] hover:bg-[#68a32b] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <FaDownload
                    size={14}
                    className={
                      downloadingId === selectedDocument.id
                        ? "animate-pulse"
                        : ""
                    }
                  />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContractDocumentsViewer;
