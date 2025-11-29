import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PhotosGrid from '@/components/photos/PhotosGrid';
import NavbarNoTooltip from '@/components/NavbarNoTooltip';
import Avatar from '@/components/Avatar';
import { Helmet } from 'react-helmet-async';

const Photos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarNoTooltip />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Helmet>
          <title>Photos | Profile</title>
          <meta name="description" content="Browse all your photos in one place." />
          <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        </Helmet>
        {/* Navigation Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Fotot</h1>
          <Avatar size="sm" />
        </div>

        {/* Photos Grid */}
        <PhotosGrid />
      </div>
    </div>
  );
};

export default Photos;