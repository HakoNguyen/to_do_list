import React from "react";
import type { Task } from "../models/task";

interface Props {
  tasks: Task[];
}

export default function TaskAnalytics({ tasks }: Props) {
  const completed = tasks.filter((t) => t.isCompleted).length;
  const total = tasks.length;
  const overdue = tasks.filter(
    (t) => !t.isCompleted && new Date(t.deadline) < new Date()
  ).length;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-4">Thống kê</h2>
      <p>
        Đã hoàn thành: <span className="text-green-600">{completed}</span>/
        {total}
      </p>
      <p>
        Quá hạn: <span className="text-red-600">{overdue}</span>
      </p>
    </div>
  );
}
