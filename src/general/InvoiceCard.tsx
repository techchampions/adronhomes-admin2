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

          <div className="mb-4 md:mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-[350] text-white">
              {invoiceAmount}
              <span className="text-lg md:text-xl lg:text-2xl">/{paidAmount}</span>
            </h1>
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
              <div>
                <h3 className="text-lg md:text-xl font-[325] mb-1 md:mb-2">Duration</h3>
                <p className="font-[325] text-xs md:text-sm">{duration}</p>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-[325] mb-1 md:mb-2">{nextPaymentDate}</h3>
                <p className="font-[325] text-xs md:text-sm">Next Payment</p>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-[325] mb-1 md:mb-2">{dueDate}</h3>
                <p className="font-[325] text-xs md:text-sm">Due Date</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Property details */}
        <div className="flex-1 bg-[url('/paymentbg.svg')] bg-cover bg-center p-4 md:p-6 lg:p-8">
          <div className="w-full flex">
            <div className="flex flex-col max-w-full">
              <div className="mb-4 md:mb-[30px]">
                <img
                  src={property.image}
                  alt={property.name}
                  className="rounded-[16px] md:rounded-[20px] object-cover w-20 h-16 md:w-[110px] md:h-[79px]"
                />
              </div>

              <h2 className="text-xl md:text-2xl lg:text-3xl font-[350] mb-2">{property.name}</h2>

              <div className="flex items-center gap-2 mb-4 md:mb-6 text-sm md:text-base font-[325]">
                <img src="/locate.svg" className="h-4 w-4 md:h-5 md:w-5" />
                <span className="truncate">{property.address}</span>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6 text-sm md:text-base">
                <div className="flex items-center gap-1 md:gap-2">
                  <img src="/ruler.svg" className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{property.size}</span>
                </div>

                {property.hasStreetLights && (
                  <div className="flex items-center gap-1 md:gap-2">
                    <img src="/wand.svg" className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Str Lights</span>
                  </div>
                )}

                {property.hasGym && (
                  <div className="flex items-center gap-1 md:gap-2">
                    <BiDumbbell className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Gym</span>
                  </div>
                )}

                <div>
                  <span>{property.type}</span>
                </div>
              </div>

              <p className="mt-4 md:mt-[28px] text-sm md:text-base">View Property</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}