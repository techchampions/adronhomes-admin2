import { useState } from "react";
import { BiDumbbell } from "react-icons/bi";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface InvoiceProps {
  invoiceAmount?: string;
  paidAmount?: string;
  paymentSchedule?: string;
  progressPercentage?: number;
  duration?: string;
  nextPaymentDate?: string;
  dueDate?: string;
  number_of_unit:any
  property?: {
    name: string;
    address: string;
    image: string;
    size: string;
    features?: string[];
    type: string;
  };
  infrastructure?: {
    percentage: number;
    amount: number;
    remainingBalance: number;
    paidAmount: number;
  };
  other?: {
    percentage: number;
    amount: number;
    remainingBalance: number;
    paidAmount: number;
  };
}

export default function InvoiceCard({
  number_of_unit='N/A',
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
  other,
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

  // Generate default breakdown items based on the percentage and amount
  const generateBreakdown = (section: typeof infrastructure | typeof other) => {
    if (!section) return [];

    return [
      {
        name: "Base Amount",
        value: section.amount * (1 - section.percentage / 100),
      },
      {
        name: `Fees (${section.percentage}%)`,
        value: section.amount * (section.percentage / 100),
      },
    ];
  };

  // Render breakdown items
  const renderBreakdownItems = (
    items: Array<{ name: string; value: number }>
  ) => {
    return (
      <div className="mt-4 space-y-3 pb-9">
        <h3 className="text-sm md:text-base font-[325] text-gray-300 mb-2">
          Breakdown:
        </h3>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-xs md:text-sm font-[325]">{item.name}</span>
              <span className="text-xs md:text-sm font-[350]">
                {formatNumber(item.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
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

          {/* Slides container with a consistent height */}
          <div className="relative h-full" style={{ minHeight: "350px" }}>
            {/* Invoice Details Slide */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                currentSlide === 0
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
            <div className="flex flex-row w-full justify-between">
                <h2 className="text-[#FFFFFF] text-sm font-[325] mb-3 md:mb-[14px]">
                Invoice
              </h2>
                 <h2 className="text-[#FFFFFF] text-sm font-[325] mb-3 md:mb-[14px]  bg-gray-800  whitespace-nowrap  rounded-2xl py-1 px-4">
                <div>
       {number_of_unit} {number_of_unit === 1 ? 'Unit' : 'Units'}
    </div>
              </h2>
            </div>

              <div className="mb-4 md:mb-6 flex items-end">
                <h1
                  className="text-3xl md:text-3xl lg:text-5xl font-[350] text-white flex items-baseline relative group"
                  data-tooltip-content={`${invoiceAmount} / ${paidAmount}`}
                >
                  <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                    {invoiceAmount}
                  </span>
                  <span className="text-lg md:text-xl lg:text-xl text-white ml-1 truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]">
                    /{paidAmount}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-sm  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap  rounded-4xl">
                    {invoiceAmount} / {paidAmount}
                  </div>
                </h1>
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

              <div className="bg-[#FFFFFF26] bg-opacity-[15%] rounded-[12px] md:rounded-[20px] p-3 md:p-6">
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
                currentSlide === 1
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
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
                          width: `${
                            infrastructure.paidAmount > 0
                              ? (infrastructure.paidAmount /
                                  infrastructure.amount) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-base md:text-lg font-[350] mt-1">
                      {infrastructure.paidAmount > 0
                        ? Math.round(
                            (infrastructure.paidAmount /
                              infrastructure.amount) *
                              100
                          )
                        : 0}
                      % Paid
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-4  ">
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

            {/* Other Costs Slide */}
            <div
              className={`absolute inset-0 p-3 md:p-4 transition-opacity duration-300 ${
                currentSlide === 2
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
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
                          width: `${
                            other.paidAmount > 0
                              ? (other.paidAmount / other.amount) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-base md:text-lg font-[350] mt-1">
                      {other.paidAmount > 0
                        ? Math.round((other.paidAmount / other.amount) * 100)
                        : 0}
                      % Paid
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

        {/* Right side - Dynamic content based on current slide */}
        <div className="flex-1 bg-[url('/paymentbg.svg')] bg-cover bg-center p-4 md:p-6 lg:p-8">
          {currentSlide === 0 && (
            <>
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
                    {feature.toLowerCase().includes("light") ? (
                      <img
                        src="/wand.svg"
                        className="h-4 w-4 md:h-5 md:w-5"
                        alt="Feature icon"
                      />
                    ) : feature.toLowerCase().includes("gym") ? (
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

              
              </div>
  <div className="flex items-center">
                  <span className="text-xs md:text-base break-words font-[325]">
                  Property Type :  {property.type}
                  </span>
                </div>
              {/* <p className="mt-3 md:mt-[10px] text-xs md:text-base break-words font-[350]">
                View Property
              </p> */}
            </>
          )}

          {currentSlide === 1 && infrastructure && (
            <div className="h-full flex flex-col ">
              <h2 className="text-lg md:text-2xl font-[350] mb-3 md:mb-4">
                Infrastructure Breakdown
              </h2>
              {renderBreakdownItems(generateBreakdown(infrastructure))}
            </div>
          )}

          {currentSlide === 2 && other && (
            <div className="h-full flex flex-col">
              <h2 className="text-lg md:text-2xl font-[350] mb-3 md:mb-4">
                Other Costs Breakdown
              </h2>
              {renderBreakdownItems(generateBreakdown(other))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { BiDumbbell } from "react-icons/bi";
// import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

// interface InvoiceProps {
//   invoiceAmount: string;
//   paidAmount: string;
//   paymentSchedule: string;
//   progressPercentage: number;
//   duration: string;
//   nextPaymentDate: string;
//   dueDate: string;
//   property?: {
//     name: string;
//     address: string;
//     image: string;
//     size: string;
//     features?: string[];
//     type: string;
//   };
//   infrastructure?: {
//     percentage: number;
//     amount: number;
//     remainingBalance: number;
//     paidAmount: number;
//   };
//   other?: {
//     percentage: number;
//     amount: number;
//     remainingBalance: number;
//     paidAmount: number;
//   };
// }

// export default function InvoiceCard({
//   invoiceAmount = "₦56,000,000",
//   paidAmount = "₦36,000,000",
//   paymentSchedule = "Weekly",
//   progressPercentage = 60,
//   duration = "6 Months",
//   nextPaymentDate = "15/09/2025",
//   dueDate = "5/09/2025",
//   property = {
//     name: "Treasure Parks and Gardens",
//     address: "34, Shimawa, Ogun State, Nigeria",
//     image: "/land.svg",
//     size: "648 Sq M",
//     features: ["Gym", "Swimming Pool"],
//     type: "Land",
//   },
//   infrastructure = {
//     percentage: 10,
//     amount: 5000000,
//     remainingBalance: 2000000,
//     paidAmount: 3000000
//   },
//   other = {
//     percentage: 5,
//     amount: 1000000,
//     remainingBalance: 400000,
//     paidAmount: 600000
//   }
// }: InvoiceProps) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const slides = ["property", "infrastructure", "other"];

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };

//   // Format numbers with fallback
//   const formatNumber = (value: number | undefined) => {
//     if (value === undefined) return "₦0";
//     return `₦${value.toLocaleString()}`;
//   };

//   // Generate default breakdown items based on the percentage and amount
//   const generateBreakdown = (section: typeof infrastructure | typeof other) => {
//     if (!section) return [];

//     return [
//       {
//         name: "Base Amount",
//         value: section.amount * (1 - (section.percentage / 100))
//       },
//       {
//         name: `Fees (${section.percentage}%)`,
//         value: section.amount * (section.percentage / 100)
//       }
//     ];
//   };

//   // Render breakdown items
//   const renderBreakdownItems = (items: Array<{name: string, value: number}>) => {
//     return (
//       <div className="mt-4 space-y-3">
//         <h3 className="text-sm md:text-base font-[325] text-gray-300 mb-2">
//           Breakdown:
//         </h3>
//         <ul className="space-y-2">
//           {items.map((item, index) => (
//             <li key={index} className="flex justify-between">
//               <span className="text-xs md:text-sm font-[325]">{item.name}</span>
//               <span className="text-xs md:text-sm font-[350]">
//                 {formatNumber(item.value)}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   // Common slide container styles
//   const slideContainerClasses = "absolute inset-0 p-4 md:p-6 lg:p-8 transition-opacity duration-300";

//   return (
//     <div className="w-full bg-[#272727] text-white rounded-[20px] md:rounded-[30px] relative overflow-hidden mx-auto">
//       <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0"></div>

//       <div className="relative z-10 flex flex-col lg:flex-row gap-4 md:gap-8">
//         {/* Left side - Sliding sections */}
//         <div className="flex-1 p-4 md:p-6 lg:p-8 relative overflow-hidden min-h-[400px]">
//           {/* Slider navigation arrows */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-30 rounded-full p-2"
//             aria-label="Previous slide"
//           >
//             <FiArrowLeft className="h-4 w-4" />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-30 rounded-full p-2"
//             aria-label="Next slide"
//           >
//             <FiArrowRight className="h-4 w-4" />
//           </button>

//           {/* Slides */}
//           <div className="relative h-full">
//             {/* Invoice Details Slide */}
//             <div
//               className={`${slideContainerClasses} ${
//                 currentSlide === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
//               }`}
//             >
//               <h2 className="text-[#FFFFFF] text-lg md:text-2xl font-[350] mb-4 md:mb-6">
//                 Invoice Details
//               </h2>

//               <div className="mb-4 md:mb-6 grid grid-cols-3 gap-2 max-w-full">
//                 <h1 className="text-3xl md:text-3xl lg:text-5xl font-[350] text-white truncate col-span-2">
//                   {invoiceAmount}
//                 </h1>
//                 <span className="text-lg md:text-xl lg:text-xl text-white self-end truncate">
//                   /{paidAmount}
//                 </span>
//               </div>

//               <div className="w-full bg-[#737373] rounded-full h-2 md:h-3 mb-4 md:mb-6">
//                 <div
//                   className="bg-white h-2 md:h-3 rounded-full"
//                   style={{ width: `${progressPercentage}%` }}
//                 ></div>
//               </div>

//               <div className="space-y-4 md:space-y-6">
//                 <div>
//                   <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                     Payment Schedule
//                   </h3>
//                   <p className="text-base md:text-lg font-[350]">
//                     {paymentSchedule}
//                   </p>
//                 </div>

//                 <div className="bg-[#FFFFFF26] bg-opacity-[15%] rounded-[12px] md:rounded-[20px] p-4 md:p-6">
//                   <div className="grid grid-cols-3 gap-4 md:gap-6">
//                     {/* Duration */}
//                     <div>
//                       <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                         Duration
//                       </h3>
//                       <p className="text-base md:text-lg font-[350]">
//                         {duration}
//                       </p>
//                     </div>

//                     {/* Next Payment */}
//                     <div>
//                       <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                         Next Payment
//                       </h3>
//                       <p className="text-base md:text-lg font-[350]">
//                         {nextPaymentDate}
//                       </p>
//                     </div>

//                     {/* Due Date */}
//                     <div>
//                       <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                         Due Date
//                       </h3>
//                       <p className="text-base md:text-lg font-[350]">
//                         {dueDate}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Infrastructure Details Slide */}
//             <div
//               className={`${slideContainerClasses} ${
//                 currentSlide === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
//               }`}
//             >
//               <h2 className="text-lg md:text-2xl font-[350] mb-4 md:mb-6">
//                 Infrastructure Details
//               </h2>

//               {infrastructure && infrastructure.amount > 0 ? (
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                       Infrastructure Fee
//                     </h3>
//                     <p className="text-3xl md:text-4xl font-[350]">
//                       {formatNumber(infrastructure.amount)}
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                       Payment Progress
//                     </h3>
//                     <div className="w-full bg-gray-600 rounded-full h-2 md:h-3 mb-1">
//                       <div
//                         className="bg-white h-2 md:h-3 rounded-full"
//                         style={{
//                           width: `${infrastructure.paidAmount > 0 ?
//                             (infrastructure.paidAmount / infrastructure.amount) * 100 :
//                             0}%`
//                         }}
//                       ></div>
//                     </div>
//                     <p className="text-base md:text-lg font-[350]">
//                       {infrastructure.paidAmount > 0 ?
//                         Math.round((infrastructure.paidAmount / infrastructure.amount) * 100) :
//                         0}% Paid
//                     </p>
//                   </div>

//                   <div className="bg-[#FFFFFF26] bg-opacity-[15%] rounded-[12px] md:rounded-[20px] p-4 md:p-6">
//                     <div className="grid grid-cols-2 gap-4 md:gap-6">
//                       <div>
//                         <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                           Paid
//                         </h3>
//                         <p className="text-base md:text-lg font-[350]">
//                           {formatNumber(infrastructure.paidAmount)}
//                         </p>
//                       </div>
//                       <div>
//                         <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                           Remaining
//                         </h3>
//                         <p className="text-base md:text-lg font-[350]">
//                           {formatNumber(infrastructure.remainingBalance)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {renderBreakdownItems(generateBreakdown(infrastructure))}
//                 </div>
//               ) : (
//                 <p className="text-sm md:text-base text-gray-400">
//                   No infrastructure costs associated with this property
//                 </p>
//               )}
//             </div>

//             {/* Other Costs Slide */}
//             <div
//               className={`${slideContainerClasses} ${
//                 currentSlide === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
//               }`}
//             >
//               <h2 className="text-lg md:text-2xl font-[350] mb-4 md:mb-6">
//                 Other Costs
//               </h2>

//               {other && other.amount > 0 ? (
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                       Other Fees
//                     </h3>
//                     <p className="text-3xl md:text-4xl font-[350]">
//                       {formatNumber(other.amount)}
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                       Payment Progress
//                     </h3>
//                     <div className="w-full bg-gray-600 rounded-full h-2 md:h-3 mb-1">
//                       <div
//                         className="bg-white h-2 md:h-3 rounded-full"
//                         style={{
//                           width: `${other.paidAmount > 0 ?
//                             (other.paidAmount / other.amount) * 100 :
//                             0}%`
//                         }}
//                       ></div>
//                     </div>
//                     <p className="text-base md:text-lg font-[350]">
//                       {other.paidAmount > 0 ?
//                         Math.round((other.paidAmount / other.amount) * 100) :
//                         0}% Paid
//                     </p>
//                   </div>

//                   <div className="bg-[#FFFFFF26] bg-opacity-[15%] rounded-[12px] md:rounded-[20px] p-4 md:p-6">
//                     <div className="grid grid-cols-2 gap-4 md:gap-6">
//                       <div>
//                         <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                           Paid
//                         </h3>
//                         <p className="text-base md:text-lg font-[350]">
//                           {formatNumber(other.paidAmount)}
//                         </p>
//                       </div>
//                       <div>
//                         <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-1">
//                           Remaining
//                         </h3>
//                         <p className="text-base md:text-lg font-[350]">
//                           {formatNumber(other.remainingBalance)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {renderBreakdownItems(generateBreakdown(other))}
//                 </div>
//               ) : (
//                 <p className="text-sm md:text-base text-gray-400">
//                   No additional costs associated with this property
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Slide indicators */}
//           <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center gap-2">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 className={`h-2 w-2 md:h-2 md:w-2 rounded-full transition-colors ${
//                   currentSlide === index ? "bg-white" : "bg-gray-500"
//                 }`}
//                 aria-label={`View ${slides[index]} details`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right side - Dynamic content based on current slide */}
//         <div className="flex-1 bg-[url('/paymentbg.svg')] bg-cover bg-center p-4 md:p-6 lg:p-8">
//           {currentSlide === 0 && (
//             <>
//               <div className="mb-4 md:mb-6">
//                 <img
//                   src={property.image}
//                   alt={property.name}
//                   className="rounded-[12px] md:rounded-[20px] object-cover w-full h-48 md:h-56"
//                   loading="lazy"
//                 />
//               </div>

//               <h2 className="text-lg md:text-2xl lg:text-3xl font-[350] mb-3 md:mb-4 break-words">
//                 {property.name}
//               </h2>

//               <div className="items-center mb-3 md:mb-4 flex gap-2">
//                 <img
//                   src="/locate.svg"
//                   className="h-4 w-4 md:h-5 md:w-5"
//                   alt="Location icon"
//                 />
//                 <span className="text-xs md:text-base font-[325] break-words">
//                   {property.address}
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
//                 <div className="flex items-center gap-1 md:gap-2">
//                   <img
//                     src="/ruler.svg"
//                     className="h-4 w-4 md:h-5 md:w-5"
//                     alt="Ruler icon"
//                   />
//                   <span className="text-xs md:text-base break-words font-[325]">
//                     {property.size}
//                   </span>
//                 </div>

//                 {property.features?.slice(0, 2).map((feature, index) => (
//                   <div key={index} className="flex items-center gap-1 md:gap-2">
//                     {feature.toLowerCase().includes('light') ? (
//                       <img
//                         src="/wand.svg"
//                         className="h-4 w-4 md:h-5 md:w-5"
//                         alt="Feature icon"
//                       />
//                     ) : feature.toLowerCase().includes('gym') ? (
//                       <BiDumbbell className="h-4 w-4 md:h-5 md:w-5" />
//                     ) : (
//                       <img
//                         src="/dot.svg"
//                         className="h-4 w-4 md:w-5 md:h-5"
//                         alt="Feature icon"
//                       />
//                     )}
//                     <span className="text-xs md:text-base break-words font-[325]">
//                       {feature}
//                     </span>
//                   </div>
//                 ))}

//                 <div className="flex items-center">
//                   <span className="text-xs md:text-base break-words font-[325]">
//                     {property.type}
//                   </span>
//                 </div>
//               </div>

//               <p className="text-base md:text-lg font-[350] underline cursor-pointer">
//                 View Property
//               </p>
//             </>
//           )}

//           {(currentSlide === 1 || currentSlide === 2) && (
//             <div className="h-full flex flex-col justify-between">
//               <div>
//                 <h2 className="text-lg md:text-2xl font-[350] mb-4 md:mb-6">
//                   {currentSlide === 1 ? "Infrastructure" : "Other Costs"} Details
//                 </h2>

//                 <div className="mb-6">
//                   <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-2">
//                     Description
//                   </h3>
//                   <p className="text-sm md:text-base font-[325]">
//                     {currentSlide === 1
//                       ? "These are the infrastructure development costs associated with the property."
//                       : "These are additional costs including taxes, legal fees, and other expenses."}
//                   </p>
//                 </div>

//                 <div className="bg-[#FFFFFF26] bg-opacity-[15%] rounded-[12px] md:rounded-[20px] p-4 md:p-6 mb-6">
//                   <h3 className="text-xs md:text-sm font-[325] text-gray-300 mb-2">
//                     Payment Terms
//                   </h3>
//                   <p className="text-sm md:text-base font-[325]">
//                     {currentSlide === 1
//                       ? "Infrastructure costs are typically paid in installments along with property payments."
//                       : "Other costs may be paid upfront or included in the payment schedule."}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 {currentSlide === 1 && infrastructure && (
//                   renderBreakdownItems(generateBreakdown(infrastructure))
//                 )}
//                 {currentSlide === 2 && other && (
//                   renderBreakdownItems(generateBreakdown(other))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
