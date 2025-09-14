import { useState } from "react";
import HomeView from "./views/HomeView";
import CalendarView from "./views/CalendarView";
import AnalyticsView from "./views/AnalyticsView";
import ChatWidget from "./components/ChatWidget";
import { addTasksLocal } from "./services/taskLocal";

export default function App() {
  const [view, setView] = useState<"home" | "calendar" | "analytics">("home");
  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <nav className="flex gap-3 bg-gray-100 p-3 rounded-lg mb-4">
        <button
          onClick={() => setView("home")}
          className={`px-4 py-2 rounded-md transition ${
            view === "home"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Danh sách
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`px-4 py-2 rounded-md transition ${
            view === "calendar"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Lịch
        </button>
        <button
          onClick={() => setView("analytics")}
          className={`px-4 py-2 rounded-md transition ${
            view === "analytics"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Thống kê
        </button>
      </nav>
      {view === "home" && <HomeView />}
      {view === "calendar" && <CalendarView />}
      {view === "analytics" && <AnalyticsView />}
      <ChatWidget onAddTask={(t) => addTasksLocal(t)} />
    </div>
  );
}
