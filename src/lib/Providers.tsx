"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import { queryClient } from "./queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
      />
    </QueryClientProvider>
  );
}
