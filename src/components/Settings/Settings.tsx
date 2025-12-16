import React from "react";
import Header from "../../general/Header";
import Cardone from "./Cardone";
import CardTwo from "./CardTwo";

export default function Settings() {
  return (
    <div className="pb-[52px]">
      <Header title="Settings" subtitle="Manage settings" showSearchAndButton={false
      }/>
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <Cardone />
      </div>
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-[30px]">
        <CardTwo />
      </div>
    </div>
  );
}
