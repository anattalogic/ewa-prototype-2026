/**
 * EWA 3.0 2026 — Enterprise UI Prototype
 * Design: Neobrutalist Fintech | Primary: Deep Navy (#1e3a5f) | Accent: Teal (#0ea5e9)
 * Command Center Layout | Role-Based View Switching | 18 Enterprise Modules
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ViewProvider } from "./contexts/ViewContext";
import { PortalLayout } from "./layouts/PortalLayout";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={PortalLayout} />
      <Route path={"/module/:module"} component={PortalLayout} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <ViewProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ViewProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
