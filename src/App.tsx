/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { AppRoutes } from "./routes/AppRoutes";
import { RBACProvider } from "./components/rbac/RBACComponents";

const queryClient = new QueryClient();

const clerkPubKey = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_bW9jay1jbGVyay1rZXk=";

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RBACProvider>
            <AppRoutes />
          </RBACProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  );
}



