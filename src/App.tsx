import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { ReactNode, useContext, useEffect } from "react";

// Context
import { PropertyContext, PropertyProvider } from "./MyContext/MyContext";
import { AppDispatch, store } from "./components/Redux/store";

// Layout Components
import AdminSidebar from "./general/sidebar";
import SideBar from "./marketer/sideNav/SideNav";

// Pages
import Login from "./components/Login/login";
import Dashboard from "./pages/Dashboard/dashboard";
import Customers from "./pages/Customers/customers";
import Payment from "./pages/Payment/Payment";
import MarketersDashboard from "./marketer/dashboard/page";
import SettingsPage from "./marketer/settingsPage/SettingsPage";
import MarketerInvoice from "./marketer/Payment/customers_payment";
import Transactions from "./pages/Transactions/Transactions";
import Properties from "./pages/Properties/Properties";
import Personnel from "./pages/Personnel/Personnel";
import RequestsEnquiries from "./pages/Requests_Enquiries/Requests_Enquiries";
import Notifications from "./components/Notifications/Notifications";
import Settings from "./components/Settings/Settings";
import CustomerSinglePage from "./pages/Customers/CustomerSinglePage";
import CustomersPayment from "./marketer/Payment/customers_payment";
import CustomersSinglePayment from "./pages/Customers/customers_singlepayment";
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
import DirectorSideBar from "./marketer/sideNav/DirectorSideNav";
import DirectorsDashboard from "./director/DirectorDashboard";
import PropertyEnquiries from "./pages/Requests_Enquiries/PropertyEnquiries";

const AuthGuard = () => {
  const token = Cookies.get("token");

  // const isAuthenticated = () => {
  // if (!token) return false;

  // try {
  //   const payload = JSON.parse(atob(token.split(".")[1]));
  //   return payload.exp * 1000 > Date.now();
  // } catch (error) {
  //   return false;
  // }
  // };

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
  const isMarketerRoute = location.pathname.startsWith("/marketer");
  const isDirectorRoute = location.pathname.startsWith("/director");
  const shouldShowSidebar = location.pathname !== "/";

  return (
    <div className="flex">
      {shouldShowSidebar && (
        <div className="min-h-screen bg-white">
          {isMarketerRoute ? (
            <SideBar />
          ) : isDirectorRoute ? (
            <DirectorSideBar />
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
  return (
    <Provider store={store}>
      <QueryProvider>
        <PropertyProvider>
          <AppLayout>
            <Routes>
              {/* Public Route */}
              <Route path="/" element={<Login />} />
              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                {/* Admin Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/payments" element={<Payment />} />
                <Route
                  path="/payments/status/:paymentId"
                  element={<PaymentById />}
                />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/personnel" element={<Personnel />} />
                <Route
                  path="/requests-enquiries"
                  element={<RequestsEnquiries />}
                />
                <Route
                  path="/requests-enquiries/:id"
                  element={<PropertyEnquiries />}
                />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/sliders" element={<SliderSettings />} />
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
                  path="/settings/leadership"
                  element={<LeaderShipSettings />}
                />
                <Route
                  path="/settings/add-account"
                  element={<AccountDetails />}
                />
                <Route path="/customers/:id" element={<CustomerSinglePage />} />
                <Route
                  path="/customers/singlepage/payment"
                  element={<CustomersPayment />}
                />
                <Route
                  path="/customers/singlepage/singlepayment"
                  element={<CustomersSinglePayment />}
                />
                <Route path="/properties/form" element={<General />} />
                <Route
                  path="/customers/singlepage/singlepayment"
                  element={<CustomersSinglePayment />}
                />
                <Route
                  path="/customers/payment/:user_id/:plan_id"
                  element={<Customers_payment />}
                />
                <Route path="/properties/form" element={<General />} />

                {/* Marketer Routes */}
                <Route path="/marketer" element={<MarketersDashboard />} />
                <Route path="/director" element={<DirectorsDashboard />} />
                <Route path="marketer-settings" element={<SettingsPage />} />
                <Route
                  path="/marketer-payment/:user_id/:plan_id"
                  element={<MarketerInvoice />}
                />
              </Route>
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
