
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center">
      <Logo size="lg" className="text-3xl font-cinzel whitespace-nowrap ml-1" />
    </Link>
  );
};

export default NavbarLogo;
