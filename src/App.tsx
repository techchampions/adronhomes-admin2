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

// Floating Impersonation Button Component
const ImpersonationFloatingButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isVisible, setIsVisible] = useState(false);
  const [impersonatedName, setImpersonatedName] = useState("");
  const [impersonatedRole, setImpersonatedRole] = useState("");

  useEffect(() => {
    // Check if impersonation is active
    const isImpersonating = sessionStorage.getItem('is_impersonating') === 'true';
    const name = sessionStorage.getItem('impersonated_user_name') || "User";
    const role = sessionStorage.getItem('impersonated_user_role') || "";
    
    // Map role number to role name
    let roleName = "";
    switch(role) {
      case "1": roleName = "Admin"; break;
      case "2": roleName = "Marketer"; break;
      case "3": roleName = "Director"; break;
      case "4": roleName = "Payment"; break;
      case "5": roleName = "HR"; break;
      case "6": roleName = "Legal"; break;
      case "7": roleName = "IT"; break;
      case "8": roleName = "Client"; break;
      default: roleName = "";
    }

    setIsVisible(isImpersonating);
    setImpersonatedName(name);
    setImpersonatedRole(roleName);
  }, [location.pathname]); // Re-check on route changes

  const handleReturnToMaster = () => {
    const originalToken = sessionStorage.getItem('original_token');
    
    if (originalToken) {
      // Restore original token
      Cookies.set('token', originalToken, {
        // expires: 1,
        secure: true,
        sameSite: 'strict'
      });
      
      // Clear impersonation state
      dispatch(clearImpersonation());
      sessionStorage.removeItem('original_token');
      sessionStorage.removeItem('is_impersonating');
      sessionStorage.removeItem('impersonated_user_name');
      sessionStorage.removeItem('impersonated_user_role');
      
      toast.success("Returned to master admin", {
        position: "top-right",
        autoClose: 3000
      });
      
      // Navigate to admin dashboard
      navigate('/personnel', { replace: true });
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
      {/* Icon – always visible */}
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

      {/* Text – hidden → appears on hover with smooth width transition */}
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

    {/* Optional small tooltip / hint when not hovered */}
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
);}

// Custom 404 Handler Component
const NotFoundHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    toast.error("Page does not exist", {
      position: "top-right",
      autoClose: 3000,
      onClose: () => navigate("/")
    });
  }, [navigate]);
  
  return null;
};

