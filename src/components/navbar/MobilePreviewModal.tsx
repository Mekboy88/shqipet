import React from 'react';
import { X, Linkedin, Github, Facebook, Instagram, Globe } from 'lucide-react';

interface MobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    firstName: string;
    lastName: string;
    presentation: string;
    photoUrl: string;
    aboutMe: string;
    highlights: string[];
  };
  socials: Array<{
    label: string;
    url: string;
    icon?: string;
  }>;
  sections: {
    home: boolean;
    skills: boolean;
    portfolio: boolean;
    blogs: boolean;
    contact: boolean;
    cv: boolean;
  };
}

const IconMap: Record<string, any> = {
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
  instagram: Instagram,
  website: Globe
};

const MobilePreviewModal: React.FC<MobilePreviewModalProps> = ({
  isOpen,
  onClose,
  profile,
  socials,
  sections
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Mobile Device Frame */}
      <div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl" style={{ width: '375px', height: '667px' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close preview"
        >
          <X size={24} />
        </button>

        {/* Mobile Screen */}
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-y-auto">
          {/* Photo Section */}
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-6xl">{profile.firstName?.[0]}{profile.lastName?.[0]}</span>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="py-6 space-y-6">
            {/* Name and Presentation */}
            <div className="space-y-3 px-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.presentation && (
                <p className="text-base text-gray-600">
                  Founder • {profile.presentation}
                </p>
              )}
              <p className="text-base text-gray-700 leading-relaxed">
                Based in London. Cybersecurity learner. I design systems that are fast, clear, and human-friendly.
              </p>
            </div>

            {/* Social Links */}
            {socials.length > 0 && (
              <div className="flex gap-6 px-6">
                {socials.map((social, index) => {
                  const Icon = social.icon && IconMap[social.icon.toLowerCase()] 
                    ? IconMap[social.icon.toLowerCase()] 
                    : Globe;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      <Icon size={24} />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-2 overflow-x-auto px-6">
              {sections.home && (
                <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-medium whitespace-nowrap">
                  Home
                </button>
              )}
              {sections.skills && (
                <button className="px-3 py-1.5 bg-white text-gray-900 rounded-full text-xs font-medium whitespace-nowrap border border-gray-200">
                  Skills
                </button>
              )}
              {sections.portfolio && (
                <button className="px-3 py-1.5 bg-white text-gray-900 rounded-full text-xs font-medium whitespace-nowrap border border-gray-200">
                  Portfolio
                </button>
              )}
              {sections.blogs && (
                <button className="px-3 py-1.5 bg-white text-gray-900 rounded-full text-xs font-medium whitespace-nowrap border border-gray-200">
                  Blogs
                </button>
              )}
              {sections.contact && (
                <button className="px-3 py-1.5 bg-white text-gray-900 rounded-full text-xs font-medium whitespace-nowrap border border-gray-200">
                  Contact
                </button>
              )}
              {sections.cv && (
                <button className="px-3 py-1.5 bg-white text-gray-900 rounded-full text-xs font-medium whitespace-nowrap border border-gray-200">
                  CV
                </button>
              )}
            </div>

            {/* About Me Section */}
            <div className="space-y-3 pt-4 px-6">
              <h2 className="text-2xl font-bold text-gray-900">About me</h2>
              {profile.aboutMe && (
                <p className="text-base text-gray-700 leading-relaxed">{profile.aboutMe}</p>
              )}
            </div>

            {/* Highlights Section */}
            {profile.highlights && profile.highlights.length > 0 && (
              <div className="space-y-3 px-6">
                <h2 className="text-2xl font-bold text-gray-900">Highlights</h2>
                <ul className="space-y-3">
                  {profile.highlights.map((highlight, index) => (
                    <li key={index} className="text-base text-gray-700 flex items-start gap-2">
                      <span className="text-gray-900">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Device Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
      </div>
    </div>
  );
};

export default MobilePreviewModal;
