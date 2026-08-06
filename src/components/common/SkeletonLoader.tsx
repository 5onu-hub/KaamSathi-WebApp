import React from "react";

export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full py-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="flex justify-between pt-4 border-t border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
