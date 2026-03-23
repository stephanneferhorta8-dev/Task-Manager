import { Task } from "@workspace/api-client-react/src/generated/api.schemas";
import { useUpdateTask, useDeleteTask, getGetTasksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, Edit2, Trash2, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const queryClient = useQueryClient();
  
  const updateMutation = useUpdateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
      }
    }
  });

  const deleteMutation = useDeleteTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
      }
    }
  });

  const toggleCompleted = () => {
    updateMutation.mutate({
      id: task.id,
      data: { completed: !task.completed }
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate({ id: task.id });
    }
  };

  const isUpdating = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isProcessing = isUpdating || isDeleting;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-card border border-border/60",
        "shadow-sm hover:shadow-md transition-all duration-300",
        task.completed ? "bg-muted/30 border-transparent" : "hover:border-primary/20",
        isProcessing && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex-shrink-0 pt-1">
        <button
          onClick={toggleCompleted}
          disabled={isProcessing}
          className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-200",
            task.completed 
              ? "bg-primary border-primary text-primary-foreground" 
              : "border-muted-foreground/30 text-transparent hover:border-primary/50"
          )}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-lg font-semibold font-display transition-colors duration-200 mb-1",
          task.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
        )}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className={cn(
            "text-sm mb-3 line-clamp-2",
            task.completed ? "text-muted-foreground/70" : "text-muted-foreground"
          )}>
            {task.description}
          </p>
        )}
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(task.createdAt), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            <span>{format(new Date(task.createdAt), "h:mm a")}</span>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col justify-end gap-2 sm:opacity-0 sm:-translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-200 pt-1">
        <Link 
          href={`/tasks/${task.id}/edit`}
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          title="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </Link>
        <button 
          onClick={handleDelete}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
