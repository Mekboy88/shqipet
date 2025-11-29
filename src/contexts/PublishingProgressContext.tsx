import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PublishingProgressContextType {
  isPublishing: boolean;
  publishingData: {
    content: string;
    hasFiles: boolean;
    files: File[];
  } | null;
  startPublishing: (content: string, hasFiles: boolean, files?: File[]) => void;
  stopPublishing: () => void;
}

const PublishingProgressContext = createContext<PublishingProgressContextType | undefined>(undefined);

export const usePublishingProgress = () => {
  const context = useContext(PublishingProgressContext);
  if (!context) {
    throw new Error('usePublishingProgress must be used within a PublishingProgressProvider');
  }
  return context;
};

interface PublishingProgressProviderProps {
  children: ReactNode;
}

export const PublishingProgressProvider: React.FC<PublishingProgressProviderProps> = ({ children }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingData, setPublishingData] = useState<{
    content: string;
    hasFiles: boolean;
    files: File[];
  } | null>(null);

  const startPublishing = (content: string, hasFiles: boolean, files: File[] = []) => {
    setPublishingData({ content, hasFiles, files });
    setIsPublishing(true);
  };

  const stopPublishing = () => {
    setIsPublishing(false);
    setPublishingData(null);
  };

  return (
    <PublishingProgressContext.Provider value={{
      isPublishing,
      publishingData,
      startPublishing,
      stopPublishing
    }}>
      {children}
    </PublishingProgressContext.Provider>
  );
};