import React from "react";





export function CardGreen({ tag = "Slider", note = "Click here to manage the control" ,  icon = "/arrw.svg",icon2='/iticon1.svg'}) {
  return (
  <div className="md:min-h-[164px] min-h-full rounded-[20px] cursor-pointer relative p-5 md:pr-16 bg-gradient-to-b from-[#F9FFF9] to-[#DFF0DF]">
    {/* Icon */}
    <div className="mb-4">
      <img src={icon2} alt="icon" />
    </div>
    
    {/* Tag */}
    <p className="text-xl font-[350] text-[#272727] mb-2">{tag}</p>
    
    {/* Note */}
    <p className="text-base max-w-[164px] text-[#272727] font-[325]">{note}</p>
    
    {/* Arrow Icon */}
    <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
      <img src={icon} alt="icon" />
    </div>
  </div>
);
}
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
                title={
                  typeof stat.value === "string"
                    ? stat.value
                    : String(stat.value)
                }
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

interface RevenueCardProps {
  title?: string;
  value?: string;
  icon?: string;
  value2?: string | number; // Allow both string and number for flexibility
    currency?:any
}

export function RevenueCard({
  title = "Revenue Update",
  value = "increase in revenue",
  icon = "/solar.svg",
  value2 = "40%",
    currency = "",
}: RevenueCardProps) {
  // Function to format the value to 2 decimal places
  const formatValue = (val: string | number) => {
    // If it's already a number, format it directly
    if (typeof val === 'number') {
      return val.toFixed(2);
    }
    
    // If it's a string, try to extract the numeric part
    const numericValue = parseFloat(val.replace(/[^0-9.-]/g, ''));
    if (!isNaN(numericValue)) {
      return numericValue.toFixed(2) + (val.includes('%') ? '%' : '');
    }
    
    // Return original if we can't parse it
    return val;
  };

  const formattedValue = formatValue(value2);

  return (
    <div className="bg-[#57713A]  md:min-h-[200px] min-h-full rounded-[20px] pt-[24px] pb-[35px] pl-[19px] md:pl-[29px] md:pr-[120px] pr-[60px]">
      <p className="font-[325] md:text-[14px]  text-[10px] leading-[100%] tracking-[0%] text-white mb-[22px]">
        {title}
      </p>
      <img src={icon} className="mb-[10px]" alt="icon " />
     <div className="flex text-white ">
        <span className="md:text-[20px] text-[10px] font-[325]">
            {currency} </span> <p className="leading-[34px] tracking-[0] font-[350] md:text-[27px] text-[18px] text-white pr-4">
        {formattedValue} <span className="font-[325] text-xs">{value}</span>
      </p>
     </div>
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
          <span className="md:text-[20px] text-[10px] font-[325]">
            {currency}
          </span>
          {amount.toLocaleString()}
        </p>

        {/* Tooltip that appears on hover */}
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {currency}
          {amount.toLocaleString()}
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
  change = "includes all registered customers",
  currency = false, // Default to false
}: MatrixCardGreenProps) {
  return (
    <div className="bg-[#57713A]  h-full  py-[24px] lg:pl-[24px] pl-[12px] rounded-[20px] relative">
      <div className="font-gotham md:text-[14px]   text-[10px] font-[350] leading-[100%] tracking-[0%] text-white mb-[16px]">
        <p>{title}</p>
      </div>
      <div className="font-gotham md:text-[30px]  text-[20px]  font-[350] items-center text-white mb-[10px] flex group cursor-pointer">
        {currency && <span className="md:text-[20px] text-[10px]">₦</span>}{" "}
        {/* Only show if currency is true */}
        <p className="max-w-[295px] pr-2 truncate">{value}</p>
        <div className="absolute top-10 left-5 mb-2 hidden group-hover:block z-50 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {currency}
          {value.toLocaleString()}
        </div>
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
    <div className="bg-white  h-full  py-[24px] lg:pl-[24px] pl-[12px] rounded-[20px] relative">
      <div className=" md:text-[14px]  text-[10px] font-[350] leading-[100%] tracking-[0%] text-dark mb-[16px]">
        <p>{title}</p>
      </div>
      <div className="font-gotham md:text-[30px]  text-[20px]  font-[350] items-center text-dark mb-[10px] flex group">
        {currency && <span className="md:text-[20px] text-[10px]">₦</span>}{" "}
        {/* Only show if currency is true */}
        <p className="max-w-[295px] pr-2 truncate cursor-pointer">{value}</p>
        <div className="absolute top-10 left-5 mb-2 hidden group-hover:block z-50 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {currency}
          {value.toLocaleString()}
        </div>
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
  title?: string;
  value?: string | number;
  change?: string;
  currency?: boolean;
  view?: string;
  handleClickView?: () => void;
}

export function GreenCardMarketer({
  title = "Total Registered Customers",
  value = "704",
  change = "+203 last month",
  currency = false,
  view = "View More",
  handleClickView,
}: MatrixCardGreensProps) {
  return (
    <div className="bg-[#57713A] h-full py-[24px] lg:pl-[24px] pl-[12px] rounded-[20px] relative">
      <div className="font-gotham md:text-[14px] flex text-[10px] font-[350] leading-[100%] tracking-[0%] text-white mb-[16px] justify-between pr-4">
        <p >{title}</p>
        <p className="cursor-pointer text-[10px] ml-4" onClick={() => handleClickView?.()}>{view}</p>
      </div>
      <div className="font-gotham md:text-[30px] text-[20px] font-[350] items-center text-white mb-[10px] flex group cursor-pointer">
        {currency && <span className="md:text-[20px] text-[10px]">₦</span>}
        <p className="max-w-[270px] pr-2 truncate">{value}</p>
        <div className="absolute top-10 left-5 mb-2 hidden group-hover:block z-50 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {currency}
          {value.toLocaleString()}
        </div>
      </div>
      <div className="font-gotham md:text-[14px] pr-2 text-[10px] font-[325] leading-[100%] tracking-[0%] text-white">
        <p><span className="font-[325]">{change}</span></p>
      </div>
    </div>
  );
}
