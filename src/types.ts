// src/types.ts

// משתמשים
export type Role = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// עובדים
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  position?: string;
  hireDate?: string; // yyyy-mm-dd
  managerId?: string;
}

// משימות
export type TaskKind = "LEAD" | "RENEWAL" | "COLLECTION" | "CARRIER_REQUEST" | "CERTIFICATE" | "OTHER";

export type TaskStatus =
  | "OPEN"
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
  dueDate: string; // yyyy-mm-dd

  relatedClientName?: string; // בינתיים רק שם; בהמשך נוסיף מזהים אמיתיים

  requiresManagerReview?: boolean;
  managerApprovedAt?: string;

  // אפשרות לקשר ליד / פוליסה וכו' בהמשך
  leadId?: string;
  policyId?: string;
}

// לידים
export type LeadStatus = "NEW" | "CONTACTED" | "QUOTED" | "WON" | "LOST";

export type LeadChannel = "PHONE" | "WHATSAPP" | "EMAIL" | "SMS" | "MEETING";

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source?: string; // פייסבוק / הפניה / אתר...
  status: LeadStatus;
  estimatedAnnualPremium?: number;

  nextActionDate?: string; // yyyy-mm-dd
  nextActionNotes?: string;
  lastChannel?: LeadChannel;

  createdAt: string; // yyyy-mm-dd
  assignedToUserId?: string;
}
