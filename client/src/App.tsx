import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/_core/hooks/useAuth";
import { useUserStore } from "@/store";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch } from "wouter";
import i18n from "@/lib/i18n";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Comparison from "./pages/Comparison";
import Chat from "./pages/Chat";
import Journey from "./pages/Journey";
import Safety from "./pages/Safety";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import Transit from "./pages/Transit";
import Places from "./pages/Places";

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/transit" component={Transit} />
      {isAuthenticated && (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/planner" component={Planner} />
          <Route path="/comparison" component={Comparison} />
          <Route path="/chat" component={Chat} />
          <Route path="/journey" component={Journey} />
          <Route path="/safety" component={Safety} />
          <Route path="/rewards" component={Rewards} />
          <Route path="/profile" component={Profile} />
          <Route path="/transit" component={Transit} />
          <Route path="/places" component={Places} />
        </>
      )}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { preferences } = useUserStore();

  // Initialize language
  useEffect(() => {
    i18n.changeLanguage(preferences.language);
  }, [preferences.language]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme={preferences.theme} switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
