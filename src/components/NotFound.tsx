import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
type Props = {
  text?: any;
};
const NotFound: React.FC<Props> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center w-[300px] h-[40vh] mx-auto bg-red relative max-h-screen">
      <img src="/not-found.svg" alt="error" className="h-full w-full" />
      <p className="text-gray-500">{text}</p>
    </div>
  );
};

export default NotFound;
