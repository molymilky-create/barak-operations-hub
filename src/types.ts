// src/types.ts

// תפקיד משתמש / עובד
export type Role = "admin" | "user";

// משתמש במערכת (למשל לזהות מי מחובר כרגע)
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// עובדים בסוכנות
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  position?: string;
  hireDate?: string; // yyyy-mm-dd
  managerId?: string;
}

// -------------------------
// לידים
// -------------------------

export type LeadStatus = "NEW" | "CONTACTED" | "QUOTED" | "WON" | "LOST";

export type LeadChannel = "PHONE" | "WHATSAPP" | "EMAIL" | "SMS" | "MEETING";

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source?: string; // פייסבוק / הפניה / אתר...
  status: LeadStatus;
  createdAt: string; // yyyy-mm-dd

  estimatedAnnualPremium?: number;
  nextActionDate?: string; // yyyy-mm-dd
  nextActionNotes?: string;
  lastChannel?: LeadChannel;

  notes?: string;
}

// -------------------------
// משימות
// -------------------------

// סוג המשימה (כדי שנדע אם זה ליד / חידוש / גבייה וכו')
export type TaskKind =
  | "LEAD"
  | "RENEWAL"
  | "COLLECTION"
  | "CARRIER_REQUEST"
  | "CERTIFICATE"
  | "SERVICE" // ← זה ה-SERVICE שגרם לטעות, עכשיו הוא חוקי
  | "OTHER";

// סטטוס המשימה – כמו שראינו בקוד
export type TaskStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_CLIENT"
  | "WAITING_COMPANY"
  | "WAITING_MANAGER_REVIEW"
  | "DONE"
  | "CANCELLED";

// עדיפות המשימה
export type TaskPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

// משימה במערכת
export interface Task {
  id: string;
  title: string;
  description?: string;

  kind: TaskKind;
  status: TaskStatus;
  priority: TaskPriority;

  assignedToUserId: string; // מי אחראי (עובד)
  createdByUserId: string; // מי יצר את המשימה (לרוב מנהל)
  createdAt: string; // yyyy-mm-dd
  dueDate: string; // yyyy-mm-dd

  relatedClientName?: string; // בינתיים רק שם לקוח; בהמשך אפשר לחבר ל-id אמיתי

  requiresManagerReview?: boolean; // אם צריך שהמנהל יאשר ביצוע
  managerApprovedAt?: string; // yyyy-mm-dd
}
