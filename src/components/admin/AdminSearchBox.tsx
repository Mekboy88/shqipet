
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import AdminSearchDropdown from "./AdminSearchDropdown";
import { AdminSearchHistoryItem, ADMIN_MOCK_SEARCH_HISTORY } from "./AdminSearchHistory";

const AdminSearchBox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState<AdminSearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        // First close the dropdown, then collapse the search bar
        setIsDropdownVisible(false);
        setTimeout(() => {
          setIsExpanded(false);
          // Clear search query when dropdown is closed
          setSearchQuery("");
        }, 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    // First expand the search bar and immediately show dropdown
    setIsExpanded(true);
    setIsDropdownVisible(true);
    // Start with empty dropdown
    setShowHistory(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newItem: AdminSearchHistoryItem = {
        id: Date.now().toString(),
        text: searchQuery,
      };
      
      const updatedHistory = [newItem, ...ADMIN_MOCK_SEARCH_HISTORY.filter(item => item.text !== searchQuery)].slice(0, 8);
      setSearchHistory(updatedHistory);
      localStorage.setItem('adminSearchHistory', JSON.stringify(updatedHistory));
      
      setSearchQuery("");
      setIsDropdownVisible(false);
      setTimeout(() => {
        setIsExpanded(false);
      }, 200);
    }
  };

  const handleCloseDropdown = () => {
    setIsDropdownVisible(false);
    setTimeout(() => {
      setIsExpanded(false);
      // Clear search query when dropdown is closed
      setSearchQuery("");
    }, 200);
  };

  const handleRemoveItem = (id: string) => {
    const updatedHistory = searchHistory.filter(item => item.id !== id);
    setSearchHistory(updatedHistory);
    localStorage.setItem('adminSearchHistory', JSON.stringify(updatedHistory));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Show history after user starts typing
    if (e.target.value.length > 0) {
      setSearchHistory(ADMIN_MOCK_SEARCH_HISTORY.filter(item => 
        item.text.toLowerCase().includes(e.target.value.toLowerCase())
      ));
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  };

  return (
    <div className="relative" ref={searchBoxRef}>
      {/* Search input with horizontal expansion */}
      <div className="flex items-center">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Admin Search"
            className={`bg-white/80 rounded-full pl-11 pr-4 py-2.5 
              ${isExpanded ? 'w-96' : 'w-64'} 
              text-sm focus:outline-none text-gray-800 placeholder:text-gray-700 
              transition-all duration-300 ease-in-out border border-gray-300 shadow-sm hover:bg-white/95`}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="text-gray-500">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      
      {/* AdminSearchDropdown component - portal it outside to prevent layout shifting */}
      {isDropdownVisible && (
        <AdminSearchDropdown 
          isVisible={isDropdownVisible}
          isExpanded={isExpanded}
          searchQuery={searchQuery}
          searchHistory={searchHistory}
          showHistory={showHistory}
          onCloseDropdown={handleCloseDropdown}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </div>
  );
};

export default AdminSearchBox;
