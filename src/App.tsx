import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Context
import { PropertyContext, PropertyProvider } from "./MyContext/MyContext";
import { store, RootState, AppDispatch } from "./components/Redux/store";

// Layout Components
import AdminSidebar from "./general/sidebar";
import SideBar from "./marketer/sideNav/SideNav";
import DirectorSideBar from "./marketer/sideNav/DirectorSideNav";
import CarrerSideBar from "./hr/sideNav";
import LegalSideBar from "./Legal/sidenavlegal";
import ClientSidebar from "./components/ClientSideBar";
import PaymentBar from "./components/Payments/PaymentNavBar";

// Pages
import Login from "./components/Login/login";
import Dashboard from "./pages/Dashboard/dashboard";
import Customers from "./pages/Customers/customers";
import Payment from "./pages/Payment/Payment";
import MarketersDashboard from "./marketer/dashboard/page";
import SettingsPage from "./marketer/settingsPage/SettingsPage";
import Transactions from "./pages/Transactions/Transactions";
import Properties from "./pages/Properties/Properties";
import Personnel from "./pages/Personnel/Personnel";
import RequestsEnquiries from "./pages/Requests_Enquiries/Requests_Enquiries";
import Notifications from "./components/Notifications/Notifications";
import Settings from "./components/Settings/Settings";
import CustomerSinglePage from "./pages/Customers/CustomerSinglePage";
import CustomersPayment from "./marketer/Payment/customers_payment";
import General from "./pages/Properties/General";
import { getUser } from "./components/Redux/User/user_Thunk";
import PaymentListComponent from "./pages/Customers/PaymentStatus";
import PaymentById from "./pages/Payment/paymentById";
import InfrastructureFeesModal from "./components/Modals/InfrastructureFeesModal";
import Customers_payment from "./pages/Customers/customers_payment";
import SliderSettings from "./components/Settings/SliderSettings/SliderSettings";
import HeaderSettings from "./components/Settings/HeaderSettings/HeaderSettings";
import EditHeaderDetails from "./components/Settings/HeaderSettings/EditHeaderDetails";
import OfficeLocations from "./components/Settings/Site location/SiteLoactions";
import LeaderShipSettings from "./components/Settings/LeaderShipSettings/LeaderShipSettings";
import AddHeaderDetails from "./components/Settings/HeaderSettings/AddNewHeaderDetails";
import { QueryProvider } from "./utils/hooks/MyQueryProvider";
import AccountDetails from "./components/Settings/AddAccountSettings/AccountDetails";
import DirectorsDashboard from "./director/DirectorDashboard";
import MarketerCustomer from "./marketer/customer/customer";
import HRDashboard from "./hr/page";
import Contract from "./pages/contract/Contract";
import PropertyEnquiries from "./pages/Requests_Enquiries/PropertyEnquiries";
import UserPayments from "./pages/Transactions/Transactions";
import WalletTransactionsPage from "./pages/Transactions/walletTransaction/walletPage";
import ContractInvoice from "./pages/contract/customers_payment";
import SingleJob from "./hr/singleCarrerPage";
import PropertyDetailsPage from "./pages/Properties/PropertyDetailsPage";
import FAQs from "./components/Settings/FAQs/FAQs";
import TestimonialsPage from "./components/Settings/Testimonials/TestimonialsPage";
import SiteInformationPage from "./components/Settings/SiteInformation/SiteInformationPage";
import { useAxiosInterceptor } from "./components/Redux/middleware";
import Error500 from "./components/Error500";
import Error404 from "./components/Error404";
import MarketerInvoice from "./marketer/Payment/customers_payment";
import Page from "./Legal/page";
import LegalContractInvoice from "./Legal/contractDetails";
import Dashboard_It from "./components/ItAdmin/Dashboard_It";
import InfoTechSidebar from "./components/ItAdmin/sideNav";
import ClientsPartnership from "./pages/clients-partnership/ClientsPartnership";
import EditProperty from "./pages/Properties/GeneralEditing";
import LoginMarketers from "./components/Login/loginForMarketers";
import UserWallet from "./pages/UserWallet/UserWallet";
import UserPaymentsPage from "./pages/Transactions/UserPaymentsPage";
import SettingsCard from "./marketer/SettingsCard";
import ResetCard from "./components/Modals/settings/changepassword";
import PersonnelMarketersDashboard from "./pages/Personnel/personnelMarketerPage";
import { clearImpersonation } from "./components/Redux/adminimpersonate/adminimpersonateslice";

