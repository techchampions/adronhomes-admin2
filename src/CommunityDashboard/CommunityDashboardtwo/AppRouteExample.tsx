import { Route } from "react-router-dom";
import CommunityDashboard from "./CommunityDashboard";

const communityRoutes = (
  <>
    <Route path="/estate" element={<CommunityDashboard initialSection="overview" />} />
    <Route path="/estate/chat" element={<CommunityDashboard initialSection="community" />} />
    <Route path="/estate/messages" element={<CommunityDashboard initialSection="messages" />} />
    <Route path="/estate/payments" element={<CommunityDashboard initialSection="payments" />} />
    <Route path="/estate/utilities" element={<CommunityDashboard initialSection="utilities" />} />
    <Route path="/estate/access" element={<CommunityDashboard initialSection="access" />} />
    <Route path="/estate/maintenance" element={<CommunityDashboard initialSection="maintenance" />} />
    <Route path="/estate/documents" element={<CommunityDashboard initialSection="documents" />} />
  </>
);

export default communityRoutes;
