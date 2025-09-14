import { useMemo } from "react";
import { getTasksLocal } from "../services/taskLocal";
import TaskAnalytics from "../components/TaskAnalytics";

export default function AnalyticsView() {
  const tasks = useMemo(() => getTasksLocal(), []);
  return <TaskAnalytics tasks={tasks} />;
}
