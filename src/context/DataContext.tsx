// src/context/DataContext.tsx
import React, { createContext, useContext, useState } from "react";
import {
  Client,
  Policy,
  Renewal,
  Collection,
  Certificate,
  DocumentMeta,
  Regulation,
  CommissionAgreement,
  CommissionEntry,
  Employee,
  EmployeeTimeOff,
  Task,
  TaskStatus,
  Lead,
  LeadStatus,
} from "../types";

interface DataContextValue {
  clients: Client[];
  policies: Policy[];
  renewals: Renewal[];
  collections: Collection[];
  certificates: Certificate[];
  documents: DocumentMeta[];
  regulations: Regulation[];
  commissionAgreements: CommissionAgreement[];
  commissions: CommissionEntry[];
  employees: Employee[];
  timeOffRequests: EmployeeTimeOff[];

  // לידים
  leads: Lead[];
  addLead: (data: Omit<Lead, "id" | "createdAt" | "status">) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;

  // משימות
  tasks: Task[];
  addTask: (data: Omit<Task, "id" | "createdAt" | "status" | "managerApprovedAt">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;

  addCertificate: (c: Omit<Certificate, "id" | "createdAt">) => void;
  addTimeOffRequest: (t: Omit<EmployeeTimeOff, "id" | "createdAt">) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients] = useState<Client[]>([
    {
      id: "c1",
      name: "ישראל ישראלי",
      idNumber: "123456789",
      businessName: 'חוות לדוגמה בע"מ',
      companyNumber: "515555555",
      businessAddress: "רח' החווה 1, מושב לדוגמה",
      phone: "050-0000000",
      email: "farm@example.com",
    },
  ]);

  const [policies] = useState<Policy[]>([
    {
      id: "p1",
      clientId: "c1",
      companyId: "MENORA",
      productType: "FARM",
      policyNumber: "MN-123456",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      annualPremium: 10000,
      notes: "חוות סוסים – פוליסת עסק",
    },
  ]);

  const [renewals] = useState<Renewal[]>([
    {
      id: "r1",
      policyId: "p1",
      clientId: "c1",
      assignedToUserId: "u2",
      expectedRenewalDate: "2025-12-01",
      previousPremium: 9000,
      expectedPremium: 10000,
      status: "NEW",
    },
  ]);

  const [collections] = useState<Collection[]>([
    {
      id: "col1",
      policyId: "p1",
      clientId: "c1",
      amountToCollect: 10000,
      status: "NEW",
      assignedToUserId: "u2",
      dueDate: "2025-02-10",
    },
  ]);

  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [documents] = useState<DocumentMeta[]>([
    {
      id: "d1",
      title: "ג'קט פוליסת עסק - מנורה",
      companyId: "MENORA",
      productTypes: ["FARM"],
      source: "COMPANY",
      kind: "JACKET",
      fileUrl: "/docs/menora/business-jacket.pdf",
    },
    {
      id: "d2",
      title: "כללי בטיחות בחווה",
      source: "AGENCY",
      kind: "SAFETY",
      productTypes: ["FARM", "HORSE"],
      fileUrl: "/docs/agency/farm-safety.pdf",
    },
  ]);

  const [regulations] = useState<Regulation[]>([
    {
      id: "reg1",
      title: "הנחיות ביטוח חוות סוסים",
      domainTags: ["סוסים", "חוות", "אחריות"],
      fileUrl: "/docs/regulations/farm.pdf",
    },
  ]);

  const [commissionAgreements] = useState<CommissionAgreement[]>([
    {
      id: "ca1",
      companyId: "MENORA",
      productType: "FARM",
      description: "חוות סוסים – מנורה",
      ratePercent: 15,
      baseType: "NET",
    },
  ]);

  const [commissions] = useState<CommissionEntry[]>([
    {
      id: "ce1",
      policyId: "p1",
      clientId: "c1",
      companyId: "MENORA",
      productType: "FARM",
      grossPremium: 10000,
      netPremium: 9500,
      finalCommission: 1425,
    },
  ]);

  const [employees] = useState<Employee[]>([
    {
      id: "u1",
      name: "מנהל",
      email: "admin@barak-korb.co.il",
      role: "admin",
      position: "מנהל סוכנות",
      hireDate: "2010-01-01",
    },
    {
      id: "u2",
      name: "עובד",
      email: "user@barak-korb.co.il",
      role: "user",
      position: "מטפל חידושים",
      hireDate: "2022-05-10",
      managerId: "u1",
    },
  ]);

  const [timeOffRequests, setTimeOffRequests] = useState<EmployeeTimeOff[]>([
    {
      id: "to1",
      employeeId: "u2",
      from: "2025-03-01",
      to: "2025-03-05",
      status: "APPROVED",
      reason: "חופשה משפחתית",
      createdAt: "2025-01-15",
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
      name: 'חוות השמש בע"מ',
      phone: "050-1234567",
      email: "farm@sun-example.com",
      source: "הפניה מחווה אחרת",
      status: "CONTACTED",
      estimatedAnnualPremium: 12000,
      nextActionDate: "2025-12-01",
      nextActionNotes: "לחזור עם טיוטה מנורה והכשרה להשוואה.",
      lastChannel: "PHONE",
      createdAt: "2025-11-20",
      assignedToUserId: "u2",
      notes: "מעוניינים גם בביטוח מדריכים.",
    },
    {
      id: "L2",
      name: "מאמן כושר – עידן כהן",
      phone: "052-9876543",
      source: "פייסבוק",
      status: "NEW",
      createdAt: "2025-11-25",
      lastChannel: "WHATSAPP",
      notes: "שאל לגבי ביטוח מאמן אישי בבית הלקוח.",
    },
  ]);

  // פונקציות

  const addCertificate = (c: Omit<Certificate, "id" | "createdAt">) => {
    const id = `cert_${Date.now()}`;
    const createdAt = new Date().toISOString();
    setCertificates((prev) => [...prev, { ...c, id, createdAt }]);
  };

  const addTimeOffRequest = (t: Omit<EmployeeTimeOff, "id" | "createdAt">) => {
    const id = `to_${Date.now()}`;
    const createdAt = new Date().toISOString();
    setTimeOffRequests((prev) => [...prev, { ...t, id, createdAt }]);
  };

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
        clients,
        policies,
        renewals,
        collections,
        certificates,
        documents,
        regulations,
        commissionAgreements,
        commissions,
        employees,
        timeOffRequests,
        leads,
        addLead,
        updateLeadStatus,
        tasks,
        addTask,
        updateTaskStatus,
        addCertificate,
        addTimeOffRequest,
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
