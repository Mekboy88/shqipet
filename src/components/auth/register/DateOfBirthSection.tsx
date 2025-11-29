import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DateOfBirthSectionProps = {
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  onSelectChange: (name: string, value: string) => void;
};

const DateOfBirthSection = ({
  birthDay,
  birthMonth,
  birthYear,
  onSelectChange
}: DateOfBirthSectionProps) => {
  // Generate days, months, and years for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const months = [
    { value: '1', label: 'Janar' },
    { value: '2', label: 'Shkurt' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Prill' },
    { value: '5', label: 'Maj' },
    { value: '6', label: 'Qershor' },
    { value: '7', label: 'Korrik' },
    { value: '8', label: 'Gusht' },
    { value: '9', label: 'Shtator' },
    { value: '10', label: 'Tetor' },
    { value: '11', label: 'Nëntor' },
    { value: '12', label: 'Dhjetor' }
  ];
  
  // Calculate minimum year for 16+ age restriction
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 16; // Only people 16+ can register
  const years = Array.from({ length: 100 }, (_, i) => maxYear - i);

  return (
    <div>
      <Label className="text-xs text-facebook-gray">Data e lindjes - +16 vjeç të lejuar vetëm</Label>
      <div className="grid grid-cols-3 gap-3 mt-1">
        <Select onValueChange={value => onSelectChange('birthDay', value)} value={birthDay}>
          <SelectTrigger>
            <SelectValue placeholder="Dita" />
          </SelectTrigger>
          <SelectContent>
            {days.map(day => (
              <SelectItem key={day} value={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={value => onSelectChange('birthMonth', value)} value={birthMonth}>
          <SelectTrigger>
            <SelectValue placeholder="Muaji" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={value => onSelectChange('birthYear', value)} value={birthYear}>
          <SelectTrigger>
            <SelectValue placeholder="Viti" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DateOfBirthSection;
