
import React from 'react';

const SideSection = ({ title, description, imageSrc, reverse }) => {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between mb-16`}>
      <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0 ml-6">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700">{description}</p>
      </div>
      <div className="w-full md:w-1/2">
        <div className="relative">
          <div className=" absolute inset-0 -m-4"></div>
          <img src={imageSrc} alt={title} className="relative z-10 w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default SideSection;