import { Link } from "wouter";
import { CheckSquare, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
          <Link href="/" className="flex items-center gap-2 group transition-all duration-200 hover:opacity-80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/20 group-hover:shadow-md group-hover:shadow-primary/30 transition-all duration-300">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold font-display tracking-tight text-foreground">
              TaskFlow
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            )}

            <Link
              href="/tasks/new"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Nueva tarea
            </Link>

            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Hecho con React &amp; Replit Agent</p>
      </footer>
    </div>
  );
}
