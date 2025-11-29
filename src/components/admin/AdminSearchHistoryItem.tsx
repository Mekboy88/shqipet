
import React from "react";
import { Clock, X } from "lucide-react";
import { AdminSearchHistoryItem as AdminSearchHistoryItemType } from "./AdminSearchHistory";
import { Button } from "@/components/ui/button";

interface AdminSearchHistoryItemProps {
  item: AdminSearchHistoryItemType;
  onRemove: (id: string) => void;
}

const AdminSearchHistoryItem: React.FC<AdminSearchHistoryItemProps> = ({
  item,
  onRemove
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 cursor-pointer group">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-200 rounded-full p-2">
          {item.image ? (
            <img src={item.image} alt="" className="w-4 h-4" />
          ) : (
            <Clock className="w-4 h-4 text-gray-500" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">{item.text}</span>
          {item.isNew && (
            <span className="text-xs text-blue-600 font-medium">New</span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering parent click events
          onRemove(item.id);
        }}
      >
        <X className="h-4 w-4 text-gray-500" />
      </Button>
    </div>
  );
};

export default AdminSearchHistoryItem;
