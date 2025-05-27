import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-[300px] h-[40vh] mx-auto bg-red relative max-h-screen">
      <img src="/not-found.svg" alt="error" className="h-full w-full" />
    </div>
  );
};

export default NotFound;
