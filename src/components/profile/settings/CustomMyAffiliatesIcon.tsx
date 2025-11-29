import React from 'react';

interface CustomMyAffiliatesIconProps {
  className?: string;
}

const CustomMyAffiliatesIcon: React.FC<CustomMyAffiliatesIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M8.21275 13.5089C7.14116 13.241 6.0553 13.8925 5.7874 14.9641L5.34806 16.7215C5.05478 17.8946 5.53062 19.1254 6.53674 19.7962C8.0489 20.8043 10.1055 20.1655 10.7805 18.4781L12.354 14.5442L8.21275 13.5089Z" 
        fill="#152C70"
      />
      <path 
        d="M19.8206 5.40707C19.0181 4.00278 17.194 3.57215 15.8482 4.46933L14.9588 5.06224C12.8321 6.48006 10.3333 7.23665 7.77725 7.23665H6C3.79086 7.23665 2 9.02751 2 11.2366C2 13.4458 3.79086 15.2366 6 15.2366H7.77725C10.3333 15.2366 12.8321 15.9932 14.9588 17.4111L15.8482 18.004C17.194 18.9011 19.0181 18.4705 19.8206 17.0662C21.8847 13.4539 21.8847 9.01937 19.8206 5.40707Z" 
        fill="#4296FF"
      />
    </svg>
  );
};

export default CustomMyAffiliatesIcon;