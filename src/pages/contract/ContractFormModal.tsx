import { useDispatch } from "react-redux";
import { downloadContract } from "../../components/Redux/UpdateContract/downloadDoc";
import { ContractData } from "../../components/Redux/UpdateContract/viewcontractFormDetails"; // Import the updated interface
import { formatAsNaira } from "../../utils/formatcurrency"; // Keep if needed for other currency fields
import Modal from "./ContractDocumentsModal";

import { toast } from "react-toastify";
import { AppDispatch } from "../../components/Redux/store";

interface ContractModalProps {
  contract: ContractData | null;
  onClose: () => void;
}

// Download SVG icon component
const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const ContractModal: React.FC<ContractModalProps> = ({ contract, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  if (!contract) return null;

  const handleDownloadContract = async () => {
    try {
      const result = await dispatch(downloadContract({ contractId: contract.id })).unwrap();
      
      if (result.success && result.contract_download_link) {
        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = result.contract_download_link;
        link.setAttribute('download', `contract-${contract.unique_contract_id || contract.id}.pdf`); // Fallback for unique_contract_id
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(result.message || 'Failed to download contract');
      }
    } catch (error) {
      toast.error('An error occurred while downloading the contract');
      console.error('Download error:', error);
    }
  };

  // Parse means_of_ids if it's a JSON string
  let parsedMeansOfIds: string[] = [];
  try {
    if (contract.means_of_ids) {
      // Replace escaped backslashes and quotes for proper JSON parsing
      const cleanedJsonString = contract.means_of_ids.replace(/\\"/g, '"').replace(/\\/g, '');
      // Remove leading/trailing quotes if present from the outer string
      const finalJsonString = cleanedJsonString.startsWith('"') && cleanedJsonString.endsWith('"')
        ? cleanedJsonString.substring(1, cleanedJsonString.length - 1)
        : cleanedJsonString;
      
      parsedMeansOfIds = JSON.parse(finalJsonString);
    }
  } catch (e) {
    console.error("Failed to parse means_of_ids:", e);
    parsedMeansOfIds = [];
  }

  return (
    <Modal title={"Purchase Form Details"} onClose={onClose}>
      <div className="p-4 space-y-10">
        {/* Download button at the top */}
        <div className="flex justify-end">
          <button
            onClick={handleDownloadContract}
            className={`text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-auto py-3 px-6 md:px-10 transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4 whitespace-nowrap 
                bg-[#79B833] hover:bg-[#6aa22c]`
            }
          >
            <DownloadIcon />
            Download Contract PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <p><span className="font-medium">Contract ID:</span> {contract.unique_contract_id || 'N/A'}</p>
            <p><span className="font-medium">Customer ID:</span> {contract.contract_customer_id || 'N/A'}</p>
            <p><span className="font-medium">Business Type:</span> {contract.contract_business_type}</p>
            <p><span className="font-medium">Transaction Date:</span> {contract.contract_transaction_date ? new Date(contract.contract_transaction_date).toLocaleDateString() : 'N/A'}</p>
            <p><span className="font-medium">Purpose:</span> {contract.contract_purpose || 'N/A'}</p>
            <p><span className="font-medium">Promo:</span> {contract.contract_promo || 'N/A'}</p>
            <p><span className="font-medium">Quantity:</span> {contract.contract_quantity || 'N/A'}</p> {/* Added quantity */}
            <p><span className="font-medium">Processing Fee:</span> {contract.contract_processing_fee ? formatAsNaira(contract.contract_processing_fee) : 'N/A'}</p> {/* Added processing fee */}
            <p><span className="font-medium">Manual Discount:</span> {contract.contract_manual_discount ? formatAsNaira(contract.contract_manual_discount) : 'N/A'}</p> {/* Added manual discount */}
            <p><span className="font-medium">Termination Charge:</span> {contract.contract_termination_charge ? formatAsNaira(contract.contract_termination_charge) : 'N/A'}</p> {/* Added termination charge */}
          </div>

          {/* Subscriber Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Subscriber Information</h3>
            <p><span className="font-medium">Primary Subscriber:</span> {contract.contract_subscriber_name_1}</p>
            <p><span className="font-medium">Secondary Subscriber:</span> {contract.contract_subscriber_name_2 || 'N/A'}</p>
            <p><span className="font-medium">Tertiary Subscriber:</span> {contract.contract_subscriber_name_3 || 'N/A'}</p>
            <p><span className="font-medium">Additional Name:</span> {contract.contract_additional_name || 'N/A'}</p>
            {/* Marketer fields */}
            <p><span className="font-medium">Main Marketer:</span> {contract.contract_main_marketer || 'N/A'}</p>
            <p><span className="font-medium">Marketer 1:</span> {contract.contract_marketer_1 || 'N/A'}</p>
            <p><span className="font-medium">Marketer 2:</span> {contract.contract_marketer_2 || 'N/A'}</p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><span className="font-medium">Gender:</span> {contract.contract_gender}</p>
            <p><span className="font-medium">Marital Status:</span> {contract.contract_marital_status}</p>
            <p><span className="font-medium">Date of Birth:</span> {new Date(contract.contract_date_of_birth).toLocaleDateString()}</p>
            <p><span className="font-medium">Nationality:</span> {contract.contract_nationality}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Contact Information</h3>
          <p><span className="font-medium">Address:</span> {contract.contract_residential_address}</p>
          <p><span className="font-medium">Town:</span> {contract.contract_town}</p>
          <p><span className="font-medium">State:</span> {contract.contract_state}</p>
          <p><span className="font-medium">Country:</span> {contract.contract_country}</p>
          <p><span className="font-medium">Phone:</span> {contract.contract_sms}</p>
          <p><span className="font-medium">Email:</span> {contract.contract_email}</p>
        </div>

        {/* Employment Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Employment Information</h3>
          <p><span className="font-medium">Employer:</span> {contract.contract_employer}</p>
          <p><span className="font-medium">Occupation:</span> {contract.contract_occupation}</p>
          <p><span className="font-medium">Employer Address:</span> {contract.contract_employer_address}</p>
        </div>

        {/* Next of Kin */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Next of Kin</h3>
          <p><span className="font-medium">Name:</span> {contract.contract_next_of_kin || "N/A"}</p>
          <p><span className="font-medium">Phone:</span> {contract.contract_next_of_kin_phone || "N/A"}</p>
          <p><span className="font-medium">Relationship:</span> {contract.contract_next_of_kin_relationship || "N/A"}</p>
          <p><span className="font-medium">Address:</span> {contract.contract_next_of_kin_address || "N/A"}</p> {/* Added next of kin address */}
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Documents</h3>
          {contract.contract_profile_picture && (
            <div>
              <p className="font-medium">Principal Property Owner:</p>
              <img 
                src={contract.contract_profile_picture} 
                alt="Profile Primary" 
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          {contract.contract_profile_picture_2 && (
            <div>
              <p className="font-medium">Co-Property Owner:</p>
              <img 
                src={contract.contract_profile_picture_2} 
                alt="Profile Secondary" 
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          {parsedMeansOfIds.length > 0 && (
            <div>
              <p className="font-medium">Means of Identification:</p>
              <div className="flex flex-wrap gap-2">
                {parsedMeansOfIds.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Means of ID ${index + 1}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
