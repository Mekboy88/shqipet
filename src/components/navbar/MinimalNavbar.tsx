import React from "react";
import NavbarLeftContent from "./NavbarLeftContent";
import NavbarRightContent from "./NavbarRightContent";

interface MinimalNavbarProps {
  professionalControls?: React.ReactNode;
  professionalEditMode?: boolean;
  setProfessionalEditMode?: (value: boolean) => void;
  professionalSections?: {
    home: boolean;
    skills: boolean;
    portfolio: boolean;
    blogs: boolean;
    contact: boolean;
    cv: boolean;
  };
  setProfessionalSections?: React.Dispatch<React.SetStateAction<{
    home: boolean;
    skills: boolean;
    portfolio: boolean;
    blogs: boolean;
    contact: boolean;
    cv: boolean;
  }>>;
  professionalSocials?: Array<{
    label: string;
    url: string;
    icon?: string;
  }>;
  setProfessionalSocials?: React.Dispatch<React.SetStateAction<Array<{
    label: string;
    url: string;
    icon?: string;
  }>>>;
  professionalHireButton?: {
    enabled: boolean;
    text: string;
    url: string;
    email: string;
  };
  setProfessionalHireButton?: React.Dispatch<React.SetStateAction<{
    enabled: boolean;
    text: string;
    url: string;
    email: string;
  }>>;
  professionalProfile?: {
    firstName: string;
    lastName: string;
    presentation: string;
    photoUrl: string;
    aboutMe: string;
    highlights: string[];
  };
  isOwner?: boolean;
  hireButtonLoaded?: boolean;
  isSavingHireButton?: boolean;
}

const MinimalNavbar: React.FC<MinimalNavbarProps> = ({ 
  professionalControls, 
  professionalEditMode, 
  setProfessionalEditMode,
  professionalSections,
  setProfessionalSections,
  professionalSocials,
  setProfessionalSocials,
  professionalHireButton,
  setProfessionalHireButton,
  professionalProfile,
  isOwner,
  hireButtonLoaded,
  isSavingHireButton
}) => {
  return (
    <header 
      className="bg-white shadow-sm fixed top-0 w-full border-b border-gray-200"
      style={{
        zIndex: 1000,
        position: 'fixed'
      }}
    >
      <nav className="flex items-center justify-between w-full h-14 px-4 max-w-none mx-auto">
        {/* Left Section - Logo */}
        <div className="flex items-center flex-shrink-0">
          <NavbarLeftContent />
        </div>
        
        {/* Middle Section - Professional Presentation Controls (only when provided) */}
        {professionalControls && (
          <div className="flex items-center justify-center flex-1 gap-2">
            {professionalControls}
          </div>
        )}
        
        {/* Right Section - Avatar Dropdown */}
        <div className="flex items-center justify-end flex-shrink-0">
          <NavbarRightContent 
            professionalEditMode={professionalEditMode}
            setProfessionalEditMode={setProfessionalEditMode}
            professionalSections={professionalSections}
            setProfessionalSections={setProfessionalSections}
            professionalSocials={professionalSocials}
            setProfessionalSocials={setProfessionalSocials}
            professionalHireButton={professionalHireButton}
            setProfessionalHireButton={setProfessionalHireButton}
            professionalProfile={professionalProfile}
            isOwner={isOwner}
            hireButtonLoaded={hireButtonLoaded}
            isSavingHireButton={isSavingHireButton}
          />
        </div>
      </nav>
    </header>
  );
};

export default MinimalNavbar;
