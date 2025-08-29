import React from "react";
import Header from "../../../general/Header";
import SocialLinks from "./SocialLinks";
import TermsAndConditions from "./TermsAndCondition";
import EstateLocation from "./EstateLocation";
import EnquiryContactInfo from "./EnquiryContactInfo";
import ClientServiceInfo from "./ClientServiceInfo";
import MainAddressInfo from "./MainAddressInfo";
import ComplaintContactInfo from "./ComplaintContactInfo";
import DigitsInfo from "./DigitsInfo";

const SiteInformationPage = () => {
  return (
    <div className="">
      <Header
        title="Settings"
        subtitle="Manage settings"
        history={true}
        showSearchAndButton={false}
      />

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <SocialLinks />
        <div className="space-y-2">
          <EnquiryContactInfo />
          <ClientServiceInfo />
        </div>
        <div className="space-y-2">
          <MainAddressInfo />
          <ComplaintContactInfo />
          <DigitsInfo />
        </div>
        <EstateLocation />
        {/* <TermsAndConditions /> */}
      </div>
    </div>
  );
};

export default SiteInformationPage;
