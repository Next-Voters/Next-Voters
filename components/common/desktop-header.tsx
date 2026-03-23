"use client"

import React from "react";
import headerItems from "@/data/header";
import AuthButtons from "./components/auth-buttons";

const DesktopHeader: React.FC = () => {
  return (
    <div className="w-full bg-page">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="/" className="text-[18px] font-bold text-gray-900 font-plus-jakarta-sans">
            NV
          </a>
          <a
            href="/fellowship"
            className="bg-[#E12D39] text-[12px] text-white px-4 py-2 rounded font-medium font-plus-jakarta-sans min-h-[44px] inline-flex items-center hover:bg-[#c62832] transition-colors"
          >
            BECOME A FELLOW
          </a>
        </div>

        <nav className="text-sm font-medium font-plus-jakarta-sans text-gray-900">
          <ul className="flex items-center gap-1">
            {headerItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="block py-2 px-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded hover:bg-gray-100"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <AuthButtons variant="desktop" />
      </div>
    </div>
  );
};

export default DesktopHeader;
