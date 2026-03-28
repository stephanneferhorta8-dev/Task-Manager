import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@workspace/replit-auth-web";
import NotFound from "@/pages/not-found";
import TaskList from "@/pages/task-list";
import TaskNew from "@/pages/task-new";
import TaskEdit from "@/pages/task-edit";
import { CheckSquare, LogIn, Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">TaskFlow</h1>
            <p className="mt-2 text-muted-foreground">Organize your work beautifully</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your personal task list and keep your work organized.
            </p>
          </div>
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <LogIn className="w-4 h-4" />
            Sign in to continue
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Your tasks are private and only visible to you.
        </p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Switch>
      <Route path="/" component={TaskList} />
      <Route path="/tasks/new" component={TaskNew} />
      <Route path="/tasks/:id/edit" component={TaskEdit} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
