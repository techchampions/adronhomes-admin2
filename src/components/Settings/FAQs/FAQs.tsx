import React from "react";
import Header from "../../../general/Header";
import FAQList from "./FAQslist";

const FAQs = () => {
  return (
    <div>
      <Header
        title="Settings"
        subtitle="Manage settings"
        history={true}
        showSearchAndButton={false}
      />
      <div className="p-8 max-w-5xl">
        <FAQList />
      </div>
    </div>
  );
};

export default FAQs;
