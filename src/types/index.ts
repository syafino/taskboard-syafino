export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  position: number;
  user_id: string;
  created_at: string;
  assignees?: TeamMember[];
  labels?: Label[];
}

export interface TeamMember {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export interface TaskAssignee {
  task_id: string;
  member_id: string;
}

export interface TaskLabel {
  task_id: string;
  label_id: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: '#94a3b8' },
  { id: 'in_progress', title: 'In Progress', color: '#3b82f6' },
  { id: 'in_review', title: 'In Review', color: '#f59e0b' },
  { id: 'done', title: 'Done', color: '#10b981' },
];
