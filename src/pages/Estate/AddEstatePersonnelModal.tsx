import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AppDispatch } from "../../components/Redux/store";
import { createEstatePersonnel } from "../../components/Redux/estate/estateThunk";

interface AddEstatePersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  estateId: number;
  estateName?: string;
}

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  role: "9",
};

export default function AddEstatePersonnelModal({
  isOpen,
  onClose,
  estateId,
  estateName,
}: AddEstatePersonnelModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (name: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleClose = () => {
    if (submitting) return;
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.phone_number ||
      !form.password ||
      !form.role
    ) {
      toast.warning("Please fill all personnel fields");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    setSubmitting(true);

    try {
      const response = await dispatch(
        createEstatePersonnel({ estateId, credentials: formData }),
      ).unwrap();
      toast.success(response.message || "Personnel created successfully");
      setForm(initialForm);
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create personnel");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-[30px] w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between gap-4">
          <div>
            <h2 className="font-[350] text-2xl text-dark">Add Personnel</h2>
            <p className="font-[325] text-sm text-[#767676] mt-1">
              Create personnel for {estateName || "this estate"}.
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
          >
            <FaXmark />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="font-[325] text-sm text-[#767676]">
                First Name
              </span>
              <input
                value={form.first_name}
                onChange={(event) => updateField("first_name", event.target.value)}
                className="w-full h-11 rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="font-[325] text-sm text-[#767676]">
                Last Name
              </span>
              <input
                value={form.last_name}
                onChange={(event) => updateField("last_name", event.target.value)}
                className="w-full h-11 rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="font-[325] text-sm text-[#767676]">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="w-full h-11 rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="font-[325] text-sm text-[#767676]">
                Phone Number
              </span>
              <input
                value={form.phone_number}
                onChange={(event) =>
                  updateField("phone_number", event.target.value)
                }
                className="w-full h-11 rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="font-[325] text-sm text-[#767676]">
                Password
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                className="w-full h-11 rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="font-[325] text-sm text-[#767676]">Role</span>
              <input
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                className="w-full h-11 rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="h-11 rounded-full border border-gray-300 px-6 text-sm font-bold text-dark hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-full bg-[#79B833] px-6 text-sm font-bold text-white hover:bg-[#6aa22c] disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Personnel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
