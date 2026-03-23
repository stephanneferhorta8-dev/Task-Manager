import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 bg-secondary text-muted-foreground rounded-3xl flex items-center justify-center mb-6 rotate-12">
          <FileQuestion className="w-10 h-10 -rotate-12" />
        </div>
        <h1 className="text-4xl font-bold font-display text-foreground mb-3">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        <Link 
          href="/" 
          className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
        >
          Back to Dashboard
        </Link>
      </div>
    </Layout>
  );
}
