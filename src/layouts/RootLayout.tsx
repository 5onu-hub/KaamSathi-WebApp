import React from "react";
import { Outlet } from "react-router-dom";
import { RoleBasedNavbar, RoleBasedFooter } from "../components/rbac/RBACComponents";
import { AIAssistantWidget } from "../components/ai/AIAssistantWidget";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      <RoleBasedNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <RoleBasedFooter />
      <AIAssistantWidget />
    </div>
  );
}

