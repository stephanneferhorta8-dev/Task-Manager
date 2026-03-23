import { useLocation } from "wouter";
import { useCreateTask, getGetTasksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { TaskForm } from "@/components/task-form";
import { Layout } from "@/components/layout";

export default function NewTask() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const createMutation = useCreateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
        setLocation("/");
      }
    }
  });

  return (
    <Layout>
      <TaskForm
        title="Create New Task"
        isPending={createMutation.isPending}
        onSubmit={(data) => {
          createMutation.mutate({ data });
        }}
      />
    </Layout>
  );
}
