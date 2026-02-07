"use client";

import React, { FC } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Dynamically import the components to enable code splitting
const MobileHeader = dynamic(() => import("./mobile-header"), { ssr: false });
const DesktopHeader = dynamic(() => import("./desktop-header"), { ssr: false });

const Header: FC = () => {  
    const pathname = usePathname();

    // Minimal header for landing pages where nav would distract
    if (pathname?.startsWith("/next-voters-line")) {
      return (
        <header className="w-full bg-white">
          <div className="px-6 py-4 flex items-center">
            <span className="text-[18px] font-bold text-gray-900 font-plus-jakarta-sans">
              NV
            </span>
          </div>
        </header>
      );
    }

    return (
      <>
        <div className="md:hidden">
          <MobileHeader />
        </div>
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
      </>
    );
};

export default Header;