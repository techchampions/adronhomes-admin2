import { Routes, Route } from "react-router-dom";
import Sidebar from "./general/sidebar";
import Dashboard from "./pages/Dashboard/dashboard";
import Customers from "./pages/Customers/customers";
import Payment from "./pages/Payment/Payment";
import Transactions from "./pages/Transactions/Transactions";
import Properties from "./pages/Properties/Properties";
import Personnel from "./pages/Personnel/Personnel";
// import Sidebar from "./components/sidebar/sideBar";


function App() {
  return (
    <div className="flex">
   <div className="bg-white w-[326px] min-h-screen">
   <Sidebar />
   </div>
      <div className="flex-1">
        <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/payments" element={<Payment/>} />
        <Route path="/transactions" element={<Transactions/>} />
        <Route path="/properties" element={<Properties/>} />
        <Route path="/personnel" element={<Personnel/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
