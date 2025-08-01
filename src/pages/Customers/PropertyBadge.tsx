import React from 'react';

const PropertyBadge = ({ status }:{ status:any }) => {
  let colorClasses;

  switch (status) {
    case 'ALLOCATED':
      colorClasses = 'bg-green-100 text-green-800';
      break;
    case 'PENDING':
      colorClasses = 'bg-yellow-100 text-yellow-800';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-800';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xl font-medium ${colorClasses}`}
    >
      {status}
    </span>
  );
};

export default PropertyBadge;