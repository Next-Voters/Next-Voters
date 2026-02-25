"use client"

import React, { useState } from "react";
import headerItems from "@/data/header";
import AuthButtons from "./components/auth-buttons";
import { Menu, X } from "lucide-react";

const MobileHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <header className="w-full bg-page pt-[env(safe-area-inset-top)]">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <a href="/" className="text-[18px] font-bold text-gray-900 font-plus-jakarta-sans shrink-0">
            NV
          </a>
          <a
            href="/fellowship"
            className="bg-[#E12D39] text-[11px] sm:text-[12px] text-white px-3 sm:px-4 py-2 rounded font-medium font-plus-jakarta-sans min-h-[44px] inline-flex items-center justify-center touch-manipulation shrink-0"
          >
            BECOME A FELLOW
          </a>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation -mr-2"
        >
          {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </div>

      {isOpen && (
        <nav
          className="bg-page w-full text-sm font-medium font-plus-jakarta-sans text-gray-900 border-t border-gray-200"
          style={{ backdropFilter: "blur(3px)" }}
        >
          <ul className="flex flex-col py-2">
            {headerItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="block py-3.5 px-4 min-h-[48px] flex items-center rounded-none hover:bg-gray-100 active:bg-gray-200 touch-manipulation"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li className="border-t border-gray-200">
              <div className="py-3 px-4 min-h-[48px] flex items-center">
                <AuthButtons variant="mobile" />
              </div>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default MobileHeader;
