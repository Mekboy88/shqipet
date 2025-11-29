import React from 'react';
interface MenuSectionItemProps {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}
const MenuSectionItem = ({
  icon: Icon,
  title,
  description,
  bgColor,
  iconColor
}: MenuSectionItemProps) => {
  return <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer py-0">
      <div className={`w-9 h-9 ${bgColor} rounded-lg flex items-center justify-center mr-3`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-900 block">{title}</span>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
    </div>;
};
export default MenuSectionItem;