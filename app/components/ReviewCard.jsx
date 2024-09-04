import React, { useState } from 'react';

const ReviewCard = ({ image, name, rating, date, review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxWords = 20; // Set the maximum number of words before truncation

  const truncateReview = (text, limit) => {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayReview = isExpanded ? review : truncateReview(review, maxWords);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full" src={image} alt={`${name}'s profile`} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-gray-600 text-sm">{date}</span>
        </div>
        <p className="text-gray-700 text-base">
          {displayReview}
          {review.split(' ').length > maxWords && (
            <button 
              onClick={toggleExpand} 
              className="text-blue-500 hover:text-blue-700 ml-1 focus:outline-none"
            >
              {isExpanded ? 'Show less' : '...more'}
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;