// NotFoundRedirect Component - Handles 404 with toast and redirect
const NotFoundRedirect = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    toast.error("Page not found", {
      position: "top-right",
      autoClose: 3000,
      onClose: () => {
        // Redirect to login if no token, otherwise to dashboard
        if (!token) {
          navigate("/");
        } else {
          navigate("/");
        }
      },
    });
  }, [navigate, token]);

  return null;
};

// Floating Impersonation Button Component
const ImpersonationFloatingButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isVisible, setIsVisible] = useState(false);
  const [impersonatedName, setImpersonatedName] = useState("");
  const [impersonatedRole, setImpersonatedRole] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Check if impersonation is active
    const isImpersonating =
      sessionStorage.getItem("is_impersonating") === "true";
    const name = sessionStorage.getItem("impersonated_user_name") || "User";
    const role = sessionStorage.getItem("impersonated_user_role") || "";

    // Map role number to role name
    let roleName = "";
    switch (role) {
      case "1":
        roleName = "Admin";
        break;
      case "2":
        roleName = "Marketer";
        break;
      case "3":
        roleName = "Director";
        break;
      case "4":
        roleName = "Payment";
        break;
      case "5":
        roleName = "HR";
        break;
      case "6":
        roleName = "Legal";
        break;
      case "7":
        roleName = "IT";
        break;
      case "8":
        roleName = "Client";
        break;
      default:
        roleName = "";
    }

    setIsVisible(isImpersonating);
    setImpersonatedName(name);
    setImpersonatedRole(roleName);
  }, [location.pathname]);

  const handleReturnToMaster = () => {
    const originalToken = sessionStorage.getItem("original_token");

    if (originalToken) {
      Cookies.set("token", originalToken, {
        secure: true,
        sameSite: "strict",
      });

      dispatch(clearImpersonation());
      sessionStorage.removeItem("original_token");
      sessionStorage.removeItem("is_impersonating");
      sessionStorage.removeItem("impersonated_user_name");
      sessionStorage.removeItem("impersonated_user_role");

      toast.success("Returned to master admin", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/personnel", { replace: true });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 group">
      <button
        onClick={handleReturnToMaster}
        className="
          flex items-center justify-center gap-2.5
          h-11 rounded-full
          bg-[#79B833] hover:bg-[#79B833]/60
          text-white
          shadow-lg hover:shadow-[#79B833]/40
          transition-all duration-300
          pl-3 pr-3 group-hover:pr-5
          overflow-hidden
        "
      >
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span
          className="
            text-sm font-medium whitespace-nowrap
            max-w-0 group-hover:max-w-[180px]
            opacity-0 group-hover:opacity-100
            transition-all duration-300
          "
        >
          Return to Master
        </span>
      </button>
      <div
        className="
          absolute bottom-full right-0 mb-2.5
          pointer-events-none
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        "
      >
        <div className="bg-gray-900/90 text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap">
          Return to main Admin
        </div>
      </div>
    </div>
  );
};

const AuthGuard = () => {
  const token = Cookies.get("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const isCareerPage = location.pathname.startsWith("/human-resources");
  const isMarketerRoute = location.pathname.startsWith("/marketer");
  const isDirectorRoute = location.pathname.startsWith("/director");
  const isPayments = location.pathname.startsWith("/payments/");
  const isLegal = location.pathname.startsWith("/legal");
  const client = location.pathname.startsWith("/client/");
  const shouldShowSidebar =
    location.pathname !== "/" &&
    location.pathname !== "/login-marketer" &&
    !location.pathname.includes("/error-500") &&
    !location.pathname.includes("/error-404");

  const isinfotech = location.pathname.startsWith("/info-tech");

  return (
    <div className="flex">
      {shouldShowSidebar && (
        <div className="min-h-screen bg-white">
          {isCareerPage ? (
            <CarrerSideBar />
          ) : isMarketerRoute ? (
            <SideBar />
          ) : isDirectorRoute ? (
            <DirectorSideBar />
          ) : isPayments ? (
            <PaymentBar />
          ) : client ? (
            <ClientSidebar />
          ) : isLegal ? (
            <LegalSideBar />
          ) : isinfotech ? (
            <InfoTechSidebar />
          ) : (
            <AdminSidebar />
          )}
        </div>
      )}
      <div className="w-full">
        {children}
        <ImpersonationFloatingButton />
      </div>
    </div>
  );
};

const App = () => {
  const {
    formData,
    isBulk,
    isLandProperty,
    setMedia,
    isInfrastructure,
    setIsCancelInfrastructure,
  } = useContext(PropertyContext)!;
  useAxiosInterceptor();

  return (
    <Provider store={store}>
      <QueryProvider>
        <PropertyProvider>
          <AppLayout>
            <Routes>
              {/* Public Route */}
              <Route path="/" element={<Login />} />
              <Route path="/login-marketer" element={<LoginMarketers />} />

              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                {/* Admin Routes */}
                <Route
                  path="/partnership-requests"
                  element={<ClientsPartnership />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/payments" element={<Payment />} />

                <Route
                  path="/payment/status/:paymentId"
                  element={<PaymentById />}
                />
                <Route
                  path="/properties/property-edith/:id"
                  element={<EditProperty />}
                />
                <Route
                  path="/properties/:id"
                  element={<PropertyDetailsPage />}
                />
                <Route path="/properties" element={<Properties />} />
                <Route path="/personnel" element={<Personnel />} />
                <Route
                  path="/personnel/:id"
                  element={<PersonnelMarketersDashboard />}
                />
                <Route path="/contracts" element={<Contract />} />
                <Route
                  path="/contracts/details/:user_id/:plan_id"
                  element={<ContractInvoice />}
                />
                <Route
                  path="/director/requests-enquiries"
                  element={<RequestsEnquiries />}
                />
                <Route
                  path="/requests-enquiries"
                  element={<RequestsEnquiries />}
                />

                <Route
                  path="/director/requests-enquiries/:id"
                  element={<PropertyEnquiries />}
                />
                <Route
                  path="/requests-enquiries/:id"
                  element={<PropertyEnquiries />}
                />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/sliders" element={<SliderSettings />} />
                <Route
                  path="/settings/reset-password"
                  element={<ResetCard />}
                />
                <Route
                  path="/settings/page-headers"
                  element={<HeaderSettings />}
                />
                <Route
                  path="/settings/page-headers/edit/:id"
                  element={<EditHeaderDetails />}
                />
                <Route
                  path="/settings/page-headers/new"
                  element={<AddHeaderDetails />}
                />
                <Route
                  path="/settings/office-locations"
                  element={<OfficeLocations />}
                />
                <Route
                  path="/settings/site-information"
                  element={<SiteInformationPage />}
                />
                <Route
                  path="/settings/leadership"
                  element={<LeaderShipSettings />}
                />
                <Route
                  path="/settings/testimonials"
                  element={<TestimonialsPage />}
                />
                <Route path="/settings/faqs" element={<FAQs />} />
                <Route
                  path="/settings/add-account"
                  element={<AccountDetails />}
                />
                <Route path="/customers/:id" element={<CustomerSinglePage />} />
                <Route
                  path="/customers/transactions/:id"
                  element={<UserPayments />}
                />
                <Route
                  path="/customers/payment/:id"
                  element={<UserPaymentsPage />}
                />

                <Route
                  path="/customers/wallet-transactions/:id"
                  element={<WalletTransactionsPage />}
                />
                <Route
                  path="/customers/singlepage/payment"
                  element={<CustomersPayment />}
                />
                <Route path="/properties/form" element={<General />} />
                <Route
                  path="/customers/payment/:user_id/:plan_id"
                  element={<Customers_payment />}
                />

                <Route path="/error-500" element={<Error500 />} />

                {/* Marketer Routes */}
                <Route path="/marketer" element={<MarketersDashboard />} />
                <Route
                  path="/marketer-customer"
                  element={<MarketerCustomer />}
                />
                <Route
                  path="/marketer-payment/:plan_id/:user_id"
                  element={<MarketerInvoice />}
                />

                {/* Director Routes */}
                <Route path="/director" element={<DirectorsDashboard />} />

                {/* Payment Routes */}
                <Route path="/payments/dashboard" element={<Dashboard />} />
                <Route path="/payments/customers" element={<Customers />} />
                <Route path="/payments/payments" element={<Payment />} />
                <Route
                  path="/payments/payments/status/:paymentId"
                  element={<PaymentById />}
                />
                <Route path="/payments/contracts" element={<Contract />} />
                <Route
                  path="/payments/contracts/details/:user_id/:plan_id"
                  element={<ContractInvoice />}
                />
                <Route
                  path="/payments/customers/:id"
                  element={<CustomerSinglePage />}
                />
                <Route
                  path="/payments/customers/transactions/:id"
                  element={<UserPayments />}
                />
                <Route
                  path="/payments/customers/payment/:id"
                  element={<UserPaymentsPage />}
                />
                <Route
                  path="/payments/customers/wallet-transactions/:id"
                  element={<WalletTransactionsPage />}
                />
                <Route
                  path="/payments/customers/singlepage/payment"
                  element={<CustomersPayment />}
                />
                <Route
                  path="/payments/customers/payment/:user_id/:plan_id"
                  element={<Customers_payment />}
                />
              </Route>

              {/* HR Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/human-resources" element={<HRDashboard />} />
                <Route
                  path="/human-resources/view-job/:jobId"
                  element={<SingleJob />}
                />
              </Route>

              {/* Legal Routes */}
              <Route path="/legal" element={<AuthGuard />}>
                <Route index element={<Page />} />
                <Route
                  path="/legal/contracts/details/:user_id/:plan_id"
                  element={<LegalContractInvoice />}
                />
              </Route>

              {/* User wallet */}
              <Route path="/wallet-Transactions" element={<UserWallet />} />

              {/* Client Routes */}
              <Route path="/client" element={<AuthGuard />}>
                <Route
                  path="/client"
                  element={<Navigate to="/client/customers" />}
                />
                <Route
                  path="/client/partnership-requests"
                  element={<ClientsPartnership />}
                />
                <Route path="/client/customers" element={<Customers />} />
                <Route
                  path="/client/customers/:id"
                  element={<CustomerSinglePage />}
                />
                <Route
                  path="/client/customers/transactions/:id"
                  element={<UserPayments />}
                />
                <Route
                  path="/client/customers/payment/:id"
                  element={<UserPaymentsPage />}
                />
                <Route
                  path="/client/customers/wallet-transactions/:id"
                  element={<WalletTransactionsPage />}
                />
                <Route
                  path="/client/customers/singlepage/payment"
                  element={<CustomersPayment />}
                />
                <Route
                  path="/client/customers/payment/:user_id/:plan_id"
                  element={<Customers_payment />}
                />
                <Route path="/client/contracts" element={<Contract />} />
                <Route
                  path="/client/contracts/details/:user_id/:plan_id"
                  element={<ContractInvoice />}
                />
              </Route>

              {/* Info-Tech Route Group */}
              <Route path="/info-tech" element={<AuthGuard />}>
                <Route index element={<Dashboard_It />} />
                <Route
                  path="/info-tech/requests-enquiries"
                  element={<RequestsEnquiries />}
                />
                <Route
                  path="/info-tech/requests-enquiries/:id"
                  element={<PropertyEnquiries />}
                />
                <Route
                  path="/info-tech/settings/reset-password"
                  element={<ResetCard />}
                />
                <Route path="/info-tech/settings" element={<Settings />} />
                <Route
                  path="/info-tech/settings/sliders"
                  element={<SliderSettings />}
                />
                <Route
                  path="/info-tech/settings/page-headers"
                  element={<HeaderSettings />}
                />
                <Route
                  path="/info-tech/settings/page-headers/edit/:id"
                  element={<EditHeaderDetails />}
                />
                <Route
                  path="/info-tech/settings/page-headers/new"
                  element={<AddHeaderDetails />}
                />
                <Route
                  path="/info-tech/settings/office-locations"
                  element={<OfficeLocations />}
                />
                <Route
                  path="/info-tech/settings/site-information"
                  element={<SiteInformationPage />}
                />
                <Route
                  path="/info-tech/settings/leadership"
                  element={<LeaderShipSettings />}
                />
                <Route
                  path="/info-tech/settings/testimonials"
                  element={<TestimonialsPage />}
                />
                <Route path="/info-tech/settings/faqs" element={<FAQs />} />
                <Route
                  path="/info-tech/settings/add-account"
                  element={<AccountDetails />}
                />
              </Route>

              {/* 404 Route - This will catch all unmatched routes */}
              <Route path="*" element={<NotFoundRedirect />} />
            </Routes>
          </AppLayout>
          {isInfrastructure && (
            <InfrastructureFeesModal
              isOpen={isInfrastructure}
              onClose={() => setIsCancelInfrastructure(false)}
            />
          )}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </PropertyProvider>
      </QueryProvider>
    </Provider>
  );
};

export default App;
