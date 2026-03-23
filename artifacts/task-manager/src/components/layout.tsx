import { Link } from "wouter";
import { CheckSquare } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
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
          <nav>
            <Link 
              href="/tasks/new" 
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              New Task
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Built with React & Replit Agent</p>
      </footer>
    </div>
  );
}
