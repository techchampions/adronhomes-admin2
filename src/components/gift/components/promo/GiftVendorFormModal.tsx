import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCountries,
  fetchCountryStates,
  fetchStateLGAs,
  selectCountryStates,
  selectLoadingStates,
  selectStateLGAs,
} from "../../../Redux/country/countrythunkand slice";
import { AppDispatch, RootState } from "../../../Redux/store";
import EnhancedOptionInputField from "../../../input/enhancedSelecet";
import InputField from "../../../input/inputtext";
import { GiftVendor, GiftVendorPayload } from "../../../Redux/gift/promo/giftVendorSlice";

interface GiftVendorFormModalProps {
  isOpen: boolean;
  title: string;
  submitText: string;
  loading?: boolean;
  initialVendor?: GiftVendor | null;
  onClose: () => void;
  onSubmit: (payload: GiftVendorPayload) => void;
}

const initialForm: GiftVendorPayload = {
  name: "",
  phone: "",
  email: "",
  lga: "",
  address: "",
  state: "",
};

const VENDOR_COUNTRY = "Nigeria";

export default function GiftVendorFormModal({
  isOpen,
  title,
  submitText,
  loading = false,
  initialVendor,
  onClose,
  onSubmit,
}: GiftVendorFormModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<GiftVendorPayload>(initialForm);
  const [touched, setTouched] = useState(false);
  const loadingLocations = useSelector(selectLoadingStates);
  const states = useSelector((state: RootState) =>
    selectCountryStates(state, VENDOR_COUNTRY),
  );
  const lgas = useSelector((state: RootState) =>
    selectStateLGAs(state, VENDOR_COUNTRY, form.state),
  );

  const stateOptions = useMemo(
    () =>
      (states || [])
        .map((state: any) => ({
          value: state.name || "",
          label: state.name || "",
        }))
        .filter((state) => state.value)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [states],
  );

  const lgaOptions = useMemo(
    () =>
      (lgas || [])
        .map((lga: any) => ({
          value: lga.name || "",
          label: lga.name || "",
        }))
        .filter((lga) => lga.value)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [lgas],
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllCountries());
      dispatch(fetchCountryStates(VENDOR_COUNTRY));
      setForm(
        initialVendor
          ? {
              name: initialVendor.name || "",
              phone: initialVendor.phone || "",
              email: initialVendor.email || "",
              lga: initialVendor.lga || "",
              address: initialVendor.address || "",
              state: initialVendor.state || "",
            }
          : initialForm,
      );
      setTouched(false);
    }
  }, [dispatch, initialVendor, isOpen]);

  useEffect(() => {
    if (isOpen && form.state) {
      dispatch(
        fetchStateLGAs({
          countryName: VENDOR_COUNTRY,
          stateName: form.state,
        }),
      );
    }
  }, [dispatch, form.state, isOpen]);

  const formErrors = useMemo(() => {
    const errors: Partial<Record<keyof GiftVendorPayload, string>> = {};
    if (!form.name.trim()) errors.name = "Vendor name is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email";
    }
    if (!form.state.trim()) errors.state = "State is required";
    if (!form.lga.trim()) errors.lga = "LGA is required";
    if (!form.address.trim()) errors.address = "Address is required";
    return errors;
  }, [form]);

  if (!isOpen) return null;

  const handleChange =
    (field: keyof GiftVendorPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);

    if (Object.keys(formErrors).length > 0) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.35)] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-[30px] bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-[350] text-2xl text-dark">{title}</h2>
            <p className="mt-1 font-[325] text-sm text-[#767676]">
              Vendor contact and location details are required for pickup coordination.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <InputField
            label="Vendor Name"
            placeholder="Enter vendor name"
            value={form.name}
            onChange={handleChange("name")}
            error={touched && formErrors.name}
          />
          <InputField
            label="Email"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange("email")}
            type="email"
            error={touched && formErrors.email}
          />
          <InputField
            label="Phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange("phone")}
            error={touched && formErrors.phone}
          />
          <div className="grid grid-cols-2 gap-3">
            <EnhancedOptionInputField
              label="State"
              placeholder={loadingLocations.states ? "Loading states..." : "Select state"}
              value={form.state}
              onChange={(value) => {
                setForm((current) => ({
                  ...current,
                  state: value,
                  lga: "",
                }));
              }}
              options={stateOptions}
              dropdownTitle="States"
              isLoading={loadingLocations.states}
              isSearchable
              error={touched && formErrors.state}
            />
            <EnhancedOptionInputField
              label="LGA"
              placeholder={loadingLocations.lgas ? "Loading LGAs..." : "Select LGA"}
              value={form.lga}
              onChange={(value) => {
                setForm((current) => ({
                  ...current,
                  lga: value,
                }));
              }}
              options={lgaOptions}
              dropdownTitle="LGAs"
              disabled={!form.state}
              isLoading={loadingLocations.lgas}
              isSearchable
              error={touched && formErrors.lga}
            />
          </div>
          <InputField
            label="Address"
            placeholder="Enter pickup address"
            value={form.address}
            onChange={handleChange("address")}
            error={touched && formErrors.address}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 rounded-full px-6 text-sm font-bold text-[#767676] hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-full bg-[#79B833] px-8 text-sm font-bold text-white hover:bg-[#6aa22c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : submitText}
          </button>
        </div>
      </form>
    </div>
  );
}
