// ParentComponent.tsx
import React, { useRef } from "react";
import ContractDocumentsForm, {
  ContractDocumentsHandles,
} from "./ContractDocumentsForm";

const ParentComponent = ({planId}: {planId: number}) => {
  const formRef = useRef<ContractDocumentsHandles>(null);

  const handleFormSubmit = async () => {
    if (formRef.current) {
      const isValid = await formRef.current.handleSubmit();
      if (isValid) {
        console.log("Form submitted successfully");
      } else {
        console.log("Form validation failed");
      }
    }
  };

  const handleSuccess = (response: any) => {
    console.log("Operation successful:", response);
  };

  const handleError = (error: string) => {
    console.error("Operation failed:", error);
  };

  return (
    <div className="m-6 p-6 bg-white rounded-[30px] shadow-md">
      <h1 className="text-2xl font-bold mb-6">Contract Documents Manager</h1>

      <ContractDocumentsForm
        ref={formRef}
        planId={planId}
        onSuccess={handleSuccess}
        onError={handleError}
        initialDocuments={[]}
      />

      <div className="mt-6 w-full">
        <div className="mt-6 flex gap-4 w-[60%] justify-end ml-auto">
          <button
            onClick={handleFormSubmit}
            disabled={formRef.current?.isSubmitting || false}
            className="bg-[#79B833] border-2 rounded-[30px] w-full text-white text-base font-semibold border-[#79B833] disabled:opacity-50 disabled:cursor-not-allowed py-2 px-6 transition duration-300"
          >
            {formRef.current?.isSubmitting ? "Processing..." : "Submit"}
          </button>

          <button
            onClick={() => formRef.current?.resetForm()}
            disabled={formRef.current?.isSubmitting || false}
            className="w-full text-[#79B833] border-2 rounded-[30px] border-[#79B833] bg-transparent text-base font-semibold py-2 px-6 transition duration-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentComponent;