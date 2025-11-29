
import React from 'react';
import { useParams } from 'react-router-dom';

const Video: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Video Player</h1>
        <p className="text-gray-600">Video ID: {id}</p>
        <p className="text-gray-600 mt-2">Video player coming soon...</p>
      </div>
    </div>
  );
};

export default Video;
