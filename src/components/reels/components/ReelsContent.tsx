
import React from 'react';

interface ReelsContentProps {
  creator: string;
  caption: string;
}

const ReelsContent: React.FC<ReelsContentProps> = ({ creator, caption }) => {
  return (
    <div className="absolute bottom-20 left-4 right-16 text-white">
      <p className="font-semibold text-lg mb-2">{creator}</p>
      <p className="text-sm opacity-90">{caption}</p>
    </div>
  );
};

export default ReelsContent;
