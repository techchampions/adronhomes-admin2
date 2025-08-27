import React from "react";
import Header from "../../../general/Header";
import SocialLinks from "./SocialLinks";
import ContactInfo from "./ContactInfo";
import TermsAndConditions from "./TermsAndCondition";
import EstateLocation from "./EstateLocation";

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
        <EstateLocation />
        {/* <ContactInfo /> */}
        {/* <TermsAndConditions /> */}
      </div>
    </div>
  );
};

export default SiteInformationPage;
