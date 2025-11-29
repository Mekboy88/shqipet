
import React from "react";
import Avatar from "@/components/Avatar";
import { useUniversalUser } from '@/hooks/useUniversalUser';

interface CreatePostUserInfoProps {
  userName?: string;
  userImage?: string;
  initials?: string;
  isAnonymous?: boolean;
}

const CreatePostUserInfo: React.FC<CreatePostUserInfoProps> = ({ isAnonymous = false }) => {
  // Use global avatar hook - ignore props for consistency
  const { displayName } = useUniversalUser();

  return (
    <div className="flex items-center gap-2">
      {isAnonymous ? (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-600" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm10 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-5 7c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z"/>
          </svg>
        </div>
      ) : (
        <Avatar size="md" />
      )}
      <div className="flex flex-col">
        <span className="font-semibold">{isAnonymous ? "Anonymous" : displayName || "User"}</span>
        <button className="flex items-center gap-1 bg-gray-200 rounded-md px-2 py-0.5 text-sm">
          <span>Only me</span>
          <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
            <path d="M11.293 4.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 7.586l3.293-3.293z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CreatePostUserInfo;
