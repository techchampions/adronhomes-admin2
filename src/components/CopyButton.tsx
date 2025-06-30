import React, { useState } from "react";
import { IoCopy } from "react-icons/io5";
import { toast } from "react-toastify";

type CopyButtonProps = {
  text?: string | number | null;
  className?: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(text));
      toast("Copied to clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`${className} flex gap-1 text-[9px] items-center text-gray-400`}
    >
      <IoCopy className="h-4 w-4 text-gray-400" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export default CopyButton;
