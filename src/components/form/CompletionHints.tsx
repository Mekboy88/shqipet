import React from 'react';
import { Clock, User, Lightbulb } from 'lucide-react';

interface CompletionHint {
  value: string;
  type: 'cached' | 'profile' | 'suggested';
}

interface CompletionHintsProps {
  hints: CompletionHint[];
  onApply: (value: string) => void;
  fieldId: string;
}

export const CompletionHints: React.FC<CompletionHintsProps> = ({ hints, onApply, fieldId }) => {
  if (!hints.length) return null;

  const getIcon = (type: CompletionHint['type']) => {
    switch (type) {
      case 'cached':
        return <Clock className="h-3 w-3 text-blue-500" />;
      case 'profile':
        return <User className="h-3 w-3 text-green-500" />;
      case 'suggested':
        return <Lightbulb className="h-3 w-3 text-yellow-500" />;
    }
  };

  const getDescription = (type: CompletionHint['type']) => {
    switch (type) {
      case 'cached':
        return 'Previously used';
      case 'profile':
        return 'From your profile';
      case 'suggested':
        return 'Suggested';
    }
  };

  return (
    <div className="absolute top-full left-0 mt-1 z-40 w-full min-w-64">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="p-2 bg-gray-50 border-b border-gray-100">
          <p className="text-xs text-gray-600 font-medium">Quick fill suggestions</p>
        </div>
        <div className="max-h-32 overflow-y-auto">
          {hints.map((hint, index) => (
            <button
              key={index}
              onClick={() => onApply(hint.value)}
              className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                {getIcon(hint.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{hint.value}</p>
                  <p className="text-xs text-gray-500">{getDescription(hint.type)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="p-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500">Click to auto-fill</p>
        </div>
      </div>
    </div>
  );
};