import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Task } from "@workspace/api-client-react/src/generated/api.schemas";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormValues) => void;
  isPending: boolean;
  title: string;
}

export function TaskForm({ initialData, onSubmit, isPending, title }: TaskFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to tasks
        </Link>
        <h1 className="text-3xl font-bold font-display text-foreground">{title}</h1>
      </div>

      <div className="bg-card border border-border shadow-lg shadow-black/5 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-foreground">
              Task Title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              {...register("title")}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
              placeholder="What needs to be done?"
              autoFocus
            />
            {errors.title && (
              <p className="text-sm text-destructive font-medium mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-foreground">
              Description <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none"
              placeholder="Add any extra details..."
            />
            {errors.description && (
              <p className="text-sm text-destructive font-medium mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Link 
              href="/"
              className="px-6 py-2.5 text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
