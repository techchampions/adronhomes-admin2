import { Form, Formik } from "formik";
import { FormField, PasswordFormField } from "./logininput";
import * as Yup from "yup";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function Login() {
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
    console.log(values);
  };

  return (
    <section className="w-full flex justify-center items-center min-h-screen px-4 sm:px-6 py-6">
      <div className="bg-white w-full max-w-[841px] flex flex-col items-center rounded-[20px] md:rounded-[50px] px-6 sm:px-12 md:px-[233px] py-8 sm:py-12 md:py-[54px]">
        <div>
          <img
            src="/loginlogo.svg"
            alt="loginlogo"
            className="w-16 sm:w-auto"
          />
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
                  <h1 className="text-[#79B833] flex gap-1 items-center text-sm sm:text-[16px] font-[400]">
                    <IoCheckmarkCircle className="w-4 h-4" />
                    Remember me
                  </h1>
                  <p className="text-[#FF4A1B] text-sm sm:text-base font-[400]">
                    Forgot password?
                  </p>
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className="mt-8 sm:mt-[58px] w-full py-3 sm:py-[15px] rounded-[20px] sm:rounded-[30px] bg-[#79B833] h-12 sm:h-[49px] text-center text-xs sm:text-[12px] font-medium text-white disabled:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    {"Log In"}
                  </button>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </section>
  );
}
