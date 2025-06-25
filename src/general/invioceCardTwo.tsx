import { useState } from "react";
import { BiDumbbell } from "react-icons/bi";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface InvoiceProps {
  invoiceAmount: string;
  paidAmount: string;
  paymentSchedule: string;
  progressPercentage: number;
  duration: string;
  nextPaymentDate: string;
  dueDate: string;
  property?: {
    name: string;
    address: string;
    image: string;
    size: string;
    features?: string[];
    type: string;
  };
   infrastructure?: InfrastructureData;
   other?: {
    percentage: number;
    amount: number;
    remainingBalance: number;
    paidAmount: number;
  };
}
interface InfrastructureData {
  percentage: number;
  amount: number;
  remainingBalance: number;
  paidAmount: number;
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
    features: ["Gym", "Swimming Pool"],
    type: "Land",
  },
  infrastructure,
  other
}: InvoiceProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
const slides = ["property", "infrastructure", "other"];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Format numbers with fallback
  const formatNumber = (value: number | undefined) => {
    if (value === undefined) return "₦0";
    return `₦${value.toLocaleString()}`;
  };


 
return (
    <div className="w-full bg-[#272727] text-white rounded-[20px] md:rounded-[30px] relative overflow-hidden mx-auto">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0"></div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-4 md:gap-8">
        {/* Left side - Sliding sections */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 relative overflow-hidden min-h-[300px]">
          {/* Slider navigation arrows */}

          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-30 rounded-full p-2"
            aria-label="Previous slide"
          >
            <FiArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-30 rounded-full p-2"
            aria-label="Next slide"
          >
            <FiArrowRight className="h-4 w-4" />
          </button>

          {/* Slides */}
          <div className="relative h-full">
            {/* Invoice Details Slide */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                currentSlide === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-[#FFFFFF] text-sm font-[325] mb-3 md:mb-[14px]">
                Invoice
              </h2>

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

              <p className="text-sm md:text-base mb-2 font-[325]">
                Payment Schedule: {paymentSchedule}
              </p>

              <div className="bg-[#FFFFFF26] bg-opacity-[15%] rounded-[12px] md:rounded-[20px]  p-3 md:p-6">
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {/* Duration */}
                  <div className="min-w-0">
                    <h3 className="text-base md:text-xl font-[325] mb-1 md:mb-2 break-words">
                      Duration
                    </h3>
                    <p className="font-[325] text-xs md:text-sm break-words">
                      {duration}
                    </p>
                  </div>

                  {/* Next Payment */}
                  <div className="min-w-0">
                    <h3 className="text-base md:text-xl font-[325] mb-1 md:mb-2 break-words">
                      {nextPaymentDate}
                    </h3>
                    <p className="font-[325] text-xs md:text-sm break-words">
                      Next Payment
                    </p>
                  </div>

                  {/* Due Date */}
                  <div className="min-w-0">
                    <h3 className="text-base md:text-xl font-[325] mb-1 md:mb-2 break-words">
                      {dueDate}
                    </h3>
                    <p className="font-[325] text-xs md:text-sm break-words">
                      Due Date
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Infrastructure Details Slide */}
            <div
              className={`absolute inset-0 p-3 md:p-4 transition-opacity duration-300 ${
                currentSlide === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
            <div
              className={`absolute inset-0 p-3 md:p-4 transition-opacity duration-300 ${
                currentSlide === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-lg md:text-2xl font-[350] mb-3 md:mb-4">
                Infrastructure Details
              </h2>
              
               {infrastructure && infrastructure.amount > 0 ? (
    <div className="space-y-3 md:space-y-4">
      <div>
        <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
          Infrastructure Fee
        </h3>
        <p className="text-base md:text-lg font-[350]">
          {formatNumber(infrastructure.amount)}
        </p>
      </div>

      <div>
        <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
          Payment Progress
        </h3>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full"
            style={{ 
              width: `${infrastructure.paidAmount > 0 ? 
                (infrastructure.paidAmount / infrastructure.amount) * 100 : 
                0}%` 
            }}
          ></div>
        </div>
        <p className="text-base md:text-lg font-[350] mt-1">
          {infrastructure.paidAmount > 0 ? 
            Math.round((infrastructure.paidAmount / infrastructure.amount) * 100) : 
            0}% Paid
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
            Paid
          </h3>
          <p className="text-base md:text-lg font-[350]">
            {formatNumber(infrastructure.paidAmount)}
          </p>
        </div>
        <div>
          <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
            Remaining
          </h3>
          <p className="text-base md:text-lg font-[350]">
            {formatNumber(infrastructure.remainingBalance)}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-sm md:text-base text-gray-400">
      No infrastructure costs associated with this property
    </p>
  )}
            </div>
            </div>

            {/* Other Costs Slide */}
            <div
              className={`absolute inset-0 p-3 md:p-4 transition-opacity duration-300 ${
                currentSlide === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
<div
  className={`absolute inset-0 p-3 md:p-4 transition-opacity duration-300 ${
    currentSlide === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
  }`}
>
  <h2 className="text-lg md:text-2xl font-[350] mb-3 md:mb-4">
    Other Costs
  </h2>
  
  {other && other.amount > 0 ? (
    <div className="space-y-3 md:space-y-4">
      <div>
        <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
          Other Fees
        </h3>
        <p className="text-base md:text-lg font-[350]">
          {formatNumber(other.amount)}
        </p>
      </div>

      <div>
        <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
          Payment Progress
        </h3>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full"
            style={{ 
              width: `${other.paidAmount > 0 ? 
                (other.paidAmount / other.amount) * 100 : 
                0}%` 
            }}
          ></div>
        </div>
        <p className="text-base md:text-lg font-[350] mt-1">
          {other.paidAmount > 0 ? 
            Math.round((other.paidAmount / other.amount) * 100) : 
            0}% Paid
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
          <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
            Paid
          </h3>
          <p className="text-base md:text-lg font-[350]">
            {formatNumber(other.paidAmount)}
          </p>
        </div>
        <div>
          <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
            Remaining
          </h3>
          <p className="text-base md:text-lg font-[350]">
            {formatNumber(other.remainingBalance)}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-sm md:text-base text-gray-400">
      No additional costs associated with this property
    </p>
  )}
</div>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 md:h-2 md:w-2 rounded-full transition-colors ${
                  currentSlide === index ? "bg-white" : "bg-gray-500"
                }`}
                aria-label={`View ${slides[index]} details`}
              />
            ))}
          </div>
        </div>

        {/* Right side - Fixed Property Details */}
        <div className="flex-1 bg-[url('/paymentbg.svg')] bg-cover bg-center p-4 md:p-6 lg:p-8">
          <div className="mb-4 md:mb-[10px]">
            <img
              src={property.image}
              alt={property.name}
              className="rounded-[12px] md:rounded-[20px] object-cover w-20 h-16 md:w-[110px] md:h-[79px]"
              loading="lazy"
            />
          </div>

          <h2 className="text-lg md:text-2xl lg:text-3xl font-[350] mb-2 break-words">
            {property.name}
          </h2>

          <div className="items-center mb-3 md:mb-4 flex gap-2">
            <img 
              src="/locate.svg" 
              className="h-4 w-4 md:h-5 md:w-5" 
              alt="Location icon"
            />
            <span className="text-xs md:text-base font-[325] break-words">
              {property.address}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="flex items-center gap-1 md:gap-2">
              <img 
                src="/ruler.svg" 
                className="h-4 w-4 md:h-5 md:w-5" 
                alt="Ruler icon"
              />
              <span className="text-xs md:text-base break-words font-[325]">
                {property.size}
              </span>
            </div>

            {property.features?.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-center gap-1 md:gap-2">
                {feature.toLowerCase().includes('light') ? (
                  <img 
                    src="/wand.svg" 
                    className="h-4 w-4 md:h-5 md:w-5" 
                    alt="Feature icon"
                  />
                ) : feature.toLowerCase().includes('gym') ? (
                  <BiDumbbell className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <img 
                    src="/dot.svg" 
                    className="h-4 w-4 md:w-5 md:h-5" 
                    alt="Feature icon"
                  />
                )}
                <span className="text-xs md:text-base break-words font-[325]">
                  {feature}
                </span>
              </div>
            ))}

            <div className="flex items-center">
              <span className="text-xs md:text-base break-words font-[325]">
                {property.type}
              </span>
            </div>
          </div>

          <p className="mt-3 md:mt-[10px] text-xs md:text-base break-words font-[350]">
            View Property
          </p>
        </div>
      </div>
    </div>
  );
  
}






