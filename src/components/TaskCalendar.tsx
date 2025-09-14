
import type { Task } from "../models/task";

interface Props {
  tasks: Task[];
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const map = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-rose-50 text-rose-700 border-rose-200",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${map[priority]}`}
    >
      {priority === "low"
        ? "Thấp"
        : priority === "medium"
        ? "Trung bình"
        : "Cao"}
    </span>
  );
}

export default function TaskCalendar({ tasks }: Props) {
  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach((task) => {
    if (!tasksByDate[task.deadline]) tasksByDate[task.deadline] = [];
    tasksByDate[task.deadline].push(task);
  });
  const dates = Object.keys(tasksByDate).sort();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <h2 className="font-semibold text-lg mb-4">Lịch công việc</h2>
      {dates.length === 0 && (
        <p className="text-sm text-gray-500">Không có công việc.</p>
      )}
      <div className="space-y-4">
        {dates.map((date) => (
          <div
            key={date}
            className="rounded-xl border border-gray-100 bg-gray-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-gray-800">
                {new Date(date).toLocaleDateString()}
              </strong>
              <span className="text-xs text-gray-500">
                {tasksByDate[date].length} công việc
              </span>
            </div>
            <ul className="space-y-2">
              {tasksByDate[date].map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        task.isCompleted
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }
                    >
                      {task.title}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.isCompleted && (
                    <span className="text-xs text-gray-500">Đã xong</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
