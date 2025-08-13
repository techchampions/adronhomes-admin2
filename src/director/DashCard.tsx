import React from "react";
import SmallLoader from "../components/SmallLoader";
type Prop = {
  mainText?: string;
  valueText?: string | number;
  mutedText?: string;
  actionText?: string;
  className?: string;
  isHighlighted?: boolean;
  icon?: React.ReactNode;
  isloading?: boolean;
};
const DashCard: React.FC<Prop> = ({
  mainText,
  mutedText,
  valueText,
  actionText,
  className,
  isHighlighted,
  isloading,
  icon,
}) => {
  return (
    <div
      className={`${className} p-4 rounded-2xl ${
        isHighlighted ? `bg-[#57713A] text-white` : `bg-white text-black`
      }`}
    >
      {isloading ? (
        <SmallLoader classname="!h-[100px] !w-full " />
      ) : (
        <div className="flex flex-col gap-3">
          <h3
            className={`truncate font-bold ${
              isHighlighted ? `text-base` : `text-xs`
            }`}
          >
            {mainText}
          </h3>
          <div className="flex gap-2 items-center">
            {icon}
            <span className="">{valueText}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 truncate ">{mutedText}</span>
            <span>{actionText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashCard;







type Prop2 = {
  mainText?: string;
  valueText?: string | number;
  mutedText?: string;
  actionText?: string;
  className?: string;
  isHighlighted?: boolean;
  icon?: React.ReactNode;
  isloading?: boolean;
  onActionClick?: () => void;
  showClock?: boolean; // New prop to control the "o'clock" suffix
};

export const DashCard2: React.FC<Prop2> = ({
  mainText,
  mutedText,
  valueText,
  actionText,
  className,
  isHighlighted,
  isloading,
  icon,
  onActionClick,
  showClock,
}) => {
  return (
    <div
      className={`${className} p-4 rounded-2xl ${
        isHighlighted ? `bg-[#57713A] text-white` : `bg-white text-black`
      }`}
    >
      {isloading ? (
        <SmallLoader classname="!h-[100px] !w-full " />
      ) : (
        <div className="flex flex-col gap-3">
          <h3
            className={`truncate font-bold ${
              isHighlighted ? `text-base` : `text-xs`
            }`}
          >
            {mainText}
          </h3>
          <div className="flex gap-2 items-center">
            {icon}
            <span className="">
              {valueText}
              {showClock && " o'clock"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 truncate ">{mutedText}</span>
            {actionText && (
              <span 
                className={`text-sm cursor-pointer ${isHighlighted ? 'text-white' : 'text-[#57713A]'}`}
                onClick={onActionClick}
              >
                {actionText}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

