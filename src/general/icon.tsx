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
