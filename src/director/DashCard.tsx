import React from "react";
type Prop = {
  mainText?: string;
  valueText?: string | number;
  mutedText?: string;
  actionText?: string;
  className?: string;
  isHighlighted?: boolean;
  icon?: React.ReactNode;
};
const DashCard: React.FC<Prop> = ({
  mainText,
  mutedText,
  valueText,
  actionText,
  className,
  isHighlighted,
  icon,
}) => {
  return (
    <div
      className={`${className} p-4 rounded-2xl flex flex-col gap-3 ${
        isHighlighted ? `bg-[#57713A] text-white` : `bg-white text-black`
      }`}
    >
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
  );
};

export default DashCard;