const AuthGuard = () => {
  const token = Cookies.get("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

interface AppLayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

const AppLayout = ({ children, hideSidebar = false }: AppLayoutProps) => {
  const location = useLocation();
  const isCareerPage = location.pathname.startsWith("/human-resources");
  const isMarketerRoute = location.pathname.startsWith("/marketer");
  const isDirectorRoute = location.pathname.startsWith("/director");
  const isPayments = location.pathname.startsWith("/payments/");
  const isLegal = location.pathname.startsWith("/legal");
  const client = location.pathname.startsWith("/client/");
  const isinfotech = location.pathname.startsWith("/info-tech");
  
  const shouldShowSidebar = !hideSidebar && 
    location.pathname !== "/" && 
    location.pathname !== "/login-marketer" &&
    !location.pathname.includes("/error-500");

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
      <div className="w-full relative">
        {children}
        {/* Floating Impersonation Button - Shows on all routes when impersonating */}
        <ImpersonationFloatingButton />
      </div>
    </div>
  );
};

// Error page wrapper that maintains the sidebar based on URL
const ErrorPageWrapper = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
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
          <Routes>
            {/* Public Route */}
            <Route path="/" element={
              <AppLayout hideSidebar={true}>
                <Login />
              </AppLayout>
            } />
            <Route path="/login-marketer" element={
              <AppLayout hideSidebar={true}>
                <LoginMarketers />
              </AppLayout>
            } />

            {/* Protected Routes */}
            <Route element={<AuthGuard />}>
              {/* Admin Routes */}
              <Route path="/partnership-requests" element={
                <AppLayout>
                  <ClientsPartnership />
                </AppLayout>
              } />
              <Route path="/dashboard" element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } />
              <Route path="/customers" element={
                <AppLayout>
                  <Customers />
                </AppLayout>
              } />
              <Route path="/payments" element={
                <AppLayout>
                  <Payment />
                </AppLayout>
              } />

              <Route path="/payment/status/:paymentId" element={
                <AppLayout>
                  <PaymentById />
                </AppLayout>
              } />
              <Route path="/properties/property-edith/:id" element={
                <AppLayout>
                  <EditProperty />
                </AppLayout>
              } />
              <Route path="/properties/:id" element={
                <AppLayout>
                  <PropertyDetailsPage />
                </AppLayout>
              } />
              <Route path="/properties" element={
                <AppLayout>
                  <Properties />
                </AppLayout>
              } />
              <Route path="/personnel" element={
                <AppLayout>
                  <Personnel />
                </AppLayout>
              } />
              <Route path="/personnel/:id" element={
                <AppLayout>
                  <PersonnelMarketersDashboard />
                </AppLayout>
              } />
              <Route path="/contracts" element={
                <AppLayout>
                  <Contract />
                </AppLayout>
              } />
              <Route path="/contracts/details/:user_id/:plan_id" element={
                <AppLayout>
                  <ContractInvoice />
                </AppLayout>
              } />
              <Route path="/director/requests-enquiries" element={
                <AppLayout>
                  <RequestsEnquiries />
                </AppLayout>
              } />
              <Route path="/requests-enquiries" element={
                <AppLayout>
                  <RequestsEnquiries />
                </AppLayout>
              } />

              <Route path="/director/requests-enquiries/:id" element={
                <AppLayout>
                  <PropertyEnquiries />
                </AppLayout>
              } />
              <Route path="/requests-enquiries/:id" element={
                <AppLayout>
                  <PropertyEnquiries />
                </AppLayout>
              } />
              <Route path="/notifications" element={
                <AppLayout>
                  <Notifications />
                </AppLayout>
              } />
              <Route path="/settings" element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              } />
              <Route path="/settings/sliders" element={
                <AppLayout>
                  <SliderSettings />
                </AppLayout>
              } />
              <Route path="/settings/reset-password" element={
                <AppLayout>
                  <ResetCard />
                </AppLayout>
              } />
              <Route path="/settings/page-headers" element={
                <AppLayout>
                  <HeaderSettings />
                </AppLayout>
              } />
              <Route path="/settings/page-headers/edit/:id" element={
                <AppLayout>
                  <EditHeaderDetails />
                </AppLayout>
              } />
              <Route path="/settings/page-headers/new" element={
                <AppLayout>
                  <AddHeaderDetails />
                </AppLayout>
              } />
              <Route path="/settings/office-locations" element={
                <AppLayout>
                  <OfficeLocations />
                </AppLayout>
              } />
              <Route path="/settings/site-information" element={
                <AppLayout>
                  <SiteInformationPage />
                </AppLayout>
              } />
              <Route path="/settings/leadership" element={
                <AppLayout>
                  <LeaderShipSettings />
                </AppLayout>
              } />
              <Route path="/settings/testimonials" element={
                <AppLayout>
                  <TestimonialsPage />
                </AppLayout>
              } />
              <Route path="/settings/faqs" element={
                <AppLayout>
                  <FAQs />
                </AppLayout>
              } />
              <Route path="/settings/add-account" element={
                <AppLayout>
                  <AccountDetails />
                </AppLayout>
              } />
              <Route path="/customers/:id" element={
                <AppLayout>
                  <CustomerSinglePage />
                </AppLayout>
              } />
              <Route path="/customers/transactions/:id" element={
                <AppLayout>
                  <UserPayments />
                </AppLayout>
              } />
              <Route path="/customers/payment/:id" element={
                <AppLayout>
                  <UserPaymentsPage />
                </AppLayout>
              } />

              <Route path="/customers/wallet-transactions/:id" element={
                <AppLayout>
                  <WalletTransactionsPage />
                </AppLayout>
              } />
              <Route path="/customers/singlepage/payment" element={
                <AppLayout>
                  <CustomersPayment />
                </AppLayout>
              } />
              <Route path="/properties/form" element={
                <AppLayout>
                  <General />
                </AppLayout>
              } />
              <Route path="/customers/payment/:user_id/:plan_id" element={
                <AppLayout>
                  <Customers_payment />
                </AppLayout>
              } />

              {/* Error 500 Route - No Sidebar */}
              <Route path="/error-500" element={
                <AppLayout hideSidebar={true}>
                  <Error500 />
                </AppLayout>
              } />

              {/* Marketer Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/marketer" element={
                  <AppLayout>
                    <MarketersDashboard />
                  </AppLayout>
                } />
                <Route path="marketer-customer" element={
                  <AppLayout>
                    <MarketerCustomer />
                  </AppLayout>
                } />
                <Route path="marketer-payment/:plan_id/:user_id" element={
                  <AppLayout>
                    <MarketerInvoice />
                  </AppLayout>
                } />
              </Route>

              {/* Director Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/director" element={
                  <AppLayout>
                    <DirectorsDashboard />
                  </AppLayout>
                } />
              </Route>

              {/* Payment Routes */}
              <Route path="/payments" element={<AuthGuard />}>
                <Route path="dashboard" element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                } />
                <Route path="customers" element={
                  <AppLayout>
                    <Customers />
                  </AppLayout>
                } />
                <Route path="payments" element={
                  <AppLayout>
                    <Payment />
                  </AppLayout>
                } />
                <Route path="payments/status/:paymentId" element={
                  <AppLayout>
                    <PaymentById />
                  </AppLayout>
                } />
                <Route path="contracts" element={
                  <AppLayout>
                    <Contract />
                  </AppLayout>
                } />
                <Route path="contracts/details/:user_id/:plan_id" element={
                  <AppLayout>
                    <ContractInvoice />
                  </AppLayout>
                } />
                <Route path="customers/:id" element={
                  <AppLayout>
                    <CustomerSinglePage />
                  </AppLayout>
                } />
                <Route path="customers/transactions/:id" element={
                  <AppLayout>
                    <UserPayments />
                  </AppLayout>
                } />
                <Route path="customers/payment/:id" element={
                  <AppLayout>
                    <UserPaymentsPage />
                  </AppLayout>
                } />
                <Route path="customers/wallet-transactions/:id" element={
                  <AppLayout>
                    <WalletTransactionsPage />
                  </AppLayout>
                } />
                <Route path="customers/singlepage/payment" element={
                  <AppLayout>
                    <CustomersPayment />
                  </AppLayout>
                } />
                <Route path="customers/payment/:user_id/:plan_id" element={
                  <AppLayout>
                    <Customers_payment />
                  </AppLayout>
                } />
              </Route>
            </Route>

            {/* HR Routes */}
            <Route element={<AuthGuard />}>
              <Route path="/human-resources" element={
                <AppLayout>
                  <HRDashboard />
                </AppLayout>
              } />
              <Route path="view-job/:jobId" element={
                <AppLayout>
                  <SingleJob />
                </AppLayout>
              } />
            </Route>

            {/* Legal Routes */}
            <Route path="/legal" element={<AuthGuard />}>
              <Route index element={
                <AppLayout>
                  <Page />
                </AppLayout>
              } />
              <Route path="contracts/details/:user_id/:plan_id" element={
                <AppLayout>
                  <LegalContractInvoice />
                </AppLayout>
              } />
            </Route>

            {/* User wallet */}
            <Route path="wallet-Transactions" element={
              <AppLayout>
                <UserWallet />
              </AppLayout>
            } />

            {/* Client Routes */}
            <Route path="/client" element={<AuthGuard />}>
            <Route index element={<Navigate to="/client/customers" replace />} />
              <Route path="partnership-requests" element={
                <AppLayout>
                  <ClientsPartnership />
                </AppLayout>
              } />
              <Route path="customers" element={
                <AppLayout>
                  <Customers />
                </AppLayout>
              } />
              <Route path="customers/:id" element={
                <AppLayout>
                  <CustomerSinglePage />
                </AppLayout>
              } />
              <Route path="customers/transactions/:id" element={
                <AppLayout>
                  <UserPayments />
                </AppLayout>
              } />
              <Route path="customers/payment/:id" element={
                <AppLayout>
                  <UserPaymentsPage />
                </AppLayout>
              } />
              <Route path="customers/wallet-transactions/:id" element={
                <AppLayout>
                  <WalletTransactionsPage />
                </AppLayout>
              } />
              <Route path="customers/singlepage/payment" element={
                <AppLayout>
                  <CustomersPayment />
                </AppLayout>
              } />
              <Route path="customers/payment/:user_id/:plan_id" element={
                <AppLayout>
                  <Customers_payment />
                </AppLayout>
              } />
              <Route path="contracts" element={
                <AppLayout>
                  <Contract />
                </AppLayout>
              } />
              <Route path="contracts/details/:user_id/:plan_id" element={
                <AppLayout>
                  <ContractInvoice />
                </AppLayout>
              } />
            </Route>

            {/* Info-Tech Route Group */}
            <Route path="/info-tech" element={<AuthGuard />}>
              <Route index element={
                <AppLayout>
                  <Dashboard_It />
                </AppLayout>
              } />
              <Route path="requests-enquiries" element={
                <AppLayout>
                  <RequestsEnquiries />
                </AppLayout>
              } />
              <Route path="requests-enquiries/:id" element={
                <AppLayout>
                  <PropertyEnquiries />
                </AppLayout>
              } />
              <Route path="settings/reset-password" element={
                <AppLayout>
                  <ResetCard />
                </AppLayout>
              } />
              <Route path="settings" element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              } />
              <Route path="settings/sliders" element={
                <AppLayout>
                  <SliderSettings />
                </AppLayout>
              } />
              <Route path="settings/page-headers" element={
                <AppLayout>
                  <HeaderSettings />
                </AppLayout>
              } />
              <Route path="settings/page-headers/edit/:id" element={
                <AppLayout>
                  <EditHeaderDetails />
                </AppLayout>
              } />
              <Route path="settings/page-headers/new" element={
                <AppLayout>
                  <AddHeaderDetails />
                </AppLayout>
              } />
              <Route path="settings/office-locations" element={
                <AppLayout>
                  <OfficeLocations />
                </AppLayout>
              } />
              <Route path="settings/site-information" element={
                <AppLayout>
                  <SiteInformationPage />
                </AppLayout>
              } />
              <Route path="settings/leadership" element={
                <AppLayout>
                  <LeaderShipSettings />
                </AppLayout>
              } />
              <Route path="settings/testimonials" element={
                <AppLayout>
                  <TestimonialsPage />
                </AppLayout>
              } />
              <Route path="settings/faqs" element={
                <AppLayout>
                  <FAQs />
                </AppLayout>
              } />
              <Route path="settings/add-account" element={
                <AppLayout>
                  <AccountDetails />
                </AppLayout>
              } />
            </Route>

            {/* Catch-All Route - Shows Toast and Redirects to Login */}
            <Route path="*" element={<NotFoundHandler />} />
          </Routes>
          
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