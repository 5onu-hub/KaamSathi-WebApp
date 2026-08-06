import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { AIAssistantWidget } from "../components/ai/AIAssistantWidget";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIAssistantWidget />
    </div>
  );
}
