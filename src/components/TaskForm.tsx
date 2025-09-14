import { useState, useEffect } from "react";
import type { Task } from "../models/task";

interface Props {
  onSubmit: (task: Task) => void;
  initial?: Task;
}
export default function TaskForm({ onSubmit, initial }: Props) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [deadline, setDeadline] = useState(initial?.deadline || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initial?.priority || "medium"
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description);
      setDeadline(initial.deadline.split("T")[0]); // Convert ISO to date input format
      setPriority(initial.priority);
    } else {
      setTitle("");
      setDescription("");
      setDeadline("");
      setPriority("medium");
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !deadline) return;

    // Convert date input to ISO string
    const deadlineISO = new Date(deadline + "T00:00:00").toISOString();

    onSubmit({
      id: initial?.id || Date.now().toString(),
      title,
      description,
      deadline: deadlineISO,
      priority,
      isCompleted: initial?.isCompleted || false,
    });

    if (!initial) {
 
      setTitle("");
      setDescription("");
      setDeadline("");
      setPriority("medium");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-6 md:p-8 shadow-lg space-y-5"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tên công việc
        </label>
        <input
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
          placeholder="Nhập tiêu đề công việc"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
          placeholder="Mô tả ngắn gọn về công việc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hạn hoàn thành
          </label>
          <input
            required
            type="date"
            min={todayStr}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Độ ưu tiên
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:bg-blue-800 transition"
        >
          {initial ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
}
