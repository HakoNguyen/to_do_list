import { useMemo, useState } from "react";
import type { Task } from "../models/task";
import TaskDetailCard from "./TaskDetailCard";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskList({ tasks, onEdit, onDelete, onToggle }: Props) {
  const PAGE_SIZE = 3;
  const [page, setPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const startIndex = (pageClamped - 1) * PAGE_SIZE;
  const visibleTasks = useMemo(
    () => tasks.slice(startIndex, startIndex + PAGE_SIZE),
    [tasks, startIndex]
  );

  function goPrev() {
    setPage((p) => Math.max(1, p - 1));
  }
  function goNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
  }

  function handleCloseDetail() {
    setSelectedTask(null);
  }

  return (
    <div className="mt-4">
      <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
        {visibleTasks.map((task) => (
          <li
            className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 transition cursor-pointer"
            key={task.id}
            onClick={() => handleTaskClick(task)}
          >
            <div className="flex items-center flex-1">
              <input
                type="checkbox"
                className="mr-2 accent-blue-500"
                checked={task.isCompleted}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggle(task.id);
                }}
              />
              <div className="flex-1">
                <span
                  className={`block ${
                    task.isCompleted
                      ? "line-through text-gray-400"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                className="text-blue-500 hover:underline text-sm"
                onClick={() => onEdit(task)}
              >
                Sửa
              </button>
              <button
                className="text-red-500 hover:underline text-sm"
                onClick={() => onDelete(task.id)}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}

        {visibleTasks.length === 0 && (
          <li className="py-6 px-4 text-sm text-gray-500">
            Không có công việc.
          </li>
        )}
      </ul>

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-gray-600">
          Trang {pageClamped}/{totalPages} — {tasks.length} công việc
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goPrev}
            disabled={pageClamped === 1}
          >
            Trước
          </button>
          <button
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goNext}
            disabled={pageClamped === totalPages}
          >
            Sau
          </button>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailCard
          task={selectedTask}
          onClose={handleCloseDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}
