import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AppDispatch } from "../../components/Redux/store";
import { assignUsersToEstate } from "../../components/Redux/estate/estateThunk";

interface AddEstateClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  estateId: number;
  propertySlug?: string;
  estateName?: string;
  onAssigned?: () => void;
}

const emailBoundaryTlds = [
  "com.ng",
  "co.uk",
  "org.ng",
  "net.ng",
  "edu.ng",
  "gov.ng",
  "com",
  "net",
  "org",
  "edu",
  "gov",
  "co",
  "io",
  "ai",
  "app",
  "dev",
  "ng",
  "uk",
];

const boundaryPattern = new RegExp(
  `\\.(${emailBoundaryTlds
    .map((tld) => tld.replace(".", "\\."))
    .join("|")})(?=[A-Z0-9._%+-]+@)`,
  "gi",
);

const parseEmails = (value: string) => {
  const normalisedValue = value
    .replace(boundaryPattern, ".$1 ")
    .replace(/[;,]+/g, " ");
  const matches = normalisedValue.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  );

  return Array.from(
    new Set((matches || []).map((email) => email.toLowerCase())),
  );
};

export default function AddEstateClientsModal({
  isOpen,
  onClose,
  estateId,
  propertySlug,
  estateName,
  onAssigned,
}: AddEstateClientsModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [emailPaste, setEmailPaste] = useState("");
  const [assigning, setAssigning] = useState(false);

  const parsedEmails = useMemo(() => parseEmails(emailPaste), [emailPaste]);

  const reset = () => {
    setEmailPaste("");
    setAssigning(false);
  };

  const handleClose = () => {
    if (assigning) return;
    reset();
    onClose();
  };

  const handleAssign = async () => {
    if (parsedEmails.length === 0) {
      toast.warning("Please paste at least one valid customer email");
      return;
    }

    setAssigning(true);

    try {
      const response = await dispatch(
        assignUsersToEstate({
          estateId,
          propertySlug,
          emails: parsedEmails,
        }),
      ).unwrap();

      const summary = response.data?.summary;
      toast.success(
        summary
          ? `Processed ${summary.total_processed}: ${summary.added} added, ${summary.failed} failed`
          : response.message || "Clients added to estate",
      );
      onAssigned?.();
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add clients to estate");
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-label="Close add client modal"
      />

      <div className="relative bg-white rounded-[30px] w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-[350] text-2xl text-dark">Add Client</h2>
            <p className="font-[325] text-sm text-[#767676] mt-1">
              Paste customer emails to add them to {estateName || "this estate"}.
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={assigning}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
          >
            <FaXmark />
          </button>
        </div>

        <div className="px-6 md:px-8 py-4 grid sm:grid-cols-2 gap-3 bg-[#F8F8F8]">
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-[#767676]">Emails Detected</p>
            <p className="font-[350] text-2xl text-[#79B833]">
              {parsedEmails.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <p className="text-xs text-[#767676]">Estate</p>
            <p className="font-[350] text-sm text-dark truncate">
              {estateName || `Estate ${estateId}`}
            </p>
          </div>
          
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
            <section className="border border-gray-200 rounded-3xl p-5">
              <h3 className="font-[350] text-lg text-dark">Paste Emails</h3>
              <p className="font-[325] text-xs text-[#767676] mt-1 mb-4">
                Commas, spaces, tabs, new lines, and back-to-back emails are
                supported.
              </p>
              <textarea
                value={emailPaste}
                onChange={(event) => setEmailPaste(event.target.value)}
                placeholder="israel.akinsola2@adronhomes.comcaleb.oluwatimilehin1@adronhomes.com"
                disabled={assigning}
                className="w-full min-h-[330px] rounded-2xl bg-[#F6F6F8] p-4 text-sm outline-none resize-none disabled:opacity-60"
              />
            </section>

            <section className="border border-gray-200 rounded-3xl overflow-hidden flex flex-col min-h-[420px]">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-[350] text-lg text-dark">
                  Emails To Submit
                </h3>
                <p className="font-[325] text-xs text-[#767676] mt-1">
                  {parsedEmails.length} customer
                  {parsedEmails.length === 1 ? "" : "s"} ready to add.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[390px]">
                {parsedEmails.length === 0 ? (
                  <div className="h-full min-h-[260px] flex items-center justify-center px-6 text-center">
                    <p className="font-[325] text-sm text-[#767676]">
                      Detected emails will appear here before submission.
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-100">
                      {parsedEmails.map((email, index) => (
                        <tr key={email} className="hover:bg-gray-50">
                          <td className="py-4 pl-5 pr-3 w-12">
                            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#EAF7EA] px-2 text-xs font-[350] text-[#2E7D32]">
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-4 pr-5">
                            <p className="font-[350] text-sm text-dark break-all">
                              {email}
                            </p>
                            {/* <p className="font-[325] text-xs text-[#767676]">
                              users[{index}]
                            </p> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="px-6 md:px-8 py-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={assigning}
            className="h-11 rounded-full border border-gray-300 px-6 text-sm font-bold text-dark hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={assigning || parsedEmails.length === 0}
            className="h-11 rounded-full bg-[#79B833] px-6 text-sm font-bold text-white hover:bg-[#6aa22c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning
              ? "Adding..."
              : `Add ${parsedEmails.length} Client${
                  parsedEmails.length === 1 ? "" : "s"
                }`}
          </button>
        </div>
      </div>
    </div>
  );
}
