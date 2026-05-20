"use client";

import React, { FC } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Dynamically import the components to enable code splitting
const MobileHeader = dynamic(() => import("./mobile-header"), { ssr: false });
const DesktopHeader = dynamic(() => import("./desktop-header"), { ssr: false });

const Header: FC = () => {  
    const pathname = usePathname();

    // Request region form — minimal NV only (design mockup)
    if (pathname?.startsWith("/request-region")) {
      return (
        <header className="w-full shrink-0 border-b border-gray-200 bg-white pt-[env(safe-area-inset-top)]">
          <div className="flex items-center px-4 py-3.5 sm:px-6 sm:py-4">
            <a
              href="/"
              className="text-[22px] font-bold leading-none tracking-tight text-gray-900 font-plus-jakarta-sans sm:text-[24px]"
            >
              NV
            </a>
          </div>
        </header>
      );
    }

    // Region picker: white bar — NV left, help text centered (matches alerts flow mockup)
    if (pathname?.includes("/region")) {
      return (
        <header className="w-full bg-white border-b border-gray-200 pt-[env(safe-area-inset-top)] shrink-0">
          <div className="relative flex items-center justify-center min-h-[56px] px-4 sm:px-6 py-3.5">
            <a
              href="/"
              className="absolute left-4 sm:left-6 text-[22px] sm:text-[24px] font-bold tracking-tight text-gray-900 font-plus-jakarta-sans leading-none"
            >
              NV
            </a>
            <p className="text-[14px] sm:text-[16px] text-gray-900 font-plus-jakarta-sans text-center max-w-[min(100%,18rem)] sm:max-w-none leading-snug pl-10 pr-2 sm:pl-0 sm:pr-0">
              Don&apos;t see your region? Click{" "}
              <Link href="/request-region" className="text-[#E12D39] font-semibold hover:underline">
                here
              </Link>
            </p>
          </div>
        </header>
      );
    }

    // Minimal header for /subscription
    if (pathname?.startsWith("/subscription")) {
      return (
        <header className="w-full bg-page pt-[env(safe-area-inset-top)]">
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center">
            <a href="/" className="text-[18px] font-bold text-gray-900 font-plus-jakarta-sans">
              NV
            </a>
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