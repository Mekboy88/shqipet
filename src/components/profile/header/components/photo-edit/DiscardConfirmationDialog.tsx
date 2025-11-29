
import React from 'react';
import { X } from 'lucide-react';
interface DiscardConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
export const DiscardConfirmationDialog: React.FC<DiscardConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#fcfcfc]/[0.53]">
      <div className="bg-white rounded-lg shadow-xl w-[500px] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header with bottom border */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Hidh ndryshimet</h2>
          <button onClick={onCancel} className="p-1 rounded-full transition-colors bg-gray-300 hover:bg-gray-200">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex items-start justify-start">
          <p className="text-gray-600 text-left text-base font-medium">A jeni të sigurt që dëshironi t'i hidhni ndryshimet tuaja?</p>
        </div>

        {/* Bottom Buttons */}
        <div className="p-4 bg-white mx-[240px]">
          <div className="flex items-center gap-3 justify-center mx-[129px] px-0">
            <button onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Anuloj
            </button>
            <button onClick={onConfirm} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-900 hover:from-red-700 hover:to-red-950 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              Hidhi
            </button>
          </div>
        </div>
      </div>
    </div>;
};
