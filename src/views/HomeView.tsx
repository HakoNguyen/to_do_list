import { useState } from "react";
import {
  getTasksLocal,
  addTasksLocal,
  updateTaskLocal,
  deleteTaskLocal,
} from "../services/taskLocal";
import type { Task } from "../models/task";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function HomeView() {
  const [tasks, setTasks] = useState<Task[]>(getTasksLocal());
  const [editing, setEditing] = useState<Task | undefined>(undefined);

  function refresh() {
    setTasks(getTasksLocal());
  }
  function handleAdd(task: Task) {
    addTasksLocal(task);
    refresh();
  }
  function handleUpdate(task: Task) {
    updateTaskLocal(task);
    setEditing(undefined);
    refresh();
  }
  function handleEdit(task: Task) {
    setEditing(task);
  }
  function handleDelete(id: string) {
    deleteTaskLocal(id);
    refresh();
  }
  function handleToggle(id: string) {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    updateTaskLocal({ ...target, isCompleted: !target.isCompleted });
    refresh();
  }

  React.useEffect(() => {
    function onCreated(e: Event) {
      const ce = e as CustomEvent<Task>;
      setTasks((prev) => [ce.detail, ...prev]);
    }
    window.addEventListener("task:created", onCreated as EventListener);
    return () =>
      window.removeEventListener("task:created", onCreated as EventListener);
  }, []);

  return (
    <div>
      <TaskForm
        onSubmit={editing ? handleUpdate : handleAdd}
        initial={editing}
      />
      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}
