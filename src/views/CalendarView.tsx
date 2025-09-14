import React, { useMemo } from "react";
import { getTasksLocal } from "../services/taskLocal";
import TaskCalendar from "../components/TaskCalendar";

export default function CalendarView() {
  const tasks = useMemo(() => getTasksLocal(), []);
  return <TaskCalendar tasks={tasks} />;
}
