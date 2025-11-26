// src/context/DataContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { Employee, Task, TaskStatus, TaskPriority, TaskKind } from "../types";

interface DataContextValue {
  employees: Employee[];
  tasks: Task[];
  addTask: (data: Omit<Task, "id" | "status" | "createdAt">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
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

  return (
    <DataContext.Provider
      value={{
        employees,
        tasks,
        addTask,
        updateTaskStatus,
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
