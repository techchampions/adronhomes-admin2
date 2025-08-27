import React from "react";
import Header from "../../../general/Header";
import HeaderTable from "./HeaderTable";
import { useNavigate } from "react-router-dom";

const HeaderSettings = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <Header
        title="Settings"
        subtitle="Manage settings"
        history={true}
        showSearchAndButton={false}
        onButtonClick={() => navigate("new")}
      />
      <div className="p-8">
        <HeaderTable />
      </div>
    </div>
  );
};

export default HeaderSettings;
