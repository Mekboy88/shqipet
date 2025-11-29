import React, { useState } from 'react';

interface PostTextContentProps {
  text: string;
}

const PostTextContent: React.FC<PostTextContentProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return null;
  
  // Limit text to 10,000 characters
  const maxLength = 10000;
  const displayText = text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  
  // Check if text needs truncation (approximately 2 lines)
  const approximateTwoLineLength = 120;
  const shouldTruncate = displayText.length > approximateTwoLineLength;
  
  return (
    <div className="text-sm text-gray-900 leading-relaxed">
      <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full">
        {isExpanded ? (
          <p>{displayText}</p>
        ) : (
          <p className="line-clamp-2">
            {shouldTruncate ? displayText.slice(0, approximateTwoLineLength) : displayText}
          </p>
        )}
        
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
          >
            {isExpanded ? "shfaq më pak" : "...shiko më shumë"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostTextContent;