import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { ReactNode, useContext } from "react";

// Context
import { PropertyContext, PropertyProvider } from "./MyContext/MyContext";
import { store } from "./components/Redux/store";

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
// import General from "./pages/Properties/General";
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
// import EditProperty from "./pages/Properties/GeneralEditing";
import LoginMarketers from "./components/Login/loginForMarketers";
import UserWallet from "./pages/UserWallet/UserWallet";
import UserPaymentsPage from "./pages/Transactions/UserPaymentsPage";
import SettingsCard from "./marketer/SettingsCard";
import ResetCard from "./components/Modals/settings/changepassword";
import EditProperty from "./pages/Properties/GeneralEdit2";
import General from "./pages/Properties/General2";
import DuplicateProperty from "./pages/Properties/GeneralDuplicateProperty";
// import InfoTechSidebar from "./components/ItAdmin/sideNav";

const AuthGuard = () => {
  const token = Cookies.get("token");
  if (!token) {
    return <Navigate to="/" replace />;
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
    location.pathname !== "/" && location.pathname !== "/login-marketer";

  const isinfotech = location.pathname.startsWith("/info-tech");
  // const marketer_login=
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
      <div className="w-full">{children}</div>
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
                <Route path="/properties/form" element={<General />} />
                 <Route path="/properties/Draftform/:id" element={<DuplicateProperty />} />

                <Route path="error-500" element={<Error500 />} />
                <Route path="*" element={<Error404 />} />

                {/* Marketer Routes */}
                <Route element={<AuthGuard />}>
                  <Route path="/marketer" element={<MarketersDashboard />} />
                  <Route
                    path="marketer-customer"
                    element={<MarketerCustomer />}
                  />
                  <Route
                    path="marketer-payment/:plan_id/:user_id"
                    element={<MarketerInvoice />}
                  />
                  <Route path="error-500" element={<Error500 />} />
                  <Route path="*" element={<Error404 />} />
                </Route>

                {/* Director Routes */}
                <Route element={<AuthGuard />}>
                  <Route path="/director" element={<DirectorsDashboard />} />
                  <Route path="error-500" element={<Error500 />} />
                  <Route path="*" element={<Error404 />} />
                </Route>

                {/* Payment Routes */}
                <Route path="/payments" element={<AuthGuard />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="payments" element={<Payment />} />
                  <Route
                    path="payments/status/:paymentId"
                    element={<PaymentById />}
                  />
                  <Route path="contracts" element={<Contract />} />
                  <Route
                    path="contracts/details/:user_id/:plan_id"
                    element={<ContractInvoice />}
                  />
                  <Route
                    path="customers/:id"
                    element={<CustomerSinglePage />}
                  />
                  <Route
                    path="customers/transactions/:id"
                    element={<UserPayments />}
                  />
                  <Route
                    path="customers/payment/:id"
                    element={<UserPaymentsPage />}
                  />
                  <Route
                    path="customers/wallet-transactions/:id"
                    element={<WalletTransactionsPage />}
                  />
                  <Route
                    path="customers/singlepage/payment"
                    element={<CustomersPayment />}
                  />
                  <Route
                    path="customers/payment/:user_id/:plan_id"
                    element={<Customers_payment />}
                  />
                  <Route path="error-500" element={<Error500 />} />
                  <Route path="*" element={<Error404 />} />
                </Route>
              </Route>

              {/* HR Routes (Unprotected) */}
              <Route element={<AuthGuard />}>
                <Route path="/human-resources" element={<HRDashboard />} />
                <Route path="view-job/:jobId" element={<SingleJob />} />
                <Route path="error-500" element={<Error500 />} />
                <Route path="*" element={<Error404 />} />
              </Route>
              <Route path="/human-resources" element={<HRDashboard />} />
              <Route
                path="/human-resources/view-job/:jobId"
                element={<SingleJob />}
              />
              <Route path="/human-resources" element={<HRDashboard />} />
              <Route
                path="/human-resources/view-job/:jobId"
                element={<SingleJob />}
              />
              <Route path="/human-resources" element={<HRDashboard />} />
              <Route path="/human-resources" element={<HRDashboard />} />

              {/* Legal Routes (Unprotected) */}
              <Route path="/legal" element={<AuthGuard />}>
                <Route index element={<Page />} />
                <Route
                  path="contracts/details/:user_id/:plan_id"
                  element={<LegalContractInvoice />}
                />
                <Route path="error-500" element={<Error500 />} />
                <Route path="*" element={<Error404 />} />
              </Route>
              {/* user wallet */}
              <Route path="wallet-Transactions" element={<UserWallet />} />

              {/* Client Routes (Unprotected) */}
              <Route path="/client" element={<AuthGuard />}>
                <Route
                  path="partnership-requests"
                  element={<ClientsPartnership />}
                />
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerSinglePage />} />
                <Route
                  path="customers/transactions/:id"
                  element={<UserPayments />}
                />
                <Route
                  path="customers/payment/:id"
                  element={<UserPaymentsPage />}
                />
                <Route
                  path="customers/wallet-transactions/:id"
                  element={<WalletTransactionsPage />}
                />
                <Route
                  path="customers/singlepage/payment"
                  element={<CustomersPayment />}
                />
                <Route
                  path="customers/payment/:user_id/:plan_id"
                  element={<Customers_payment />}
                />
                <Route path="contracts" element={<Contract />} />
                <Route
                  path="contracts/details/:user_id/:plan_id"
                  element={<ContractInvoice />}
                />
                <Route path="error-500" element={<Error500 />} />
                <Route path="*" element={<Error404 />} />
              </Route>

              {/* Info-Tech Route Group */}
              <Route path="/info-tech" element={<AuthGuard />}>
                <Route index element={<Dashboard_It />} />
                {/* Requests & Enquiries Routes */}
                <Route
                  path="requests-enquiries"
                  element={<RequestsEnquiries />}
                />
                <Route
                  path="requests-enquiries/:id"
                  element={<PropertyEnquiries />}
                />
                <Route path="settings/reset-password" element={<ResetCard />} />
                {/* Settings Routes */}
                <Route path="settings" element={<Settings />} />

                <Route path="settings/sliders" element={<SliderSettings />} />
                <Route
                  path="settings/page-headers"
                  element={<HeaderSettings />}
                />
                <Route
                  path="settings/page-headers/edit/:id"
                  element={<EditHeaderDetails />}
                />
                <Route
                  path="settings/page-headers/new"
                  element={<AddHeaderDetails />}
                />
                <Route
                  path="settings/office-locations"
                  element={<OfficeLocations />}
                />
                <Route
                  path="settings/site-information"
                  element={<SiteInformationPage />}
                />
                <Route
                  path="settings/leadership"
                  element={<LeaderShipSettings />}
                />
                <Route
                  path="settings/testimonials"
                  element={<TestimonialsPage />}
                />
                <Route path="settings/faqs" element={<FAQs />} />
                <Route
                  path="settings/add-account"
                  element={<AccountDetails />}
                />

                <Route path="error-500" element={<Error500 />} />
                <Route path="*" element={<Error404 />} />
              </Route>

              {/* Top-Level Catch-All for Unmatched Routes */}
              <Route path="*" element={<Error404 />} />
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
