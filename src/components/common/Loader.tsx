import React from "react";
import { Wrench } from "lucide-react";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-bounce">
        <Wrench className="w-7 h-7" />
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-600 animate-pulse">Loading KaamSathi...</p>
    </div>
  );
}
