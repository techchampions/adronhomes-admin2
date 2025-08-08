import React from "react";
import Header from "../../../general/Header";
import TestimonialList from "./TestimonialList";

const TestimonialsPage = () => {
  return (
    <div className="">
      <Header
        title="Settings"
        subtitle="Manage settings"
        history={true}
        showSearchAndButton={false}
      />
      <div className="p-8 max-w-5xl">
        <TestimonialList />
      </div>
    </div>
  );
};

export default TestimonialsPage;
