import React from 'react';

interface ProfileCardProps {
  imageUrl: string;
  name: string;
  dateJoined: string;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  imageUrl,
  name,
  dateJoined,
  className = '',
}) => {
  return (
    <div className={`bg-white py-5 px-6 md:py-6 md:px-8 rounded-3xl flex items-center space-x-4 md:space-x-6 ${className}`}>
      <img
        src={imageUrl}
        alt={`${name}'s profile`}
        className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
      />
      <div>
        <p className='font-light text-lg md:text-2xl text-dark'>{name}</p>
        <p className='text-xs md:text-sm text-dark font-light'>
          Date Joined: <span className="font-normal">{dateJoined}</span>
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;