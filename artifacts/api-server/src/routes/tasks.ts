import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { eq, ilike, and, or } from "drizzle-orm";
import { db, tasksTable } from "@workspace/db";
import {
  CreateTaskBody,
  UpdateTaskBody,
  GetTasksQueryParams,
  GetTaskParams,
  UpdateTaskParams,
  DeleteTaskParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tasks", async (req, res) => {
  try {
    const queryResult = GetTasksQueryParams.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({ error: "Bad Request", message: "Invalid query parameters" });
      return;
    }

    const { completed, search } = queryResult.data;

    const conditions = [];

    if (completed !== undefined) {
      conditions.push(eq(tasksTable.completed, completed));
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(tasksTable.title, term),
          ilike(tasksTable.description, term)
        )
      );
    }

    const tasks = conditions.length > 0
      ? await db.select().from(tasksTable).where(and(...conditions)).orderBy(tasksTable.createdAt)
      : await db.select().from(tasksTable).orderBy(tasksTable.createdAt);

    res.json(tasks);
  } catch (err) {
    req.log.error({ err }, "Failed to get tasks");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to retrieve tasks" });
  }
});

router.post("/tasks", async (req, res) => {
  try {
    const bodyResult = CreateTaskBody.safeParse(req.body);
    if (!bodyResult.success) {
      res.status(400).json({ error: "Validation Error", message: bodyResult.error.message });
      return;
    }

    const { title, description } = bodyResult.data;

    const [task] = await db.insert(tasksTable).values({
      id: randomUUID(),
      title,
      description: description ?? "",
      completed: false,
    }).returning();

    res.status(201).json(task);
  } catch (err) {
    req.log.error({ err }, "Failed to create task");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to create task" });
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const paramsResult = GetTaskParams.safeParse(req.params);
    if (!paramsResult.success) {
      res.status(400).json({ error: "Bad Request", message: "Invalid task ID" });
      return;
    }

    const [task] = await db.select().from(tasksTable).where(eq(tasksTable.id, paramsResult.data.id));

    if (!task) {
      res.status(404).json({ error: "Not Found", message: "Task not found" });
      return;
    }

    res.json(task);
  } catch (err) {
    req.log.error({ err }, "Failed to get task");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to retrieve task" });
  }
});

router.put("/tasks/:id", async (req, res) => {
  try {
    const paramsResult = UpdateTaskParams.safeParse(req.params);
    if (!paramsResult.success) {
      res.status(400).json({ error: "Bad Request", message: "Invalid task ID" });
      return;
    }

    const bodyResult = UpdateTaskBody.safeParse(req.body);
    if (!bodyResult.success) {
      res.status(400).json({ error: "Validation Error", message: bodyResult.error.message });
      return;
    }

    const existing = await db.select().from(tasksTable).where(eq(tasksTable.id, paramsResult.data.id));
    if (existing.length === 0) {
      res.status(404).json({ error: "Not Found", message: "Task not found" });
      return;
    }

    const updateData: Partial<typeof tasksTable.$inferInsert> = {};
    const { title, description, completed } = bodyResult.data;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const [updated] = await db.update(tasksTable)
      .set(updateData)
      .where(eq(tasksTable.id, paramsResult.data.id))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update task");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to update task" });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const paramsResult = DeleteTaskParams.safeParse(req.params);
    if (!paramsResult.success) {
      res.status(400).json({ error: "Bad Request", message: "Invalid task ID" });
      return;
    }

    const existing = await db.select().from(tasksTable).where(eq(tasksTable.id, paramsResult.data.id));
    if (existing.length === 0) {
      res.status(404).json({ error: "Not Found", message: "Task not found" });
      return;
    }

    await db.delete(tasksTable).where(eq(tasksTable.id, paramsResult.data.id));

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete task");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to delete task" });
  }
});

export default router;
