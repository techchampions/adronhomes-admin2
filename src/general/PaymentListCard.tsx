import React from 'react';

interface PaymentListCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  className?: string;
}

const PaymentListCard: React.FC<PaymentListCardProps> = ({
  title = "Payment List",
  description = "Click 'view list' to see a list of all scheduled payments available for this property payment plan.",
  buttonText = "View List",
  onButtonClick,
  className = '',
}) => {
  return (
    <div className={`bg-white md:py-[32px] md:px-[39px] py-6 px-8 rounded-[30px] flex md:flex-row flex-col  justify-between ${className}`}>
 <div>     <h3 className='font-[350] text-xl md:text-2xl text-dark mb-[10px]'>{title}</h3>
 <p className='text-sm md:text-base text-dark font-[325]'>{description}</p></div>
      <button
        onClick={onButtonClick}
        className="mt-2  text-white py-[17px] px-[49px] rounded-full text-sm md:text-base bg-[#272727]"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PaymentListCard;