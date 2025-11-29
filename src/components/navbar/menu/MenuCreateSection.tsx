
import React from 'react';
import { Plus, Star, Megaphone, Users, Calendar, ShoppingBag, Heart } from 'lucide-react';

const createItems = [{
  icon: Plus,
  title: 'Post'
}, {
  icon: Plus,
  title: 'Story'
}, {
  icon: Plus,
  title: 'Reel'
}, {
  icon: Star,
  title: 'Life event'
}, {
  icon: Plus,
  title: 'Page'
}, {
  icon: Megaphone,
  title: 'Ad'
}, {
  icon: Users,
  title: 'Group'
}, {
  icon: Calendar,
  title: 'Event'
}, {
  icon: ShoppingBag,
  title: 'Marketplace listing'
}, {
  icon: Heart,
  title: 'Fundraiser'
}];

const MenuCreateSection = () => {
  const handleItemClick = (title: string) => {
    console.log(`${title} clicked - functionality not implemented`);
  };

  return (
    <div className="w-[200px] h-[600px] bg-white rounded-xl shadow-lg p-4 fixed top-[90px] right-[15px] px-[17px] mx-[-165px] py-[4px] my-[-15px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Create</h2>
      </div>
      
      <div className="space-y-3">
        {createItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer py-[5px] my-[13px]"
            onClick={() => handleItemClick(item.title)}
          >
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
              <item.icon className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCreateSection;
