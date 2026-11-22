import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch } from "../../components/Redux/store";
import {
  EstateUtilityDue,
  fetchEstateUtilityDues,
  setEstateUtilityDue,
} from "../../components/Redux/estate/estateThunk";

interface EstateUtilityDuesPanelProps {
  estateId: number;
}

const chargeTypes: Array<{
  paymentType: "annual_service_charge" | "annual_capital_charge";
  label: string;
}> = [
  {
    paymentType: "annual_service_charge",
    label: "Estate Service Charge",
  },
  {
    paymentType: "annual_capital_charge",
    label: "Estate Capital Charge",
  },
];

export default function EstateUtilityDuesPanel({
  estateId,
}: EstateUtilityDuesPanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [dues, setDues] = useState<EstateUtilityDue[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [savingType, setSavingType] = useState<string | null>(null);

  const loadDues = async () => {
    setLoading(true);
    try {
      const result = await dispatch(
        fetchEstateUtilityDues({ estateId }),
      ).unwrap();
      setDues(result.data || []);
      const nextDrafts: Record<string, string> = {};
      (result.data || []).forEach((item) => {
        nextDrafts[item.payment_type] = String(item.amount_due ?? 0);
      });
      setDrafts(nextDrafts);
    } catch (error: any) {
      toast.error(error?.message || "Could not load utility dues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Number.isFinite(estateId)) {
      loadDues();
    }
  }, [estateId]);

  const handleSave = async (
    paymentType: "annual_service_charge" | "annual_capital_charge",
  ) => {
    const amountDue = Number(drafts[paymentType] || 0);
    if (!Number.isFinite(amountDue) || amountDue < 0) {
      toast.error("Enter a valid amount due");
      return;
    }

    setSavingType(paymentType);
    try {
      const result = await dispatch(
        setEstateUtilityDue({
          estateId,
          paymentType,
          amountDue,
        }),
      ).unwrap();
      toast.success(result.message || "Amount due updated");
      await loadDues();
    } catch (error: any) {
      toast.error(error?.message || "Could not update amount due");
    } finally {
      setSavingType(null);
    }
  };

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm mb-6">
      <div className="mb-4">
        <h2 className="font-[350] text-lg text-[#272727]">
          Estate Utility Amounts Due
        </h2>
        <p className="mt-1 text-sm text-[#767676]">
          Set the service and capital charge amounts due for residents of this
          estate. Residents can pay any portion of their outstanding balance.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-[#767676]">Loading amounts due...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {chargeTypes.map((charge) => {
            const current = dues.find(
              (item) => item.payment_type === charge.paymentType,
            );
            return (
              <div
                key={charge.paymentType}
                className="rounded-2xl border border-gray-100 p-4"
              >
                <p className="font-medium text-[#272727]">{charge.label}</p>
                <p className="mt-1 text-xs text-[#888888]">
                  Current due: ₦
                  {Number(current?.amount_due || 0).toLocaleString()}
                </p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={drafts[charge.paymentType] ?? "0"}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [charge.paymentType]: event.target.value,
                      }))
                    }
                    className="h-11 flex-1 rounded-full border border-gray-200 px-4 text-sm outline-none focus:border-[#79B833]"
                    placeholder="Amount due"
                  />
                  <button
                    type="button"
                    disabled={savingType === charge.paymentType}
                    onClick={() => handleSave(charge.paymentType)}
                    className="h-11 rounded-full bg-[#032147] px-5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {savingType === charge.paymentType ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
