
import React from 'react';

interface CountrySelectorProps {
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  disabled: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ countries, selectedCountry, onCountryChange, disabled }) => {
  return (
    <div className="relative">
      <select
        id="country-selector"
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        disabled={disabled}
        className="block w-full px-4 py-3 pr-8 text-base text-white bg-gray-800 border-2 border-gray-700 rounded-lg shadow-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
        </svg>
      </div>
    </div>
  );
};

export default CountrySelector;
