// pages/_app.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { AuthProvider } from "../src/context/AuthContext";
import { SnackbarProvider } from "../src/context/SnackbarContext";
const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SnackbarProvider>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </QueryClientProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
}
