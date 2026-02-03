"use client"

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import supportedRegions from '@/data/supported-regions';
import { getPreference, setPreference } from '@/lib/preferences';

const PreferenceSelector = () => {
  const [selectedPreference, setSelectedPreference] = useState(getPreference());
  
  const handlePreferenceChange = (value: string) => {
    setPreference(value);
    setSelectedPreference(value);
  };

  const countryRegions = supportedRegions.filter(region => region.type === 'country');
  const subRegionRegions = supportedRegions.filter(region => region.type === 'sub-region');

  const countryMap = new Map(countryRegions.map(region => [region.code, region.name]));
  const subRegionMap = new Map(subRegionRegions.map(region => [region.code, region.name]));

  const countryOptions = Array.from(countryMap.values());
  const subRegionOptions = Array.from(subRegionMap.values());

  return (
    <div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <Select 
          value={selectedPreference || ""} 
          onValueChange={handlePreferenceChange}
        >
          <SelectTrigger className="w-auto md:w-[150px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-plus-jakarta-sans">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
            {countryOptions.map(option => (
              <SelectItem 
                key={option} 
                value={option} 
                className="hover:bg-gray-100 focus:bg-gray-100 font-plus-jakarta-sans"
              >
                {option}
              </SelectItem>
            ))}
            {subRegionOptions.map(option => (
              <SelectItem 
                key={option} 
                value={option} 
                className="hover:bg-gray-100 focus:bg-gray-100 font-plus-jakarta-sans"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default PreferenceSelector