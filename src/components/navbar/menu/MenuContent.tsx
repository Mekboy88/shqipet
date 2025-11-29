import React, { forwardRef } from 'react';
import MenuSection from './MenuSection';
import { menuSections } from './menuData';
const MenuContent = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} className="w-[360px] bg-white rounded-xl shadow-lg my-[0px] mx-[3px] px-px py-[10px]">
      {/* Search section - now scrolls with the content */}
      <div className="bg-white p-6 mb-1 py-0">
        <div className="w-full bg-gray-100 rounded-full p-3 flex items-center py-[7px]">
          <svg className="w-5 h-5 text-gray-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input type="text" placeholder="Search" className="bg-transparent w-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none" />
        </div>
      </div>

      {/* Menu sections */}
      <div className="px-6 pb-0">
        {menuSections.map((section, index) => <MenuSection key={index} {...section} />)}
      </div>
    </div>;
});
MenuContent.displayName = 'MenuContent';
export default MenuContent;