Create a new file called src/types.ts and put the following TypeScript code in it:

// src/types.ts

// Users
export type Role = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Employees
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  position?: string;
  hireDate?: string; // yyyy-mm-dd
  managerId?: string;
}

// Tasks
export type TaskKind =
  | "LEAD"
  | "RENEWAL"
  | "COLLECTION"
  | "CARRIER_REQUEST"
  | "CERTIFICATE"
  | "OTHER";

export type TaskStatus =
  "OPEN"
  | "IN_PROGRESS"
  | "WAITING_CLIENT"
  | "WAITING_COMPANY"
  | "WAITING_MANAGER_REVIEW"
  | "DONE"
  | "CANCELLED";

export type TaskPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export interface Task {
  id: string;
  title: string;
  description?: string;

  kind: TaskKind;
  status: TaskStatus;
  priority: TaskPriority;

  assignedToUserId: string;
  createdByUserId: string;
  createdAt: string; // yyyy-mm-dd
  dueDate: string;   // yyyy-mm-dd

  relatedClientName?: string;

  requiresManagerReview?: boolean;
  managerApprovedAt?: string;
}