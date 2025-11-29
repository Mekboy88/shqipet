
import React from "react";
import { Clock, X, ArrowLeft } from "lucide-react";
import { AdminSearchHistoryItem as AdminSearchHistoryItemType } from "./AdminSearchHistory";
import AdminSearchHistoryItem from "./AdminSearchHistoryItem";

interface AdminSearchDropdownProps {
  isVisible: boolean;
  isExpanded: boolean;
  searchQuery: string;
  searchHistory: AdminSearchHistoryItemType[];
  showHistory: boolean;
  onCloseDropdown: () => void;
  onRemoveItem: (id: string) => void;
}

const AdminSearchDropdown: React.FC<AdminSearchDropdownProps> = ({
  isVisible,
  isExpanded,
  searchQuery,
  searchHistory,
  showHistory,
  onCloseDropdown,
  onRemoveItem
}) => {
  if (!isVisible) {
    return null;
  }
  
  return (
    <div 
      className="absolute top-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-top border border-gray-200"
      style={{
        width: isExpanded ? '384px' : '256px',
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? 'scale(1)' : 'scale(0.95)',
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1)",
        transformOrigin: "top right",
        pointerEvents: isExpanded ? 'auto' : 'none',
        right: 0,
        zIndex: 1000,
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      {/* Content section - conditionally shown */}
      {showHistory && searchQuery.length > 0 && (
        <div>
          <div className="flex justify-between items-center px-4 py-3">
            <h3 className="text-base font-semibold text-gray-800">Admin Recent Searches</h3>
            <button className="text-blue-500 text-sm font-medium hover:underline">
              Clear
            </button>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            {searchHistory.length > 0 ? (
              searchHistory.map(item => (
                <AdminSearchHistoryItem 
                  key={item.id} 
                  item={item} 
                  onRemove={onRemoveItem} 
                />
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {!showHistory && (
        <div className="px-4 py-6 text-center text-gray-500">
          Enter your search query
        </div>
      )}
    </div>
  );
};

export default AdminSearchDropdown;
