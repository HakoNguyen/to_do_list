import { useMemo, useState } from "react";
import type { Task } from "../models/task";
import { chatGenerateTask, type AiTaskDraft } from "../services/aiClient";

interface Props {
  onAddTask: (task: Task) => void;
}

export default function ChatWidget({ onAddTask }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const systemInstruction = useMemo(() => {
    const now = new Date();
    const currentDate = now.toLocaleDateString("vi-VN");
    const currentTime = now.toLocaleTimeString("vi-Vn");
    const dayOfWeek = now.toLocaleDateString("vi-VN", { weekday: "long" });

    return `Bạn là trợ lý tạo task thông minh. 
Thông tin thời gian hiện tại:
- Ngày hiện tại: ${currentDate} (${dayOfWeek})
- Giờ hiện tại: ${currentTime}

Hướng dẫn tạo task:
1. Khi người dùng nhắc việc cần làm, hãy tạo JSON với format:
{
  "title": "Tên công việc",
  "deadline": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "priority": "low|medium|high"
}

2. Xác định deadline thông minh:
- "mai", "ngày mai" → ngày hôm sau
- "tuần tới", "tuần sau" → thứ 2 tuần tới
- "cuối tuần" → chủ nhật tuần này
- "2 ngày nữa" → tính từ hôm nay + 2 ngày
- Nếu có giờ cụ thể (VD: "8h sáng") → đặt giờ đó
- Nếu không có giờ → mặc định 9:00 AM

3. Xác định priority:
- "gấp", "khẩn cấp", "quan trọng", "deadline gần" → high
- "bình thường", không có từ khóa đặc biệt → medium  
- "không gấp", "có thể làm sau" → low

4. CHỈ trả về JSON, không thêm text khác.`;
  }, []);

  const assistantHint = useMemo(
    () =>
      "Ví dụ: 'Nhắc mình mai 8h họp team với anh Nam'. AI sẽ tạo task từ câu này.",
    []
  );

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setError(null);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const { draft } = await chatGenerateTask(
        trimmed,
        undefined,
        systemInstruction
      );
      if (!draft) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Xin lỗi, mình chưa hiểu yêu cầu. Hãy thử mô tả lại nhiệm vụ cụ thể hơn.",
          },
        ]);
      } else {
        const task = aiDraftToTask(draft, trimmed);
        onAddTask(task);
        window.dispatchEvent(new CustomEvent("task:created", { detail: task }));
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `Đã tạo: ${task.title} (hạn ${new Date(
              task.deadline
            ).toLocaleString("vi-VN")}
            độ ưu tiên: ${getPriorityText(task.priority)})`,
          },
        ]);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Có lỗi khi gọi AI");
    } finally {
      setLoading(false);
    }
  }

  function getPriorityText(priority: Task["priority"]): string {
    const map = { low: "Thấp", medium: "Trung bình", high: "Cao" };
    return map[priority];
  }

  function aiDraftToTask(draft: AiTaskDraft, fallbackTitle?: string): Task {
    const priority = (
      draft.priority || "medium"
    ).toLowerCase() as Task["priority"];
    const deadlineIso = normalizeToIso(draft.deadline);
    return {
      id: Date.now().toString(),
      title:
        (draft.title && draft.title.trim()) || fallbackTitle || "Công việc mới",
      description: "(Tạo từ AI)",
      deadline: deadlineIso,
      priority: priority === "high" || priority === "low" ? priority : "medium",
      isCompleted: false,
    };
  }

  function normalizeToIso(input: string): string {
    let s = (input || "").trim();

    s = s.replace(" ", "T");

    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      s = `${s}T00:00:00`;
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) {
      s = `${s}:00`;
    }

    if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(s)) {
      s = `${s}Z`;
    }
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.toISOString();

    const alt = new Date(input);
    if (!isNaN(alt.getTime())) return alt.toISOString();

    return new Date().toISOString();
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-blue-600 text-white w-14 h-14 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          aria-label="Open chat"
        >
          STA
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white">
            <div className="font-semibold">Trợ lý tạo công việc</div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/90 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              💡 {assistantHint}
            </div>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={
                    m.role === "user"
                      ? "inline-block bg-blue-600 text-white px-3 py-2 rounded-2xl text-sm"
                      : "inline-block bg-white border border-gray-200 text-gray-800 px-3 py-2 rounded-2xl text-sm whitespace-pre-line"
                  }
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                Đang tạo nhiệm vụ…
              </div>
            )}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="VD: Mai 8h họp team, việc này khá gấp..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="rounded-lg bg-blue-600 text-white px-3 py-2 disabled:opacity-50 text-sm"
            >
              Gửi
            </button>
            <button
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              className="rounded-lg bg-gray-100 text-gray-700 px-3 py-2 hover:bg-gray-200 text-sm"
            >
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
