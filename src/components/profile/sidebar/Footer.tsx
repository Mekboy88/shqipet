import React from 'react';

const Footer = () => {
  return (
    <div className="text-xs text-gray-500 py-4 mb-10">
      <div className="flex flex-wrap gap-2">
        <span className="hover:underline cursor-pointer">Privatësia</span>
        <span>·</span>
        <span className="hover:underline cursor-pointer">Kushtet</span>
        <span>·</span>
        <span className="hover:underline cursor-pointer">Reklamimi</span>
        <span>·</span>
        <span className="hover:underline cursor-pointer">Zgjedhjet e Reklamave</span>
        <span>·</span>
        <span className="hover:underline cursor-pointer">Cookies</span>
        <span>·</span>
        <span className="hover:underline cursor-pointer">Më shumë</span>
        <span>·</span>
        <span>MetaAlbos © 2025</span>
      </div>
    </div>
  );
};

export default Footer;