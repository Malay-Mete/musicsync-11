
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "@/context/MusicContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import MobileScreen from "./components/mobile/MobileScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" attribute="class">
      <TooltipProvider>
        <MusicProvider>
          <Toaster />
          <Sonner position="top-right" expand={false} />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileScreen />
          </BrowserRouter>
        </MusicProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
