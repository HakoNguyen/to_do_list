import type { Task } from "../models/task";
const TASKS_KEY = "tasks";

export function getTasksLocal(): Task[] {
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

export function saveTasksLocal(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function addTasksLocal(task: Task): void {
  const list = getTasksLocal();
  list.push(task);
  saveTasksLocal(list);
}

export function updateTaskLocal(task: Task) {
  saveTasksLocal(getTasksLocal().map((t) => (t.id == task.id ? task : t)));
}

export function deleteTaskLocal(id: string): void {
  saveTasksLocal(getTasksLocal().filter((t) => t.id !== id));
}
