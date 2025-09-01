import React from 'react';
import { ChartBarIcon } from './Icon';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  return (
    <header role="banner" className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'bg-brand-gray-dark/80 backdrop-blur-sm border-b border-brand-gray-light shadow-lg' 
        : 'bg-brand-gray-dark border-b border-brand-gray-dark shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-brand-gold" aria-hidden="true" />
            <h1 className="ms-3 text-2xl font-display font-bold text-white tracking-wider">
              محلل الذهب الجيو-سياسي
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;