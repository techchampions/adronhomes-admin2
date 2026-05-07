import { FaGift } from "react-icons/fa";

const ACTIVE_FILTER =
"invert(63%) sepia(89%) saturate(512%) hue-rotate(52deg) brightness(95%) contrast(86%) opacity(57%)"

type IconProps = {
  isActive: boolean;
  className?: string;
};

export const Icon1 = ({ isActive, className = "" }: IconProps) => (
  <div className={className}>
    <img
      src="/icon1.svg"
      alt="Send"
      height={24}
      width={24}
      style={{
        filter: isActive ? ACTIVE_FILTER : "",
      }}
    />
  </div>
);

export const Icon2 = ({ isActive, className = "" }: IconProps) => (
  <div className={className}>
    <img
      src="/icon2.svg"
      alt="Level"
      height={24}
      width={24}
      style={{
        filter: isActive ? ACTIVE_FILTER : "",
      }}
    />
  </div>
);

export const Icon3 = ({ isActive, className = "" }: IconProps) => (
  <div className={className}>
    <img
      src="/icon3.svg"
      alt="Global"
      height={24}
      width={24}
      style={{
        filter: isActive ? ACTIVE_FILTER : "",
      }}
    />
  </div>
);

export const Icon5 = ({ isActive, className = "" }: IconProps) => (
  <div className={className}>
    <img
      src="/icon5.svg"
      alt="Repeat"
      height={24}
      width={24}
      style={{
        filter: isActive ? ACTIVE_FILTER : "",
      }}
    />
  </div>
);

export const Icon6 = ({ isActive, className = "" }: IconProps) => (
  <div className={className}>
    <img
      src="/icon6.svg"
      alt="Wallet"
      height={24}
      width={24}
      style={{
        filter: isActive ? ACTIVE_FILTER : "",
      }}
    />
  </div>
);

export const Icon7 = ({ isActive, className = "" }: IconProps) => (
  <div className={className}>
    <img
      height={24}
      width={24}
      src="/icon7.svg"
      alt="Command"
      style={{
        filter: isActive ? ACTIVE_FILTER : "",
      }}
    />
  </div>
);

export const Icon8 = ({ isActive, className = "" }: IconProps) => (
  <div className={className}>
    <img
      height={24}
      width={24}
      src="/icon8.svg"
      alt="Profile"
      style={{
        filter: isActive ? ACTIVE_FILTER : "",
      }}
    />
  </div>
);

export const Icon9 = ({ isActive, className = "" }: IconProps) => (
  <div className={className}>
    <img
      height={24}
      width={24}
      src="/icon9.svg"
      alt="Call"
      style={{
        filter: isActive ? ACTIVE_FILTER : "",
      }}
    />
  </div>
);



// SVG Gift Icon with color classes
export const IconGift = ({ isActive, className = "" }: IconProps) => (
  <div className={`${className} ${isActive ? "text-[#79B833]" : "text-[#767676]"}`}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: isActive ? ACTIVE_FILTER : "",
      }}
    >
      <path
        d="M20 12V20H4V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 7H2V12H22V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C9.5 2 12 7 12 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C14.5 2 12 7 12 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);