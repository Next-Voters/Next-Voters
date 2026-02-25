"use client";

import { useState, useEffect, ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";

interface ClientMountWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className: string;
}

export default function ClientMountWrapper({ 
  children, 
  fallback,
  className
}: ClientMountWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={className}>
        {fallback || (
          <div className="min-h-screen flex items-center justify-center bg-page">
            <Spinner size="lg" className="bg-black" />
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
