import React from 'react';
import { CheckCircle, AlertCircle, BookOpen } from 'lucide-react'; // still using icons

const Cards = ({ title, number }) => {
  let bgColor = 'bg-white';
  let textColor = 'text-gray-700';
  let Icon = BookOpen;

  if (title.toLowerCase().includes('resolved')) {
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
    Icon = CheckCircle;
  } else if (title.toLowerCase().includes('pending') || title.toLowerCase().includes('in progress')) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-700';
    Icon = AlertCircle;
  } else if (title.toLowerCase().includes('total')) {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-700';
    Icon = BookOpen;
  } else {
    bgColor = 'bg-gray-100';
    textColor = 'text-gray-700';
    Icon = BookOpen;
  }

  return (
    <div
      className={`block max-w-sm p-6 border border-gray-200 shadow-sm rounded-lg text-center
      transition-all transform hover:scale-105 hover:shadow-lg ${bgColor} dark:border-gray-700`}
    >
      <div className="flex flex-col items-center justify-center">
        <Icon size={32} className={`${textColor} mb-2`} />
        <h3 className={`text-md font-semibold ${textColor}`}>{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${textColor}`}>{number}</p>
      </div>
    </div>
  );
};

export default Cards;
