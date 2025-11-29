import React from 'react';
import MenuSectionItem from './MenuSectionItem';
interface MenuSectionProps {
  title: string;
  items: Array<{
    icon: React.ComponentType<{
      className?: string;
    }>;
    title: string;
    description: string;
    bgColor: string;
    iconColor: string;
  }>;
  isLast?: boolean;
}
const MenuSection = ({
  title,
  items,
  isLast = false
}: MenuSectionProps) => {
  return <div className="my-0 py-0">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => <MenuSectionItem key={index} {...item} />)}
      </div>
    </div>;
};
export default MenuSection;