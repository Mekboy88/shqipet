
import React from 'react';

interface DetailItemProps {
  label: string;
  value?: React.ReactNode;
  isDarkTheme: boolean;
}

export function DetailItem({ label, value, isDarkTheme }: DetailItemProps) {
  const labelColor = isDarkTheme ? 'text-[#C7C7CC]' : 'text-[#8B7355]';
  const valueColor = isDarkTheme ? 'text-white' : 'text-[#2C2928]';
  const borderColor = isDarkTheme ? 'border-white/10' : 'border-[#8B7355]/20';

  return (
    <div className={`flex justify-between items-start py-2 border-b ${borderColor}`}>
      <p className={`${labelColor} text-sm font-sans`}>{label}</p>
      <div className={`${valueColor} text-sm font-sans text-right max-w-[70%] break-words`}>
        {value || 'N/A'}
      </div>
    </div>
  );
}
