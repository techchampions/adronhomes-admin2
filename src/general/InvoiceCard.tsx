import { BiDumbbell } from "react-icons/bi";

interface InvoiceProps {
  invoiceAmount: string;
  paidAmount: string;
  paymentSchedule: string;
  progressPercentage: number;
  duration: string;
  nextPaymentDate: string;
  dueDate: string;
  property: {
    name: string;
    address: string;
    image: string;
    size: string;
    hasStreetLights: boolean;
    hasGym: boolean;
    type: string;
  };
}

export default function InvoiceCard({
  invoiceAmount = "₦56,000,000",
  paidAmount = "₦36,000,000",
  paymentSchedule = "Weekly",
  progressPercentage = 60,
  duration = "6 Months",
  nextPaymentDate = "15/09/2025",
  dueDate = "5/09/2025",
  property = {
    name: "Treasure Parks and Gardens",
    address: "34, Shimawa, Ogun State, Nigeria",
    image: "/land.svg",
    size: "648 Sq M",
    hasStreetLights: true,
    hasGym: true,
    type: "Land"
  }
}: InvoiceProps) {
  return (
    <div className="w-full  bg-[#272727] text-white rounded-[30px] relative overflow-hidden mx-auto">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0"></div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-4 md:gap-8">
        {/* Left side - Invoice details */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <h2 className="text-[#FFFFFF] text-sm font-[325] mb-3 md:mb-[14px]">Invoice</h2>

          <div className="mb-4 md:mb-6 grid grid-cols-3 gap-2 max-w-full">
  <h1 className="text-3xl md:text-3xl lg:text-5xl font-[350] text-white truncate col-span-2">
    {invoiceAmount}
  </h1>
  <span className="text-lg md:text-xl lg:text-xl text-white self-end truncate">
    /{paidAmount}
  </span>
</div>

          <div className="w-full bg-[#737373] rounded-full h-2 md:h-3 mb-4 md:mb-6">
            <div 
              className="bg-white h-2 md:h-3 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <p className="text-sm md:text-base mb-6 md:mb-8 font-[325]">Payment Schedule: {paymentSchedule}</p>

          <div className="bg-[#FFFFFF26] bg-opacity-[15%] rounded-[16px] md:rounded-[20px] p-4 md:p-6">
  <div className="grid grid-cols-3 gap-2 md:gap-4">
    {/* Duration */}
    <div className="min-w-0"> {/* Added min-w-0 to enable truncation */}
      <h3 className="text-lg md:text-xl font-[325] mb-1 md:mb-2 truncate">Duration</h3>
      <p className="font-[325] text-xs md:text-sm truncate">{duration}</p>
    </div>

    {/* Next Payment */}
    <div className="min-w-0">
      <h3 className="text-lg md:text-xl font-[325] mb-1 md:mb-2 truncate">
        {nextPaymentDate}
      </h3>
      <p className="font-[325] text-xs md:text-sm truncate">Next Payment</p>
    </div>

    {/* Due Date */}
    <div className="min-w-0">
      <h3 className="text-lg md:text-xl font-[325] mb-1 md:mb-2 truncate">
        {dueDate}
      </h3>
      <p className="font-[325] text-xs md:text-sm truncate">Due Date</p>
    </div>
  </div>
</div>
        </div>

        <div className="flex-1 bg-[url('/paymentbg.svg')] bg-cover bg-center p-4 md:p-6 lg:p-8">
  <div className="grid grid-cols-1 gap-4 w-full">
    {/* Image */}
    <div className="mb-4 md:mb-[10px]">
      <img
        src={property.image}
        alt={property.name}
        className="rounded-[16px] md:rounded-[20px] object-cover w-20 h-16 md:w-[110px] md:h-[79px]"
      />
    </div>

    {/* Property Name */}
    <h2 className="text-xl md:text-2xl lg:text-3xl font-[350] mb-2 truncate">
      {property.name}
    </h2>

    {/* Address */}
    <div className=" items-center  mb-4 md:mb-4 flex gap-2">
      <img src="/locate.svg" className="h-4 w-4 md:h-5 md:w-5 " />
      <span className="text-sm md:text-base font-[325] truncate ">
        {property.address}
      </span>
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-4">
      {/* Size */}
      <div className="flex items-center gap-1 md:gap-2">
        <img src="/ruler.svg" className="h-4 w-4 md:h-5 md:w-5" />
        <span className="text-sm md:text-base truncate font-[325]">{property.size}</span>
      </div>

      {/* Street Lights */}
      {property.hasStreetLights && (
        <div className="flex items-center gap-1 md:gap-2">
          <img src="/wand.svg" className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-sm md:text-base truncate font-[325]">Str Lights</span>
        </div>
      )}

      {/* Gym */}
      {property.hasGym && (
        <div className="flex items-center gap-1 md:gap-2">
          <BiDumbbell className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-sm md:text-base truncate font-[325]">Gym</span>
        </div>
      )}

      {/* Property Type */}
      <div className="flex items-center">
        <span className="text-sm md:text-base truncate font-[325]">{property.type}</span>
      </div>
    </div>

    {/* View Property Link */}
    <p className="mt-4 md:mt-[10px] text-sm md:text-base truncate font-[350]">
      View Property
    </p>
  </div>
</div>
      </div>
    </div>
  );
}