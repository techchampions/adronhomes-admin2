import { useState } from 'react';

const StepIndicator = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { name: "Basic Details", id: 1 },
    { name: "Property Specifications", id: 2 },
    { name: "Media", id: 3 },
    { name: "Features", id: 4 },
    { name: "Payment Structure", id: 5 }
  ];

  const handleStepChange = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="w-full px-4 py-8 mx-auto">
      <div className="flex md:flex-row flex-col items-center gap-0">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step indicator */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center`}
                onClick={() => handleStepChange(step.id)}
              >
                {currentStep > step.id ? (
                  <img src="/good.svg" />
                ) : currentStep === step.id ? (
                  <button className="bg-[#57713A] md:text-base text-xs font-[350] px-[26px] py-[10px] rounded-[30px] text-white whitespace-nowrap">
                    {step.name}
                  </button>
                ) : (
                  <img src="/dot.svg" />
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
             <div
             className={`h-1 w-10 md:w-20  ${
               currentStep > step.id
                 ? 'bg-[#57713A]'
                 : currentStep <  step.id
                 ? 'border-t-4 border-dashed border-gray-400'
                    : currentStep === step.id
                 ? 'border-t-4 border-dashed border-gray-400'
                 : 'bg-gray-300'
             }`}
           />
           
            )}
          </div>
        ))}
      </div>
    </div>



// mobile


  );
};

export default StepIndicator;
