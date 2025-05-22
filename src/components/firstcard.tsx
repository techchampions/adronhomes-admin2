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
    { value: 6, label: "Active Plans" },
  ],
  icon = "/arrw.svg",
}) => {
  return (
    <div className="h-[151px] p-5 bg-white rounded-[20px] relative cursor-pointer">
      <p className="bg-[#F8F8F8] rounded-[40px] py-1 md:py-2 px-[12px] md:px-[23px] font-[350] text-[#272727] md:text-sm   text-[10px] w-fit mb-[20px]">
        {tag}
      </p>
      <div className="flex justify-start w-full">
        <div className="grid grid-cols-3 md:gap-[70px] gap-1">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              <p 
                className="font-gotham font-[350] md:text-[30px] tex-[15px] leading-[100%] text-dark tracking-[0%] text-center mb-[5px] truncate max-w-[100px] mx-auto"
                title={typeof stat.value === 'string' ? stat.value : String(stat.value)}
              >
                {stat.value.toLocaleString()}
              </p>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                {stat.value.toLocaleString()}
              </div>
              <h1 className="font-gotham font-[325] md:text-[14px]  text-[10px] leading-[100%] tracking-[0%] text-center text-[#767676]">
                {stat.label}
              </h1>
            </div>
          ))}
        </div>
      </div>
      <img src={icon} className="absolute right-6 top-14 " alt="icon" />
    </div>
  );
};

// RevenueCard (Green)
interface RevenueCardProps {
  title?: string;
  value?: string;
  icon?: string;
  value2?: string;
}

export function RevenueCard({
  title = "Revenue Update",
  value = "increase in revenue",
  icon = "/solar.svg",
  value2 = "40%",
}: RevenueCardProps) {
  return (
    <div className="bg-[#57713A]  md:min-h-[200px] min-h-full rounded-[20px] pt-[24px] pb-[35px] pl-[19px] md:pl-[29px] md:pr-[120px] pr-[60px]">
      <p className="font-[325] md:text-[14px]  text-[10px] leading-[100%] tracking-[0%] text-white mb-[22px]">
        {title}
      </p>
      <img src={icon} className="mb-[10px]" alt="icon " />
      <p className="leading-[34px] tracking-[0] font-[350] md:text-[27px] text-[18px] text-white">
        {value2} <span className="font-[325]">{value}</span>
      </p>
    </div>
  );
}

// RevenueWhiteCard (Payment Card)
interface RevenueWhiteCardProps {
  tag?: string;
  amount?: any;
  currency?: string;
  note?: string;
}

export function RevenueWhiteCard({
  tag = "Total Payments Made",
  amount = "300,000,000,000",
  currency = "₦",
  note = "Includes all property plans",
}: RevenueWhiteCardProps) {
  return (
    <div className="md:min-h-[200px] min-h-full bg-white md:pl-[18px] pl-[9px] pt-[23px] pb-[20px] pr-[52px] md:pr-[105px] rounded-[20px] cursor-pointer relative">
      <p className="bg-[#F8F8F8] rounded-[40px] py-1 md:py-2 px-[12px] md:px-[23px] font-[350] text-[#272727] md:text-sm text-[10px] w-fit mb-[40px]">
        {tag}
      </p>
      
      <div className="relative inline-block max-w-full group">
        <p className="max-w-[295px] truncate md:text-[30px] text-[15px] text-dark mb-[10px] font-[350]">
          <span className="md:text-[20px] text-[10px] font-[325]">{currency}</span>
          {amount.toLocaleString()}
        </p>
        
        {/* Tooltip that appears on hover */}
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {currency}{amount.toLocaleString()}
        </div>
      </div>
      
      <p className="font-[325] text-[#767676] md:text-sm text-[7px]">{note}</p>
    </div>
  );
}
interface MatrixCardGreenProps {
  title?: string;
  value?: any;
  change?: string;
  currency?: boolean; // Add this prop
}

export function MatrixCardGreen({
  title = "Total Registered Customers",
  value = "704",
  change = "+203 last month",
  currency = false, // Default to false
}: MatrixCardGreenProps) {
  return (
    <div className="bg-[#57713A]  h-full  py-[24px] lg:pl-[24px] pl-[12px] rounded-[20px]">
      <div className="font-gotham md:text-[14px]   text-[10px] font-[350] leading-[100%] tracking-[0%] text-white mb-[16px]">
        <p>{title}</p>
      </div>
      <div className="font-gotham md:text-[30px]  text-[20px]  font-[350] items-center text-white mb-[10px] flex">
        {currency && <span className="md:text-[20px] text-[10px]">₦</span>}{" "}
        {/* Only show if currency is true */}
        <p className="max-w-[295px] pr-2 truncate">{value}</p>
      </div>
      <div className="font-gotham md:text-[14px]  pr-2  text-[10px] font-[325] leading-[100%] tracking-[0%] text-white">
        <p>
          <span className="font-[325]">{change}</span>
        </p>
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
  currency = false,
}: MatrixCardGreenProps) {
  return (
    <div className="bg-white  h-full  py-[24px] lg:pl-[24px] pl-[12px] rounded-[20px]">
      <div className=" md:text-[14px]  text-[10px] font-[350] leading-[100%] tracking-[0%] text-dark mb-[16px]">
        <p>{title}</p>
      </div>
      <div className="font-gotham md:text-[30px]  text-[20px]  font-[350] items-center text-dark mb-[10px] flex">
        {currency && <span className="md:text-[20px] text-[10px]">₦</span>}{" "}
        {/* Only show if currency is true */}
        <p className="max-w-[295px] pr-2 truncate">{value}</p>
      </div>
      <div className="font-gotham md:text-[14px] pr-2   text-[10px] font-[325] leading-[100%] tracking-[0%] text-dark">
        <p>
          <span className="font-[325] text-[#767676] ">{change}</span>
        </p>
      </div>
    </div>
  );
}

// marketergreencard



interface MatrixCardGreensProps {
  name?: string;
  role?: string;
  date?: string;
  showSettings?: boolean;
    iconSrc?: string;  
  iconAlt?: string; 
}

export function GreenCardMarketer({
  name = "Mike Wellington",
  role = "Marketer",
  date = "Created 3.09.2025",
  showSettings = true,
   iconSrc,     
  iconAlt = "icon",
}: MatrixCardGreensProps) {
  return (
    <div className="bg-[#57713A]  h-full py-[24px] lg:pr-[24px] lg:pl-[24px] pl-[12px] rounded-[20px] pr-[12px]">
      <div className="font-gotham md:text-[24px] text-[20px] font-[350] leading-[100%] tracking-[0%] text-white mb-[18px]">
        <p>{name}</p>
      </div>
       <div className="font-gotham font-[350] text-white mb-[20px] flex items-center gap-[4px]">
        {iconSrc && (
          <img 
            src={iconSrc} 
            alt={iconAlt} 
            className="w-6 h-6" 
          />
        )}
        <p className="truncate">{role}</p>
      </div>
      
   <div className="flex flex-row w-full justify-between">
       <div className="font-gotham md:text-[14px] text-[10px] font-[325] leading-[100%] tracking-[0%] text-white ">
        <p>{date}</p>
      </div>
      {showSettings && (
        <div className="font-gotham md:text-[14px] text-[10px] font-[350] leading-[100%] tracking-[0%] text-white">
          <p>Account Settings</p>
        </div>
      )}
   </div>
    </div>
  );
}