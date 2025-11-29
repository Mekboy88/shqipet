
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminSearchBox from '@/components/admin/AdminSearchBox';

interface AdminLoginBackgroundProps {
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
}

const AdminLoginBackground: React.FC<AdminLoginBackgroundProps> = ({ colorScheme }) => {
  return (
    <>
      <div 
        className="absolute inset-0 -z-10 overflow-hidden"
        style={{
          background: `linear-gradient(to right bottom, ${colorScheme.background}, #fef2f0)`,
        }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(${colorScheme.primary} 1.5px, transparent 1.5px), radial-gradient(${colorScheme.secondary} 1.5px, transparent 1.5px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
          opacity: 0.3,
        }}></div>
        <div className="absolute inset-0 backdrop-blur-lg"></div>
      </div>
      
      <div className="absolute top-28 left-4 z-40 group">
        <Link 
          to="/"
          className="flex items-center justify-center bg-white/80 px-3 py-2 rounded-full border border-gray-300 text-gray-800 hover:text-black hover:bg-white/95 transition-all shadow-sm relative transform origin-center group-hover:scale-110 duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span className="font-bold">Back to Home</span>
        </Link>
      </div>

      <div className="absolute top-28 right-4 z-40">
        <AdminSearchBox />
      </div>
    </>
  );
};

export default AdminLoginBackground;
