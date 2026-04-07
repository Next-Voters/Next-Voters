import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingMessageBubble = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {[0, 1].map((i) => (
        <div key={i} className="flex-1 rounded-2xl border border-gray-200 bg-white p-5">
          <Skeleton className="h-4 w-1/3 mb-4" />
          <div className="space-y-2.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingMessageBubble;
