export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string | null;
  priority: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completed: boolean | null;
  projectId: string | null;
  position: number | null;
  progress?: number;
}