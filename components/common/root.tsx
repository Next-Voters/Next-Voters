"use client";

import { useState } from "react";
import type { FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { usePathname } from "next/navigation";

interface RootProps {
  children: ReactNode;
}

// Routes where the footer should not appear
const NO_FOOTER_PATTERNS = ["/chat", "/next-voters-line", "/alerts"];

const Root: FC<RootProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const pathname = usePathname();
  const showFooter = !NO_FOOTER_PATTERNS.some((p) => pathname.startsWith(p));

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <main className="flex min-h-0 flex-1 flex-col">
          <Header />
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </QueryClientProvider>
  );
};

export default Root;
