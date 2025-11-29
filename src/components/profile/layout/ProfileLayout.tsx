
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import NewMessageDialog from '@/components/layout/messages/NewMessageDialog';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="min-h-screen">
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Desktop Profile Layout - NO internal navbar, use main NavbarNoTooltip */}
      <div className="w-full">
        <div className="w-full h-full">
          {children}
        </div>
      </div>

      {/* New Message Button - positioned at right border, outside sidebar */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsNewMessageOpen(true)} 
          className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors my-[15px] mx-[14px] py-0"
        >
          <img src="/lovable-uploads/1bbe811f-f60f-46b4-a110-736f5121ebcc.png" alt="Edit" className="w-11 h-11" />
        </button>
      </div>

      <NewMessageDialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen} />
    </div>
  );
};

export default ProfileLayout;
