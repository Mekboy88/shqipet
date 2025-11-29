
import React from 'react';

interface DomainRedirectHandlerProps {
  children: React.ReactNode;
}

// Simplified component - no domain logic
const DomainRedirectHandler: React.FC<DomainRedirectHandlerProps> = ({ children }) => {
  return <>{children}</>;
};

export default DomainRedirectHandler;
