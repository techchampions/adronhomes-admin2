import { Routes, Route, useLocation } from "react-router-dom";
import AdminSidebar from "./general/sidebar"; // Default sidebar
import SideBar from "./marketer/sideNav/SideNav"; // Marketer sidebar
import { PropertyProvider } from "./MyContext/MyContext";
import Login from "./components/Login/login";

// Import all other components
import Dashboard from "./pages/Dashboard/dashboard";
import Customers from "./pages/Customers/customers";
import Payment from "./pages/Payment/Payment";
import MarketersDashboard from "./marketer/dashboard/page";
import SettingsPage from "./marketer/settingsPage/SettingsPage";
import MarketerInvoice from "./marketer/Payment/customers_payment";
import Transactions from "./pages/Transactions/Transactions";
import Properties from "./pages/Properties/Properties";
import Personnel from "./pages/Personnel/Personnel";
import Requests_Enquiries from "./pages/Requests_Enquiries/Requests_Enquiries";
import Notifications from "./components/Notifications/Notifications";
import Settings from "./components/Settings/Settings";
import CustomerSinglePage from "./pages/Customers/CustomerSinglePage";
import Customers_payment from "./marketer/Payment/customers_payment";
import Customers_singlepayment from "./pages/Customers/customers_singlepayment";
import General from "./pages/Properties/General";
// ... (other imports remain the same)

function App() {
  const location = useLocation();

  // Determine if the current route is a marketer route
  const isMarketerRoute = location.pathname.startsWith("/marketer");
  // Hide sidebar on login page
  const shouldShowSidebar = location.pathname !== "/";

  return (
    <PropertyProvider>
      <div className="flex">
        {shouldShowSidebar && (
          <div className="min-h-screen bg-white">
            {isMarketerRoute ? <SideBar /> : <AdminSidebar />}
          </div>
        )}
        <div className="w-full">
          <Routes>
            {/* Public Route (No Sidebar) */}
            <Route path="/" element={<Login />} />

            {/* Admin Routes (Default Sidebar) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payment />} />
                      <Route path="/dasboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/personnel" element={<Personnel />} />
            <Route path="/Requests-Enquiries" element={<Requests_Enquiries />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/customers/singlepage" element={<CustomerSinglePage />} />
            <Route path="/customers/singlepage/payment" element={<Customers_payment />} />
            <Route path="/customers/singlepage/singlepayment" element={<Customers_singlepayment />} />
            <Route path="/properties/form" element={<General />} />

            {/* Marketer Routes (Marketer Sidebar) */}
            <Route path="/marketer" element={<MarketersDashboard />} />
            <Route path="/marketer/settings" element={<SettingsPage />} />
            <Route path="/marketer/Payment" element={<MarketerInvoice />} />
          </Routes>
        </div>
      </div>
    </PropertyProvider>
  );
}

export default App;