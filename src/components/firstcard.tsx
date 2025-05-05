import React from "react";

// FirstCard (Stats Card)
interface StatsCardProps {
  tag?: string;
  stats?: {
    value: number | string;
    label: string;
  }[];
  icon?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  tag = "Properties",
  stats = [
    { value: 27, label: "Live Properties" },
    { value: 9, label: "Sold" },
    { value: 6, label: "Active Plans" }
  ],
  icon = "/arrw.svg"
}) => {
  return (
    <div className="h-[151px] p-5 bg-white rounded-[20px] relative">
      <p className="bg-[#F8F8F8] rounded-[40px] py-2 px-[23px] font-[350] text-[#272727] text-sm w-fit mb-[20px]">
        {tag}
      </p>
      <div className="flex justify-start w-full">
        <div className="grid grid-cols-3 gap-[70px]">
          {stats.map((stat, index) => (
            <div key={index} className="min-w-[31px]">
              <p className="font-gotham font-[350] text-[30px] leading-[100%] text-dark tracking-[0%] text-center mb-[5px]">
                {stat.value}
              </p>
              <h1 className="font-gotham font-[325] text-[14px] leading-[100%] tracking-[0%] text-center text-[#767676]">
                {stat.label}
              </h1>
            </div>
          ))}
        </div>
      </div>
      <img src={icon} className="absolute right-6 top-14" alt="icon" />
    </div>
  );
};

// RevenueCard (Green)
interface RevenueCardProps {
  title?: string;
  value?: string;
  icon?: string;
  value2?:string
}

export function RevenueCard({
  title = "Revenue Update",
  value = "increase in revenue",
  icon = "/solar.svg",
  value2 = "40%",
}: RevenueCardProps) {
  return (
    <div className="bg-[#57713A]  min-h-[200px] rounded-[20px] pt-[24px] pb-[35px] pl-[29px] pr-[120px]">
      <p className="font-[325] text-[14px] leading-[100%] tracking-[0%] text-white mb-[22px]">
        {title}
      </p>
      <img src={icon} className="mb-[10px]" alt="icon" />
      <p className="leading-[34px] tracking-[0] font-[350] text-[27px] text-white">
       {value2} <span className="font-[325]">{value}</span>
      </p>
    </div>
  );
}

// RevenueWhiteCard (Payment Card)
interface RevenueWhiteCardProps {
  tag?: string;
  amount?: string;
  currency?: string;
  note?: string;
}

export function RevenueWhiteCard({
  tag = "Total Payments Made",
  amount = "300,000,000,000",
  currency = "₦",
  note = "Includes all property plans"
}: RevenueWhiteCardProps) {
  return (
    <div className=" min-h-[200px] bg-white pl-[18px] pt-[23px] pb-[20px] pr-[105px] rounded-[20px]">
      <p className="bg-[#F8F8F8] rounded-[40px] py-2 px-[23px] font-[350] text-[#272727] text-sm w-fit mb-[40px]">
        {tag}
      </p>
      <p className="max-w-[295px] truncate text-[30px] text-dark mb-[10px]">
        <span className="text-[20px]">{currency}</span>
        {amount}
      </p>
      <p className="font-[350] text-[#767676] text-sm">
        {note}
      </p>
    </div>
  );
}

interface MatrixCardGreenProps {
  title?: string;
  value?: string;
  change?: string;
  currency?: boolean; // Add this prop
}

export function MatrixCardGreen({
  title = "Total Registered Customers",
  value = "704",
  change = "+203 last month",
  currency = false // Default to false
}: MatrixCardGreenProps) {
  return (
    <div className="bg-[#57713A] h-[144px] py-[24px] pl-[24px] rounded-[20px]">
      <div className="font-gotham text-[14px] font-[350] leading-[100%] tracking-[0%] text-white mb-[16px]">
        <p>{title}</p>
      </div>
      <div className="font-gotham text-[30px] font-[350] leading-[100%] tracking-[0%] text-white mb-[10px] flex">
        {currency && <span className="text-[20px]">₦</span>} {/* Only show if currency is true */}
        <p className="max-w-[295px] truncate">{value}</p>
      </div>
      <div className="font-gotham text-[14px] font-[325] leading-[100%] tracking-[0%] text-white">
        <p><span className="font-[350]">{change}</span></p>
      </div>
    </div>
  );
}

// MatrixCard (White)

// interface MatrixCardGreenProps {
//   title?: string;
//   value?: string;
//   change?: string;
//   currency?: boolean; // Add this prop
// }

export function MatrixCard({
  title = "Total Registered Customers",
  value = "704",
  change = "+203 last month",
  currency = false 
}: MatrixCardGreenProps) {
  return (
    <div className="bg-white  h-[144px] py-[24px] pl-[24px]  rounded-[20px]">
      <div className="font-gotham text-[14px] font-[350] leading-[100%] tracking-[0%] text-dark mb-[16px]">
        <p>{title}</p>
      </div>
      <div className="font-gotham text-[30px] font-[350] leading-[100%] tracking-[0%] text-dark mb-[10px] flex">
        {currency && <span className="text-[20px]">₦</span>} {/* Only show if currency is true */}
        <p className="max-w-[295px] truncate">{value}</p>
      </div>
      <div className="font-gotham text-[14px] font-[325] leading-[100%] tracking-[0%] text-[#767676]">
        <p>{change}</p>
      </div>
    </div>
  );
}