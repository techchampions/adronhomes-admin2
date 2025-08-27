import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCheckmarkCircle } from "react-icons/io5";
import { loginUser } from "../Redux/Login/login_thunk";
import { AppDispatch, RootState } from "../Redux/store";
import { clearError, resetSuccess } from "../Redux/Login/login_slice";
import { getUser } from "../Redux/User/user_Thunk";
import ForgotPasswordModal from "../input/fogotPassword/ForgotPassword";
import { PropertyContext } from "../../MyContext/MyContext";
import { resetOtpPasswordState } from "../Redux/resetPassword/resetPassword_slice";
import { resetOtpState } from "../Redux/resetPassword/sendOtp_slice";
import { FormField, PasswordFormField } from "./logininput";

// Role-to-route mapping
const roleRoutes: Record<number, string> = {
  1: "/dashboard",
  2: "/marketer",
  3: "/director",
  4: "/payments/dashboard",
  5: "/human-resources",
  6:'/legal'
};

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, token, success, message, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { loading: userLoading, success: userSuccess, error: userError, user } =
    useSelector((state: RootState) => state.user);
  const { forgotPassword, setForgotPassword } = useContext(PropertyContext)!;
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .required("Password is required"),
  });

  const onSubmit = async (values: typeof initialValues) => {
    try {
      await dispatch(loginUser(values)).unwrap();
    } catch (err) {}
  };

  // Handle toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (success) {
      toast.success(message || "Login successful!");
      dispatch(getUser());
      dispatch(resetSuccess());
    }
  }, [error, success, message, dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (token) {
      dispatch(getUser());
    }
  }, [token, dispatch]);

  // Handle redirection based on user role or error
  useEffect(() => {
    if (userError) {
      navigate("/");
      return;
    }

    if (userSuccess && user?.role) {
      const route = roleRoutes[user.role] || "/";
      navigate(route, { replace: true });
    }
  }, [userError, userSuccess, user?.role, navigate]);



  return (
    <section className="w-full flex justify-center items-center min-h-screen px-4 sm:px-6 py-6">
      <div className="bg-white w-full max-w-[841px] flex flex-col items-center rounded-[20px] md:rounded-[50px] px-6 sm:px-12 md:px-[233px] py-8 sm:py-12 md:py-[54px] relative">
        <div>
          <img src="/loginlogo.svg" alt="loginlogo" className="w-16 sm:w-auto" />
        </div>
        <p className="text-dark font-bold text-2xl sm:text-3xl md:text-[36px] xl:text-[36px] lg:text-[36px] mt-4 sm:mt-[22px] mb-8 sm:mb-[56px] font-cormorant">
          Admin Login
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <div className="flex w-full">
              <Form className="w-full max-w-[374px]">
                <div className="mb-4 sm:mb-6">
                  <FormField type="text" name="email" placeholder="Email" />
                </div>
                <div className="relative">
                  <PasswordFormField
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                </div>
                <div className="flex justify-between mt-3 sm:mt-4 cursor-pointer">
                  <p
                    className="text-[#FF4A1B] text-sm sm:text-base font-[400]"
                    onClick={() => setForgotPassword(true)}
                  >
                    Forgot password?
                  </p>
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className={`mt-8 sm:mt-[58px] w-full py-3 sm:py-[15px] rounded-[20px] sm:rounded-[30px] bg-[#79B833] h-12 sm:h-[49px] text-center text-xs sm:text-[12px] font-medium text-white disabled:bg-[#6b9933] ${
                      loading || isSubmitting ? "cursor-not-allowed" : ""
                    }`}
                    disabled={loading || isSubmitting}
                  >
                    {loading ? "Logging in..." : "Log In"}
                  </button>
                </div>
              </Form>
            </div>
          )}
        </Formik>
        <div className="absolute top-5 md:right-14 right-0">
          <ForgotPasswordModal
            isOpen={forgotPassword}
            onClose={() => {
              setForgotPassword(false);
              dispatch(resetOtpPasswordState());
              dispatch(resetOtpState());
            }}
          />
        </div>
      </div>
    </section>
  );
}