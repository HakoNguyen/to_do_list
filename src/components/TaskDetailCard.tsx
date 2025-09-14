import type { Task } from "../models/task";

interface Props {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskDetailCard({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-orange-100 text-orange-800 border-orange-200";
  };

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành";
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && !task.isCompleted;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {task.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Mô tả công việc
            </h3>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
              {task.description || "Không có mô tả"}
            </p>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </h3>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  task.isCompleted
                )}`}
              >
                {getStatusText(task.isCompleted)}
              </span>
              <button
                onClick={() => onToggle(task.id)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  task.isCompleted
                    ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {task.isCompleted
                  ? "Đánh dấu chưa hoàn thành"
                  : "Đánh dấu hoàn thành"}
              </button>
            </div>
          </div>

          {/* Priority */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Độ ưu tiên
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                task.priority
              )}`}
            >
              {getPriorityText(task.priority)}
            </span>
          </div>

          {/* Deadline */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Hạn hoàn thành
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  isOverdue(task.deadline)
                    ? "text-red-600 font-medium"
                    : "text-gray-900"
                }`}
              >
                {formatDate(task.deadline)}
              </span>
              {isOverdue(task.deadline) && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  Quá hạn
                </span>
              )}
            </div>
          </div>

          {/* Task ID */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">ID Task</h3>
            <p className="text-sm text-gray-500 font-mono bg-gray-50 p-2 rounded">
              {task.id}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              onEdit(task);
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn xóa task này?")) {
                onDelete(task.id);
                onClose();
              }
            }}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
