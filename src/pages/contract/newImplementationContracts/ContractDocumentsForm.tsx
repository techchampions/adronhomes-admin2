// components/ContractDocumentsForm.tsx
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../components/Redux/store";
import {
  AiOutlineUpload,
  AiOutlineDelete,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { MdAdd, MdCheckCircle, MdCancel } from "react-icons/md";
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaRegFile,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
// import { toast, Toaster } from 'react-hot-toast';
import InputField from "../../../components/input/inputtext";
import EnhancedOptionInputField from "../../../components/input/enhancedSelecet";
import ContractDocumentsViewer from "./ContractDocumentsViewer";

import {
  generateContractDocs,
  uploadContractDocs,
  uploadMultipleContractDocs,
  approveContractDocs,
  rejectContractDocs,
  fetchContractDocuments,
  clearError,
  clearSuccess,
  selectIsLoading,
  selectError,
  selectSuccess,
  selectLastResponse,
  selectContractOfSale,
  selectAllocationDocument,
  selectContractDocumentsList,
} from "../../../components/Redux/ContractDocument/contractDocumentsSlice";

import {
  ContractDocument,
  ApiResponse,
} from "../../../components/Redux/ContractDocument/ContractDocument";
import { toast } from "react-toastify";

interface ContractDocumentsFormProps {
  planId?: any;
  onSuccess?: (response: ApiResponse) => void;
  onError?: (error: string) => void;
  initialDocuments?: ContractDocument[];
  readOnly?: boolean;
}

export interface ContractDocumentsHandles {
  handleSubmit: () => Promise<boolean>;
  isValid: boolean;
  values: any;
  resetForm: () => void;
  isSubmitting: boolean;
}

interface FormValues {
  doc_type: "contract_sale" | "general_contract" | "allocation";
  action: "generate" | "upload" | "approve" | "reject";
  documents: ContractDocument[];
  document_id?: string;
}

const ContractDocumentsForm = forwardRef<
  ContractDocumentsHandles,
  ContractDocumentsFormProps
>(
  (
    { planId, onSuccess, onError, initialDocuments = [], readOnly = false },
    ref,
  ) => {
    const dispatch = useDispatch<AppDispatch>();

    // Redux selectors
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);
    const success = useSelector(selectSuccess);
    const lastResponse = useSelector(selectLastResponse);
    const contractOfSale = useSelector(selectContractOfSale);
    const allocationDocument = useSelector(selectAllocationDocument);
    const contractDocumentsList = useSelector(selectContractDocumentsList);

    // Local state
    const [expandedDoc, setExpandedDoc] = useState<number | null>(null);
    const [validationErrors, setValidationErrors] = useState<{
      [key: string]: string;
    }>({});
    const [localSubmitting, setLocalSubmitting] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    const [refreshViewer, setRefreshViewer] = useState(0);
    const [selectedDocType, setSelectedDocType] =
      useState<string>("contract_sale");
    const [selectedAction, setSelectedAction] = useState<string>("generate");

    // Local documents state (only used for general contract uploads)
    const [localDocuments, setLocalDocuments] = useState<ContractDocument[]>(
      initialDocuments.length > 0
        ? initialDocuments
        : [
            {
              id: Date.now(),
              document_name: "",
              document_file: undefined,
              plan_id: planId,
            },
          ],
    );

    // Refs to prevent infinite loops
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);
    const hasHandledSuccessRef = useRef(false);
    const hasHandledErrorRef = useRef(false);
    const lastProcessedResponseRef = useRef<string>("");

    // Update refs
    useEffect(() => {
      onSuccessRef.current = onSuccess;
      onErrorRef.current = onError;
    }, [onSuccess, onError]);

    // Fetch documents on mount
    useEffect(() => {
      if (planId) {
        dispatch(fetchContractDocuments(planId));
      }
    }, [dispatch, planId]);

    // Handle success callback
    useEffect(() => {
      if (success && lastResponse && !hasHandledSuccessRef.current) {
        const responseKey = `${lastResponse.success}_${Date.now()}`;
        if (lastProcessedResponseRef.current !== responseKey) {
          hasHandledSuccessRef.current = true;
          lastProcessedResponseRef.current = responseKey;

          onSuccessRef.current?.(lastResponse);

          setTimeout(() => {
            hasHandledSuccessRef.current = false;
            dispatch(clearSuccess());
          }, 500);
        }
      }
    }, [success, lastResponse, dispatch]);

    // Handle error callback
    useEffect(() => {
      if (error && !hasHandledErrorRef.current) {
        hasHandledErrorRef.current = true;
        onErrorRef.current?.(error);

        setTimeout(() => {
          hasHandledErrorRef.current = false;
          dispatch(clearError());
        }, 500);
      }
    }, [error, dispatch]);

    const docTypeOptions = [
      {
        value: "contract_sale",
        label: "Contract of Sale",
        description: "For property purchase agreements",
      },
      {
        value: "general_contract",
        label: " Other Documents",
        description: "General contracts and agreements",
      },
      {
        value: "allocation",
        label: "Provisional Letter of Allocation",
        description: "PL allocation documents",
      },
    ];

    const actionOptions = [
      {
        value: "generate",
        label: "Generate Documents",
        description: "Create new document from template",
      },
      {
        value: "upload",
        label: "Upload Documents",
        description: "Upload existing documents",
      },
      {
        value: "approve",
        label: "Approve Documents",
        description: "Review and approve documents",
      },
      {
        value: "reject",
        label: "Reject Documents",
        description: "Reject documents with feedback",
      },
    ];
    const getActionOptions = useCallback((docType: string) => {
      // Base options for all document types
      const baseOptions = [
        {
          value: "upload",
          label: "Upload Documents",
          description: "Upload existing documents",
        },
        {
          value: "approve",
          label: "Approve Documents",
          description: "Review and approve documents",
        },
        {
          value: "reject",
          label: "Reject Documents",
          description: "Reject documents with feedback",
        },
      ];

      // Generate is only available for contract_sale and allocation
      if (docType === "contract_sale" || docType === "allocation") {
        return [
          {
            value: "generate",
            label: "Generate Documents",
            description: "Create new document from template",
          },
          ...baseOptions,
        ];
      }

      // For general_contract, only show upload, approve, reject
      return baseOptions;
    }, []);

    const currentActionOptions = useMemo(() => {
      return getActionOptions(selectedDocType);
    }, [selectedDocType, getActionOptions]);
    // Get available documents based on current doc_type
    const getAvailableDocuments = useMemo(() => {
      const currentDocType = selectedDocType;

      if (currentDocType === "contract_sale") {
        return contractOfSale ? [contractOfSale] : [];
      } else if (currentDocType === "allocation") {
        return allocationDocument ? [allocationDocument] : [];
      } else if (currentDocType === "general_contract") {
        return contractDocumentsList || [];
      }
      return [];
    }, [
      selectedDocType,
      contractOfSale,
      allocationDocument,
      contractDocumentsList,
    ]);

    const documentOptions = useMemo(() => {
      const availableDocs = getAvailableDocuments;

      if (!availableDocs || availableDocs.length === 0) {
        return [];
      }

      return availableDocs.map((doc) => ({
        value: doc.id.toString(),
        label: `${doc.document_name} ${doc.is_approved ? "(Approved)" : "(Pending)"}`,
      }));
    }, [getAvailableDocuments]);

    const validationSchema = Yup.object().shape({
      doc_type: Yup.string()
        .oneOf(["contract_sale", "general_contract", "allocation"])
        .required("Document type is required"),
      action: Yup.string()
        .oneOf(
          selectedDocType === "general_contract"
            ? ["upload", "approve", "reject"]
            : ["generate", "upload", "approve", "reject"],
        )
        .required("Action is required"),
      document_id: Yup.string().when("action", {
        is: (val: string) => val === "approve" || val === "reject",
        then: (schema) => schema.required("Please select a document"),
        otherwise: (schema) => schema.notRequired(),
      }),
    });

    const formik = useFormik<FormValues>({
      initialValues: {
        doc_type: "contract_sale",
        action: "generate",
        document_id: "",
        documents: localDocuments,
      },
      enableReinitialize: false,
      validationSchema,
      onSubmit: async (values, { setSubmitting }) => {
        setValidationErrors({});
        setLocalSubmitting(true);

        if (!planId) {
          const errorMsg = "Plan ID is required";
          setValidationErrors({ form: errorMsg });
          toast.error(errorMsg);
          onErrorRef.current?.(errorMsg);
          setLocalSubmitting(false);
          setSubmitting(false);
          return;
        }

        // For approve/reject actions, validate that a document is selected
        if (
          (values.action === "approve" || values.action === "reject") &&
          !values.document_id
        ) {
          const errorMsg = `Please select a ${getDocTypeDisplayName(values.doc_type)} document to ${values.action}`;
          setValidationErrors({ form: errorMsg });
          toast.error(errorMsg);
          setLocalSubmitting(false);
          setSubmitting(false);
          return;
        }

        let loadingToastId: string | undefined;

        try {
          const actionName = values.action;
          const docTypeName = values.doc_type;
          // loadingToastId = toast.loading(`${actionName.charAt(0).toUpperCase() + actionName.slice(1)}ing ${getDocTypeDisplayName(docTypeName)}...`);

          let response: ApiResponse;

          switch (values.action) {
            case "generate":
              response = await dispatch(
                generateContractDocs({
                  doc_type: values.doc_type,
                  plan_id: planId,
                }),
              ).unwrap();

              if (response?.success) {
                toast.success(
                  `${getDocTypeDisplayName(docTypeName)} generated successfully!`,
                );

                // CRITICAL: Refetch documents to update the Redux store
                await dispatch(fetchContractDocuments(planId));

                // Show the viewer and trigger refresh
                setShowViewer(true);
                setRefreshViewer((prev) => prev + 1);
              } else {
                throw new Error(response?.message || "Generation failed");
              }
              break;

            case "upload":
              if (values.doc_type === "general_contract") {
                const validDocuments = localDocuments.filter(
                  (doc) => doc.document_name && doc.document_file,
                );
                if (validDocuments.length === 0) {
                  throw new Error(
                    "At least one document with name and file is required",
                  );
                }
                response = await dispatch(
                  uploadMultipleContractDocs({
                    documents: validDocuments,
                    doc_type: values.doc_type,
                    plan_id: planId,
                  }),
                ).unwrap();
                toast.success(
                  `${validDocuments.length} document(s) uploaded successfully!`,
                );
              } else {
                const file = localDocuments[0]?.document_file;
                if (!file) throw new Error("Please select a file to upload");
                response = await dispatch(
                  uploadContractDocs({
                    doc_type: values.doc_type,
                    document_file: file as File,
                    plan_id: planId,
                  }),
                ).unwrap();
                toast.success(
                  `${getDocTypeDisplayName(docTypeName)} uploaded successfully!`,
                );
              }
              // Refetch documents after upload
              await dispatch(fetchContractDocuments(planId));
              setRefreshViewer((prev) => prev + 1);
              break;

            case "approve":
              if (!values.document_id) {
                throw new Error("Please select a document to approve");
              }
              response = await dispatch(
                approveContractDocs({
                  doc_type: values.doc_type,
                  document_id: values.document_id,
                  plan_id: planId,
                }),
              ).unwrap();
              toast.success(
                `${getDocTypeDisplayName(docTypeName)} approved successfully!`,
              );
              // Refetch documents after approval
              await dispatch(fetchContractDocuments(planId));
              setRefreshViewer((prev) => prev + 1);
              break;

            case "reject":
              if (!values.document_id) {
                throw new Error("Please select a document to reject");
              }
              response = await dispatch(
                rejectContractDocs({
                  doc_type: values.doc_type,
                  document_id: values.document_id,
                  plan_id: planId,
                }),
              ).unwrap();
              toast.success(
                `${getDocTypeDisplayName(docTypeName)} rejected successfully!`,
              );
              // Refetch documents after rejection
              await dispatch(fetchContractDocuments(planId));
              setRefreshViewer((prev) => prev + 1);
              break;
          }

          if (!response?.success) {
            throw new Error(response?.message || "Operation failed");
          }
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : "An unexpected error occurred";
          toast.error(errorMsg);
          onErrorRef.current?.(errorMsg);
        } finally {
          if (loadingToastId) toast.dismiss(loadingToastId);
          setLocalSubmitting(false);
          setSubmitting(false);
        }
      },
    });

    // Local document handlers
    const handleDocumentNameChange = (index: number, value: string) => {
      const newDocuments = [...localDocuments];
      newDocuments[index] = { ...newDocuments[index], document_name: value };
      setLocalDocuments(newDocuments);
      formik.setFieldValue("documents", newDocuments);
    };

    const handleFileSelect = (index: number, file: File) => {
      const newDocuments = [...localDocuments];
      newDocuments[index] = { ...newDocuments[index], document_file: file };
      setLocalDocuments(newDocuments);
      formik.setFieldValue("documents", newDocuments);
      toast.success(`File "${file.name}" selected`);
    };

    const handleRemoveDocument = (index: number) => {
      const newDocuments = localDocuments.filter((_, i) => i !== index);
      setLocalDocuments(newDocuments);
      formik.setFieldValue("documents", newDocuments);
      toast.success("Document removed");
    };

    const handleAddDocument = () => {
      const newDocument: ContractDocument = {
        id: Date.now(),
        document_name: "",
        document_file: undefined,
        plan_id: planId,
      };
      const newDocuments = [...localDocuments, newDocument];
      setLocalDocuments(newDocuments);
      formik.setFieldValue("documents", newDocuments);
      setExpandedDoc(localDocuments.length);
      toast.success("New document added");
    };

    const handleDocTypeChange = useCallback(
      (value: string) => {
        setSelectedDocType(value);
        formik.setFieldValue("doc_type", value);
        formik.setFieldValue("document_id", "");

        // If switching to general_contract, ensure action is not "generate"
        if (value === "general_contract" && selectedAction === "generate") {
          const newAction = "upload";
          setSelectedAction(newAction);
          formik.setFieldValue("action", newAction);
        }

        // Reset documents when doc type changes
        if (value !== "general_contract") {
          const newDocs = [
            {
              id: Date.now(),
              document_name: "",
              document_file: undefined,
              plan_id: planId,
            },
          ];
          setLocalDocuments(newDocs);
          formik.setFieldValue("documents", newDocs);
        } else {
          setLocalDocuments([]);
          formik.setFieldValue("documents", []);
        }

        // Clear any existing validation errors for document_id
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.document_id;
          return newErrors;
        });
      },
      [formik, planId, selectedAction],
    );

    const handleActionChange = useCallback(
      (value: string) => {
        setSelectedAction(value);
        formik.setFieldValue("action", value);
        formik.setFieldValue("document_id", "");
      },
      [formik],
    );

    const toggleDocumentExpand = (index: number) => {
      setExpandedDoc(expandedDoc === index ? null : index);
    };

    const getFileName = (file: File | string | null | undefined): string => {
      if (!file) return "No file selected";
      if (file instanceof File) return file.name;
      return file;
    };

    const getFileIcon = (file: File | string | null | undefined) => {
      if (!file) return <FaRegFile size={20} className="text-gray-400" />;
      const fileName = file instanceof File ? file.name : file;
      const extension = fileName?.split(".").pop()?.toLowerCase();

      if (extension === "pdf")
        return <FaFilePdf size={20} className="text-red-500" />;
      if (extension === "doc" || extension === "docx")
        return <FaFileWord size={20} className="text-blue-500" />;
      if (extension === "jpg" || extension === "jpeg" || extension === "png")
        return <FaFileImage size={20} className="text-green-500" />;
      return <FaRegFile size={20} className="text-gray-400" />;
    };

    const getDocTypeDisplayName = (docTypeValue: string) => {
      switch (docTypeValue) {
        case "contract_sale":
          return "Contract of Sale";
        case "general_contract":
          return "Other Documents";
        case "allocation":
          return "Provisional Letter of Allocation";
        default:
          return "documents";
      }
    };

    useImperativeHandle(ref, () => ({
      handleSubmit: async () => {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          toast.error(`Please fix validation errors`);
          return false;
        }
        await formik.submitForm();
        return formik.isValid;
      },
      isValid: formik.isValid && !localSubmitting && !isLoading,
      values: formik.values,
      resetForm: () => {
        formik.resetForm();
        setSelectedDocType("contract_sale");
        setSelectedAction("generate");
        setLocalDocuments(
          initialDocuments.length > 0
            ? initialDocuments
            : [
                {
                  id: Date.now(),
                  document_name: "",
                  document_file: undefined,
                  plan_id: planId,
                },
              ],
        );
        setValidationErrors({});
        toast.success("Form reset successfully");
      },
      isSubmitting: localSubmitting || isLoading,
    }));

    const renderGeneralContractUpload = () => (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documents <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500">
              Add multiple documents with names and files
            </p>
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={handleAddDocument}
              className="flex items-center gap-2 text-white bg-[#79B833] rounded-[30px] py-2 px-4 hover:bg-[#68a32b] transition-all duration-300 text-sm"
            >
              <MdAdd size={18} />
              <span>Add Document</span>
            </button>
          )}
        </div>

        {localDocuments.length > 0 ? (
          localDocuments.map((doc, index) => (
            <div
              key={doc.id || index}
              className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <div
                  className="flex items-center gap-2 cursor-pointer flex-1"
                  onClick={() => toggleDocumentExpand(index)}
                >
                  <span className="font-medium text-gray-800">
                    Document #{index + 1}
                  </span>
                  {doc.document_name && (
                    <span className="text-sm text-gray-500">
                      - {doc.document_name}
                    </span>
                  )}
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(index)}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                  >
                    <AiOutlineDelete size={18} />
                  </button>
                )}
              </div>

              {(expandedDoc === index || !doc.document_name) && (
                <div className="space-y-3 pl-4 border-l-2 border-[#79B833]">
                  <InputField
                    placeholder="Document name"
                    name={`documents[${index}].document_name`}
                    value={doc.document_name || ""}
                    onChange={(e) =>
                      handleDocumentNameChange(index, e.target.value)
                    }
                    disabled={readOnly}
                    label="Document Name"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document File <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id={`file-${index}`}
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileSelect(index, e.target.files[0])
                      }
                      disabled={readOnly}
                      accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                    />
                    <label
                      htmlFor={`file-${index}`}
                      className={`flex items-center gap-3 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${readOnly ? "bg-gray-100 cursor-not-allowed border-gray-300" : "border-[#79B833] hover:bg-[#79B833]/5"}`}
                    >
                      {getFileIcon(doc.document_file)}
                      <span className="text-sm text-gray-600 flex-1">
                        {doc.document_file
                          ? getFileName(doc.document_file)
                          : "Choose file"}
                      </span>
                      <AiOutlineUpload className="text-[#79B833]" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-gray-500 mb-2">No documents added yet</p>
            <button
              type="button"
              onClick={handleAddDocument}
              className="text-[#79B833] hover:text-[#68a32b] font-medium text-sm"
            >
              + Add your first document
            </button>
          </div>
        )}
      </div>
    );

  const renderSingleFileUpload = () => {
  const existingDocument =
    selectedDocType === "contract_sale"
      ? contractOfSale
      : allocationDocument;
  const hasExistingDocument = !!existingDocument;

  return (
    <div className="space-y-4">
      {hasExistingDocument ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              {getFileIcon(existingDocument.document_name)}
              <div className="flex-1">
                <h4 className="font-medium text-blue-800">
                  Existing Document
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {existingDocument.document_name}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Status:{" "}
                  {existingDocument.is_approved ? "Approved" : "Pending"}
                </p>
                {existingDocument.download_link && (
                  <button
                    onClick={() =>
                      window.open(existingDocument.download_link, "_blank")
                    }
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                  >
                    <FaDownload size={12} /> View Document
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add upload area for new document with warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AiOutlineInfoCircle size={20} className="text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800">
                  Replace Existing Document
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Upload a new {getDocTypeDisplayName(selectedDocType)} document.
                  <span className="font-semibold block mt-1">
                    ⚠️ Warning: This will replace the existing document.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* File upload input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Document File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="single-file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(0, e.target.files[0]);
                }
              }}
              disabled={readOnly}
              accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
            />
            <label
              htmlFor="single-file"
              className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                readOnly
                  ? "bg-gray-100 cursor-not-allowed border-gray-300"
                  : "border-[#79B833] hover:bg-[#79B833]/5"
              }`}
            >
              {getFileIcon(localDocuments[0]?.document_file)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {localDocuments[0]?.document_file
                    ? getFileName(localDocuments[0].document_file)
                    : "Click to select a new file"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>
              <AiOutlineUpload size={24} className="text-[#79B833]" />
            </label>
          </div>

          {/* Show selected file info if any */}
          {localDocuments[0]?.document_file && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                {getFileIcon(localDocuments[0].document_file)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Ready to upload:
                  </p>
                  <p className="text-sm text-green-700">
                    {getFileName(localDocuments[0].document_file)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newDocuments = [...localDocuments];
                    newDocuments[0] = {
                      ...newDocuments[0],
                      document_file: undefined,
                    };
                    setLocalDocuments(newDocuments);
                    formik.setFieldValue("documents", newDocuments);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AiOutlineInfoCircle
                size={20}
                className="text-yellow-500 mt-0.5"
              />
              <div>
                <h4 className="font-medium text-yellow-800">
                  No {getDocTypeDisplayName(selectedDocType)} Document
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  No {getDocTypeDisplayName(selectedDocType)} document exists
                  for this plan. Upload a file to create one.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="single-file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(0, e.target.files[0]);
                }
              }}
              disabled={readOnly}
              accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
            />
            <label
              htmlFor="single-file"
              className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                readOnly
                  ? "bg-gray-100 cursor-not-allowed border-gray-300"
                  : "border-[#79B833] hover:bg-[#79B833]/5"
              }`}
            >
              {getFileIcon(localDocuments[0]?.document_file)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {localDocuments[0]?.document_file
                    ? getFileName(localDocuments[0].document_file)
                    : "Click to select a file"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>
              <AiOutlineUpload size={24} className="text-[#79B833]" />
            </label>
          </div>
        </>
      )}
    </div>
  );
};
    const renderGenerate = () => {
      const existingDocument =
        selectedDocType === "contract_sale"
          ? contractOfSale
          : allocationDocument;
      const hasExistingDocument = !!existingDocument;

      return (
        <div className="space-y-4">
          {hasExistingDocument && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                {getFileIcon(existingDocument.document_name)}
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800">
                    Existing Document
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {existingDocument.document_name}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Status:{" "}
                    {existingDocument.is_approved ? "Approved" : "Pending"}
                  </p>
                  {existingDocument.download_link && (
                    <button
                      onClick={() =>
                        window.open(existingDocument.download_link, "_blank")
                      }
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                    >
                      <FaDownload size={12} /> View Document
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Generating a new document will replace the existing{" "}
                {getDocTypeDisplayName(selectedDocType)} document.
              </p>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AiOutlineInfoCircle
                size={20}
                className="text-green-500 mt-0.5"
              />
              <div>
                <h4 className="font-medium text-green-800">
                  Generate {getDocTypeDisplayName(selectedDocType)}
                </h4>
                <p className="text-sm text-green-600 mt-1">
                  This will generate a new{" "}
                  {getDocTypeDisplayName(selectedDocType)} document based on the
                  plan information.
                </p>
                <p className="text-xs text-green-500 mt-2">
                  {hasExistingDocument
                    ? "⚠️ Warning: This will overwrite the existing document."
                    : "No file selection needed. Click submit to generate."}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderApproveReject = () => {
      const currentDocument =
        selectedDocType === "contract_sale"
          ? contractOfSale
          : allocationDocument;
      const hasDocument = !!currentDocument;
      const isGeneralContract = selectedDocType === "general_contract";
      const currentDocumentId = formik.values.document_id || "";

      // For Contract of Sale and Allocation (single document)
      if (!isGeneralContract) {
        if (!hasDocument) {
          return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AiOutlineInfoCircle
                  size={20}
                  className="text-yellow-500 mt-0.5"
                />
                <div>
                  <h4 className="font-medium text-yellow-800">
                    No Document Available
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    No {getDocTypeDisplayName(selectedDocType)} document exists
                    for this plan.
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    Please generate or upload a{" "}
                    {getDocTypeDisplayName(selectedDocType)} document first.
                  </p>
                </div>
              </div>
            </div>
          );
        }

        // Auto-select the single document
        if (currentDocumentId !== currentDocument.id.toString()) {
          formik.setFieldValue("document_id", currentDocument.id.toString());
        }

        return (
          <div className="space-y-4">
            <div
              className={`rounded-xl p-4 ${
                selectedAction === "approve"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {selectedAction === "approve" ? (
                  <MdCheckCircle size={20} className="text-green-500 mt-0.5" />
                ) : (
                  <MdCancel size={20} className="text-red-500 mt-0.5" />
                )}
                <div>
                  <h4
                    className={`font-medium ${
                      selectedAction === "approve"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {selectedAction === "approve"
                      ? "Approve Document"
                      : "Reject Document"}
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      selectedAction === "approve"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedAction === "approve"
                      ? "Review and approve the submitted document."
                      : "Reject the document and provide feedback if needed."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                {getFileIcon(currentDocument.document_name)}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {currentDocument.document_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ID: {currentDocument.id} | Status:{" "}
                    {currentDocument.is_approved ? "Approved" : "Pending"}
                  </p>
                </div>
                {currentDocument.is_approved ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    <FaCheckCircle size={12} />
                    Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    <FaTimesCircle size={12} />
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }

      // For General Contract (multiple documents)
      const availableDocs = getAvailableDocuments;
      const isDisabled = availableDocs.length === 0;

      return (
        <div className="space-y-4">
          <div
            className={`rounded-xl p-4 ${
              selectedAction === "approve"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {selectedAction === "approve" ? (
                <MdCheckCircle size={20} className="text-green-500 mt-0.5" />
              ) : (
                <MdCancel size={20} className="text-red-500 mt-0.5" />
              )}
              <div>
                <h4
                  className={`font-medium ${
                    selectedAction === "approve"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {selectedAction === "approve"
                    ? "Approve Documents"
                    : "Reject Documents"}
                </h4>
                <p
                  className={`text-sm mt-1 ${
                    selectedAction === "approve"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedAction === "approve"
                    ? "Review and approve the submitted documents."
                    : "Reject documents and provide feedback if needed."}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Document <span className="text-red-500">*</span>
            </label>

            {!isDisabled &&
            availableDocs.length > 0 &&
            documentOptions.length > 0 ? (
              <EnhancedOptionInputField
                placeholder="Select a document to approve/reject"
                name="document_id"
                value={currentDocumentId}
                onChange={(value: string) => {
                  formik.setFieldValue("document_id", value);
                  formik.setFieldTouched("document_id", true);
                }}
                options={documentOptions}
                dropdownTitle={`Available ${getDocTypeDisplayName(selectedDocType)} Documents`}
                error={formik.touched.document_id && formik.errors.document_id}
                isSearchable={true}
                disabled={readOnly || isDisabled}
                label=""
              />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  No {getDocTypeDisplayName(selectedDocType)} documents
                  available
                </p>
                <p className="text-xs text-yellow-700">
                  Please generate or upload a{" "}
                  {getDocTypeDisplayName(selectedDocType)} document first.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <>
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Document Type <span className="text-red-500">*</span>
              </label>
              <EnhancedOptionInputField
                placeholder="Select document type"
                name="doc_type"
                value={selectedDocType}
                onChange={handleDocTypeChange}
                options={docTypeOptions}
                dropdownTitle="Document Types"
                error={
                  formik.touched.doc_type && (formik.errors.doc_type as string)
                }
                isSearchable={false}
                disabled={readOnly}
                label=""
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Action <span className="text-red-500">*</span>
              </label>
              <EnhancedOptionInputField
                placeholder="Select action"
                name="action"
                value={selectedAction}
                onChange={handleActionChange}
                options={currentActionOptions} // Use dynamic options instead of static actionOptions
                dropdownTitle="Actions"
                error={
                  formik.touched.action && (formik.errors.action as string)
                }
                isSearchable={false}
                disabled={readOnly}
                label=""
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Plan ID
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-gray-700">
                  {planId || "No plan ID provided"}
                </p>
              </div>
            </div>

            {selectedAction === "upload" &&
              selectedDocType === "general_contract" &&
              renderGeneralContractUpload()}
            {selectedAction === "upload" &&
              selectedDocType !== "general_contract" &&
              renderSingleFileUpload()}
            {selectedAction === "generate" && renderGenerate()}
            {(selectedAction === "approve" || selectedAction === "reject") &&
              renderApproveReject()}

            {validationErrors.form && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{validationErrors.form}</p>
              </div>
            )}
          </div>

          {showViewer && planId && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#79B833] rounded-full"></span>
                Generated Documents
              </h2>
              <ContractDocumentsViewer
                key={refreshViewer}
                planId={planId}
                refreshTrigger={refreshViewer}
              />
            </div>
          )}
        </div>
      </>
    );
  },
);

ContractDocumentsForm.displayName = "ContractDocumentsForm";

export default ContractDocumentsForm;
