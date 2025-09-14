export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  priority: "low" | "medium" | "high";
  isCompleted: boolean;
}
