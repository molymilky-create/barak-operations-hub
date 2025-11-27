// src/context/DataContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { Employee, Task, TaskStatus, Lead, LeadStatus } from "../types";

interface DataContextValue {
  employees: Employee[];

  // משימות
  tasks: Task[];
  addTask: (data: Omit<Task, "id" | "status" | "createdAt">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;

  // לידים
  leads: Lead[];
  addLead: (data: Omit<Lead, "id" | "status" | "createdAt">) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // עובדים לדוגמה
  const [employees] = useState<Employee[]>([
    {
      id: "u1",
      name: "מנהל",
      email: "admin@barak-insurance.local",
      role: "admin",
      position: "מנהל סוכנות",
      hireDate: "2010-01-01",
    },
    {
      id: "u2",
      name: "עובד",
      email: "user@barak-insurance.local",
      role: "user",
      position: "מטפל חידושים ולידים",
      hireDate: "2022-05-10",
      managerId: "u1",
    },
  ]);

  // משימות לדוגמה
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "חידוש חוות לדוגמה – לבדוק תנאים מול מנורה",
      description: "לבדוק האם אפשר לשמור על תנאי צד ג' למרות הגדלת מספר הסוסים.",
      kind: "RENEWAL",
      status: "OPEN",
      priority: "HIGH",
      assignedToUserId: "u2",
      createdByUserId: "u1",
      createdAt: "2025-11-20",
      dueDate: "2025-11-30",
      relatedClientName: 'חוות לדוגמה בע"מ',
      requiresManagerReview: true,
    },
    {
      id: "t2",
      title: "ליד חדש – רותם, ביטוח מדריכת רכיבה",
      kind: "LEAD",
      status: "IN_PROGRESS",
      priority: "NORMAL",
      assignedToUserId: "u2",
      createdByUserId: "u1",
      createdAt: "2025-11-22",
      dueDate: "2025-11-25",
      relatedClientName: "רותם כהן",
    },
  ]);

  // לידים לדוגמה
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "L1",
      name: "רותם כהן",
      phone: "050-1234567",
      email: "rotem@example.com",
      source: "פייסבוק – חוות סוסים",
      status: "CONTACTED",
      estimatedAnnualPremium: 7500,
      nextActionDate: "2025-11-28",
      nextActionNotes: "לשלוח הצעה לחוות + מדריכת רכיבה עד יום חמישי",
      lastChannel: "WHATSAPP",
      createdAt: "2025-11-20",
      assignedToUserId: "u2",
    },
    {
      id: "L2",
      name: "משק ליאור - ביטוח חווה",
      phone: "052-9876543",
      source: "הפניה מסוכן אחר",
      status: "NEW",
      createdAt: "2025-11-23",
      estimatedAnnualPremium: 12000,
      assignedToUserId: "u2",
    },
  ]);

  // --- משימות ---

  const addTask: DataContextValue["addTask"] = (data) => {
    const id = `task_${Date.now()}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    setTasks((prev) => [
      ...prev,
      {
        ...data,
        id,
        status: "OPEN",
        createdAt,
      },
    ]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              managerApprovedAt:
                status === "DONE" && t.requiresManagerReview
                  ? new Date().toISOString().slice(0, 10)
                  : t.managerApprovedAt,
            }
          : t,
      ),
    );
  };

  // --- לידים ---

  const addLead: DataContextValue["addLead"] = (data) => {
    const id = `lead_${Date.now()}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    setLeads((prev) => [
      ...prev,
      {
        ...data,
        id,
        status: "NEW",
        createdAt,
      },
    ]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        tasks,
        addTask,
        updateTaskStatus,
        leads,
        addLead,
        updateLeadStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
};
