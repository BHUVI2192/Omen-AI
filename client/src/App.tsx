import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import Workspace from "./pages/Workspace";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/login" component={AuthPage} />
    <Route path="/signup" component={AuthPage} />
    <Route path="/auth" component={AuthPage} />
    <Route path="/onboarding" component={OnboardingPage} />
    <Route path="/app">{() => <Workspace />}</Route>
    <Route path="/app/:rest*">{() => <Workspace />}</Route>
    <Route path="/tpo">{() => <Workspace mode="tpo" />}</Route>
    <Route path="/tpo/:rest*">{() => <Workspace mode="tpo" />}</Route>
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
