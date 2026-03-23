import { useState, useMemo } from "react";
import { useGetTasks } from "@workspace/api-client-react";
import { TaskItem } from "@/components/task-item";
import { Layout } from "@/components/layout";
import { Search, Loader2, ListTodo, Inbox, CheckCircle2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type FilterType = "all" | "pending" | "completed";

export default function TaskList() {
  const { data: tasks, isLoading, error } = useGetTasks();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    let result = tasks;

    // Apply status filter
    if (filter === "pending") {
      result = result.filter(t => !t.completed);
    } else if (filter === "completed") {
      result = result.filter(t => t.completed);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) || 
        (t.description && t.description.toLowerCase().includes(lowerQuery))
      );
    }

    // Sort by created date descending
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tasks, filter, searchQuery]);

  // Derived stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const pendingTasks = totalTasks - completedTasks;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Layout>
      <div className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold font-display text-foreground mb-2">Your Tasks</h2>
            <p className="text-muted-foreground">You have {pendingTasks} pending tasks to complete.</p>
          </div>
          
          {totalTasks > 0 && (
            <div className="w-full md:w-48 bg-card border border-border p-3 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</span>
                <span className="text-xs font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            />
          </div>
          <div className="flex bg-secondary/50 p-1 rounded-xl border border-border/50">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                filter === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                filter === "pending" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                filter === "completed" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-background/50 z-10 backdrop-blur-sm rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p className="font-medium">Loading tasks...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="font-bold mb-1">Failed to load tasks</p>
            <p className="text-sm opacity-80">Please check your connection and try again.</p>
          </div>
        )}

        {!isLoading && !error && filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-card/50 border border-border border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
              {filter === "completed" ? <CheckCircle2 className="w-8 h-8" /> : filter === "pending" ? <Inbox className="w-8 h-8" /> : <ListTodo className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery ? "No matching tasks found" : filter === "completed" ? "No completed tasks yet" : filter === "pending" ? "All caught up!" : "No tasks yet"}
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery 
                ? `We couldn't find any tasks matching "${searchQuery}".` 
                : "Create your first task to start organizing your work beautifully."}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
