// EditProfile.tsx
import { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "../components/input/Button";
// import InputField from "../components/input/inputtext";
import ProfilePictureField from "../components/Modals/ProfilePictureField";
import { selectUser, selectUpdateLoading, selectUpdateError, selectUpdateSuccess, resetUpdateState } from "../components/Redux/profileUpdate/profileSlice";
import { updateUserProfile } from "../components/Redux/profileUpdate/profileThunk";
import { AppDispatch } from "../components/Redux/store";
import SmallLoader from "../components/SmallLoader";
import InputField from "../components/Modals/InputField";

interface EditProfileProps {
  onSuccess?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const user = useSelector(selectUser);
  const updateLoading = useSelector(selectUpdateLoading);
  const updateError = useSelector(selectUpdateError);
  const updateSuccess = useSelector(selectUpdateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Profile updated successfully");
      dispatch(resetUpdateState());
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [updateSuccess, dispatch, onSuccess]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
      dispatch(resetUpdateState());
    }
  }, [updateError, dispatch]);

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <SmallLoader />
      </div>
    );
  }

  const initialValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone_number || "",
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split(' ')[0] : "",
    state: user.state || "",
    country: user.country || "",
    lga: user.lga || "",
    address: user.address || "",
    notification_enabled: user.notification_enabled || 1,
    profilePicture: user.profile_picture || "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    dateOfBirth: Yup.date()
      .nullable()
      .max(new Date(), "Date of birth cannot be in the future")
      .required("Date of birth is required"),
    state: Yup.string(),
    // .required("State is required"),
    lga: Yup.string(),
    // .required("LGA is required"),
    country: Yup.string(),
    // ("Country is required"),
    address: Yup.string()
    // .required("Address is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const formData = new FormData();
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    formData.append("email", values.email);
    formData.append("phone_number", values.phone);
    formData.append("date_of_birth", values.dateOfBirth);
    formData.append("state", values.state);
    formData.append("country", values.country);
    formData.append("lga", values.lga);
    formData.append("address", values.address);
    formData.append("notification_enabled", String(values.notification_enabled));
    
    if (values.profilePicture && typeof values.profilePicture !== "string") {
      formData.append("profile_picture", values.profilePicture);
    }

    dispatch(updateUserProfile({ 
      userId: String(user.id), 
      data: formData 
    }));
  };

  return (
    <div className="px-11 py-11">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className="space-y-4">
            <div className="w-full flex justify-center mb-4">
              <ProfilePictureField
                name="profilePicture"
                // width={120}
                // height={120}
                shape="circle"
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  isRequired={true}
                />
                <InputField
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  isRequired={true}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                  isRequired={true}
                  isReadOnly={true}
                />
                <InputField
                  name="phone"
                  label="Phone"
                  type="tel"
                  placeholder="Enter phone number"
                  isRequired={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={values.dateOfBirth}
                  onChange={(e) => setFieldValue("dateOfBirth", e.target.value)}
                  className={`w-full px-4 py-3 rounded-[30px]  border ${
                    touched.dateOfBirth && errors.dateOfBirth
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
                )}
              </div>

              <h5 className="text-lg font-medium text-gray-700">Address Information</h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  name="country"
                  label="Country"
                  placeholder="Enter country"
                  isRequired={true}
                />
                <InputField
                  name="state"
                  label="State"
                  placeholder="Enter state"
                  isRequired={true}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  name="lga"
                  label="LGA"
                  placeholder="Enter LGA"
                  isRequired={true}
                />
                <InputField
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                  isRequired={true}
                />
              </div>

              {/* <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="notification_enabled"
                  checked={values.notification_enabled === 1}
                  onChange={(e) => setFieldValue("notification_enabled", e.target.checked ? 1 : 0)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-600">
                  Receive email notifications
                </label>
              </div> */}
            </div>

                    <div className="flex items-center gap-4 justify-end pt-4  sticky bottom-3 bg-white w-full">
              <button
            
                className="font-medium px-6 py-4 rounded-[30px] text-base   text-red-500 transition-colors w-1/2"
                onClick={onSuccess}
              >
                Cancel
              </button>
              <Button
                label={updateLoading ? "Saving..." : "Save Changes"}
                className="bg-black text-sm
                 py-4 rounded-[30px]  hover:bg-gray-800 transition-colors w-1/2"
                type="submit"
                isLoading={updateLoading}
                disabled={updateLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProfile;