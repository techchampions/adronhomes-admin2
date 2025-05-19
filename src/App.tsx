import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./general/sidebar";
import AdminSidebar from "./general/sidebar"; // Your new sidebar
import Dashboard from "./pages/Dashboard/dashboard";
import Customers from "./pages/Customers/customers";
import Payment from "./pages/Payment/Payment";
import Transactions from "./pages/Transactions/Transactions";
import Properties from "./pages/Properties/Properties";
import Personnel from "./pages/Personnel/Personnel";
import Requests_Enquiries from "./pages/Requests_Enquiries/Requests_Enquiries";
import Notifications from "./components/Notifications/Notifications";
import Settings from "./components/Settings/Settings";
import CustomerSinglePage from "./pages/Customers/CustomerSinglePage";
import Customers_payment from "./pages/Customers/customers_payment";
import Customers_singlepayment from "./pages/Customers/customers_singlepayment";
import General from "./pages/Properties/General";
import { PropertyProvider } from "./MyContext/MyContext";
import SideBar from "./marketer/sideNav/SideNav";
import MarketersDashboard from "./marketer/dashboard/page";

function App() {
  const location = useLocation();

  // Example: Use AdminSidebar for "/admin" routes
  const isAdminRoute = location.pathname.startsWith("/marketer");

  return (
    <PropertyProvider>
      <div className="flex">
        <div className="min-h-screen bg-white">
          {isAdminRoute ? <SideBar /> : <Sidebar />}
        </div>
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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
            {/* Admin routes (example) */}
            <Route path="/marketer" element={<MarketersDashboard />} />
            {/* Add more admin routes as needed */}
          </Routes>
        </div>
      </div>
    </PropertyProvider>
  );
}

export default App;
