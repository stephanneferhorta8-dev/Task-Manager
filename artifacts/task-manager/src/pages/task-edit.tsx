import { useLocation, useParams } from "wouter";
import { useGetTask, useUpdateTask, getGetTasksQueryKey, getGetTaskQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { TaskForm } from "@/components/task-form";
import { Layout } from "@/components/layout";
import { Loader2, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function EditTask() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: task, isLoading, error } = useGetTask(id);

  const updateMutation = useUpdateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTaskQueryKey(id) });
        setLocation("/");
      }
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="font-medium">Loading task details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !task) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Task not found</h2>
          <p className="text-muted-foreground mb-8">The task you're looking for doesn't exist or has been deleted.</p>
          <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl inline-flex shadow-sm hover:shadow-md transition-all">
            Return to tasks
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <TaskForm
        title="Edit Task"
        initialData={task}
        isPending={updateMutation.isPending}
        onSubmit={(data) => {
          updateMutation.mutate({ id, data });
        }}
      />
    </Layout>
  );
}
