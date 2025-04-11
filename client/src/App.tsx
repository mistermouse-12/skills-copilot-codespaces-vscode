import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { UserProvider } from "@/lib/userContext";
import { ProtectedRoute } from "@/lib/protected-route";

// Pages
import LandingPage from "@/pages/LandingPage";
import ExplanationPage from "@/pages/ExplanationPage";
import MotivationPage from "@/pages/MotivationPage";
import SignUpPage from "@/pages/SignUpPage";
import AuthPage from "@/pages/auth-page";
import LoadingScreen from "@/pages/LoadingScreen";
import HomePage from "@/pages/HomePage";
import MatchingPage from "@/pages/MatchingPage";
import NewProfilePage from "@/pages/NewProfilePage";
import EnhancedProfilePage from "@/pages/EnhancedProfilePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Rutas públicas */}
      <Route path="/" component={LandingPage} />
      <Route path="/explanation" component={ExplanationPage} />
      <Route path="/motivation" component={MotivationPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={AuthPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/loading" component={LoadingScreen} />

      {/* Rutas protegidas */}
      <ProtectedRoute path="/home" component={HomePage} />
      <ProtectedRoute path="/matching" component={MatchingPage} />
      <ProtectedRoute path="/profile" component={EnhancedProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <Router />
          <Toaster />
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
