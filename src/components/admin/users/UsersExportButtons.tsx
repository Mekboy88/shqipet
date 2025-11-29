
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface UsersExportButtonsProps {
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export function UsersExportButtons({
  onExportCSV,
  onExportJSON,
}: UsersExportButtonsProps) {
  return (
    <div className="flex justify-end gap-2 mb-6">
      <Button
        variant="outline"
        onClick={onExportCSV}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" /> Export CSV
      </Button>
      <Button
        variant="default"
        onClick={onExportJSON}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" /> Export JSON
      </Button>
    </div>
  );
}
