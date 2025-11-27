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
  tasks: Task[];
  leads: Lead[];

  addCertificate: (c: Omit<Certificate, "id" | "createdAt">) => void;
  addTimeOffRequest: (t: Omit<EmployeeTimeOff, "id" | "createdAt">) => void;
  updateTimeOffStatus: (id: string, status: import("../types").TimeOffStatus) => void;
  addTask: (data: Omit<Task, "id" | "createdAt" | "status" | "managerApprovedAt">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addLead: (data: Omit<Lead, "id" | "createdAt" | "status">) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients] = useState<Client[]>([
    {
      id: "c1",
      name: "דוד כהן",
      idNumber: "123456789",
      phone: "050-1234567",
      email: "david@example.com",
      homeAddress: "רחוב הרצל 10, תל אביב",
    },
    {
      id: "c2",
      name: "שרה לוי",
      idNumber: "987654321",
      businessName: 'חוות "אור הבוקר"',
      companyNumber: "515123456",
      phone: "052-9876543",
      email: "sarah@farmexample.com",
      businessAddress: "מושב גן שמואל",
    },
    {
      id: "c3",
      name: "יוסי אברהם",
      idNumber: "111222333",
      phone: "054-1112233",
      email: "yossi@example.com",
      homeAddress: "רחוב הגליל 22, חיפה",
    },
    {
      id: "c4",
      name: "רחל מזרחי",
      idNumber: "444555666",
      businessName: "אקדמיה לרכיבה",
      phone: "050-4445566",
      email: "rachel@academy.com",
      businessAddress: "קיבוץ נחל עוז",
    },
    {
      id: "c5",
      name: "משה גולן",
      idNumber: "777888999",
      phone: "053-7778899",
      email: "moshe@example.com",
      homeAddress: "רחוב השקד 5, ירושלים",
    },
  ]);

  const [policies] = useState<Policy[]>([
    {
      id: "p1",
      clientId: "c1",
      companyId: "MENORA",
      productType: "HORSE",
      policyNumber: "MNR-12345",
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      annualPremium: 8500,
      notes: "פוליסה לסוס תחרותי",
    },
    {
      id: "p2",
      clientId: "c2",
      companyId: "HACHSHARA",
      productType: "FARM",
      policyNumber: "HKS-98765",
      startDate: "2024-03-15",
      endDate: "2025-03-15",
      annualPremium: 12000,
      notes: "ביטוח חווה מלא",
    },
    {
      id: "p3",
      clientId: "c3",
      companyId: "MENORA",
      productType: "INSTRUCTOR",
      policyNumber: "MNR-54321",
      startDate: "2024-06-01",
      endDate: "2025-06-01",
      annualPremium: 5200,
    },
    {
      id: "p4",
      clientId: "c4",
      companyId: "HACHSHARA",
      productType: "TRAINER",
      policyNumber: "HKS-11111",
      startDate: "2024-02-10",
      endDate: "2025-02-10",
      annualPremium: 3100,
    },
    {
      id: "p5",
      clientId: "c5",
      companyId: "MENORA",
      productType: "HORSE",
      policyNumber: "MNR-99999",
      startDate: "2024-05-20",
      endDate: "2025-05-20",
      annualPremium: 15700,
      notes: "פוליסה לשני סוסים",
    },
  ]);

  const [renewals] = useState<Renewal[]>([
    {
      id: "r1",
      policyId: "p1",
      clientId: "c1",
      assignedToUserId: "u2",
      expectedRenewalDate: "2025-01-15",
      previousPremium: 8500,
      expectedPremium: 8800,
      status: "NEW",
    },
    {
      id: "r2",
      policyId: "p2",
      clientId: "c2",
      assignedToUserId: "u2",
      expectedRenewalDate: "2025-01-20",
      previousPremium: 12000,
      expectedPremium: 12300,
      status: "IN_PROGRESS",
    },
    {
      id: "r3",
      policyId: "p3",
      clientId: "c3",
      assignedToUserId: "u2",
      expectedRenewalDate: "2024-12-28",
      previousPremium: 5200,
      expectedPremium: 5400,
      status: "QUOTED",
    },
    {
      id: "r4",
      policyId: "p4",
      clientId: "c4",
      assignedToUserId: "u1",
      expectedRenewalDate: "2025-02-10",
      previousPremium: 3100,
      expectedPremium: 3200,
      status: "COMPLETED",
    },
  ]);

  const [collections] = useState<Collection[]>([
    {
      id: "col1",
      policyId: "p1",
      clientId: "c1",
      amountToCollect: 8500,
      status: "NEW",
      assignedToUserId: "u2",
      dueDate: "2025-01-15",
    },
    {
      id: "col2",
      policyId: "p3",
      clientId: "c3",
      amountToCollect: 2600,
      status: "PARTIAL",
      assignedToUserId: "u2",
      dueDate: "2024-12-20",
      notes: "שולם 50%",
    },
    {
      id: "col3",
      policyId: "p5",
      clientId: "c5",
      amountToCollect: 15700,
      status: "REMINDER_SENT",
      assignedToUserId: "u1",
      dueDate: "2024-12-25",
    },
  ]);

  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "cert1",
      clientId: "c1",
      policyId: "p1",
      mode: "NORMAL",
      requestorName: "דוד כהן",
      codes: ["צד ג'", "חבות מעבידים"],
      createdAt: "2024-12-15T10:00:00Z",
      createdByUserId: "u1",
    },
  ]);

  const [documents] = useState<DocumentMeta[]>([
    {
      id: "doc1",
      title: "ג'קט ביטוח סוסים - מנורה",
      description: "תיק מסמכים מלא לביטוח סוסים",
      companyId: "MENORA",
      productTypes: ["HORSE"],
      source: "COMPANY",
      kind: "JACKET",
      fileUrl: "/docs/menora-horse-jacket.pdf",
    },
    {
      id: "doc2",
      title: "תנאי הפוליסה - ביטוח חווה",
      companyId: "HACHSHARA",
      productTypes: ["FARM"],
      source: "COMPANY",
      kind: "POLICY_TERMS",
      fileUrl: "/docs/hachshara-farm-terms.pdf",
    },
    {
      id: "doc3",
      title: "טופס תביעה כללי",
      source: "AGENCY",
      kind: "CLAIM_FORM",
      fileUrl: "/docs/general-claim-form.pdf",
    },
  ]);

  const [regulations] = useState<Regulation[]>([
    {
      id: "reg1",
      title: "חוזר בטחון - רכיבה על סוסים",
      description: "נהלי בטיחות לרכיבה על סוסים במקומות ציבוריים",
      year: 2023,
      domainTags: ["סוסים", "בטיחות", "רכיבה"],
      fileUrl: "/regulations/horse-safety-2023.pdf",
    },
    {
      id: "reg2",
      title: "חוק הפיקוח על עסקי ביטוח תיקון 2024",
      year: 2024,
      domainTags: ["ביטוח", "חקיקה"],
      fileUrl: "/regulations/insurance-law-2024.pdf",
    },
  ]);

  const [commissionAgreements] = useState<CommissionAgreement[]>([
    {
      id: "ca1",
      companyId: "MENORA",
      productType: "HORSE",
      description: "עמלה סטנדרטית ביטוח סוסים",
      ratePercent: 12,
      baseType: "GROSS",
    },
    {
      id: "ca2",
      companyId: "HACHSHARA",
      productType: "FARM",
      description: "עמלה מיוחדת חוות",
      ratePercent: 10,
      baseType: "NET",
    },
  ]);

  const [commissions] = useState<CommissionEntry[]>([
    {
      id: "com1",
      policyId: "p1",
      clientId: "c1",
      companyId: "MENORA",
      productType: "HORSE",
      grossPremium: 8500,
      netPremium: 7500,
      finalCommission: 1020,
    },
    {
      id: "com2",
      policyId: "p2",
      clientId: "c2",
      companyId: "HACHSHARA",
      productType: "FARM",
      grossPremium: 12000,
      netPremium: 10800,
      finalCommission: 1080,
    },
    {
      id: "com3",
      policyId: "p5",
      clientId: "c5",
      companyId: "MENORA",
      productType: "HORSE",
      grossPremium: 15700,
      netPremium: 14000,
      finalCommission: 1884,
    },
  ]);

  const [employees] = useState<Employee[]>([
    {
      id: "u1",
      name: "מנהל ברק",
      email: "admin@barak-insurance.local",
      role: "admin",
      position: "מנהל סוכנות",
      hireDate: "2015-01-01",
    },
    {
      id: "u2",
      name: "עובד ברק",
      email: "user@barak-insurance.local",
      role: "user",
      position: "סוכן ביטוח",
      hireDate: "2020-03-15",
      managerId: "u1",
    },
    {
      id: "e3",
      name: "ליאור כהן",
      email: "lior@barak-insurance.local",
      role: "user",
      position: "סוכן ביטוח בכיר",
      hireDate: "2018-06-01",
      managerId: "u1",
    },
  ]);

  const [timeOffRequests, setTimeOffRequests] = useState<EmployeeTimeOff[]>([
    {
      id: "to1",
      employeeId: "u2",
      from: "2025-01-10",
      to: "2025-01-15",
      status: "PENDING",
      reason: "חופשה משפחתית",
      createdAt: "2024-12-20T09:00:00Z",
    },
    {
      id: "to2",
      employeeId: "e3",
      from: "2025-02-01",
      to: "2025-02-05",
      status: "APPROVED",
      reason: "חופשת חורף",
      createdAt: "2024-12-10T14:30:00Z",
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "ליצור קשר עם דוד כהן לגבי חידוש",
      description: "פוליסה מסתיימת בקרוב",
      kind: "RENEWAL",
      status: "OPEN",
      priority: "HIGH",
      assignedToUserId: "u2",
      createdByUserId: "u1",
      createdAt: "2024-12-15",
      dueDate: "2024-12-27",
      relatedClientName: "דוד כהן",
    },
    {
      id: "t2",
      title: "מעקב אחר ליד חדש - משה גולדשטיין",
      kind: "LEAD",
      status: "IN_PROGRESS",
      priority: "NORMAL",
      assignedToUserId: "u2",
      createdByUserId: "u2",
      createdAt: "2024-12-20",
      dueDate: "2024-12-29",
    },
    {
      id: "t3",
      title: "לטפל בגבייה של יוסי אברהם",
      kind: "COLLECTION",
      status: "WAITING_CLIENT",
      priority: "HIGH",
      assignedToUserId: "u2",
      createdByUserId: "u1",
      createdAt: "2024-12-10",
      dueDate: "2024-12-25",
      relatedClientName: "יוסי אברהם",
    },
    {
      id: "t4",
      title: "להכין הצעת מחיר לחווה חדשה",
      kind: "OTHER",
      status: "OPEN",
      priority: "NORMAL",
      assignedToUserId: "e3",
      createdByUserId: "u1",
      createdAt: "2024-12-22",
      dueDate: "2024-12-30",
    },
    {
      id: "t5",
      title: "אישור מנהל - תביעה גדולה",
      kind: "SERVICE",
      status: "WAITING_MANAGER_REVIEW",
      priority: "CRITICAL",
      assignedToUserId: "u2",
      createdByUserId: "u2",
      createdAt: "2024-12-18",
      dueDate: "2024-12-27",
      requiresManagerReview: true,
    },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "l1",
      name: "משה גולדשטיין",
      phone: "050-1112222",
      email: "moshe.g@example.com",
      source: "המלצה מלקוח",
      status: "NEW",
      estimatedAnnualPremium: 6000,
      nextActionDate: "2024-12-28",
      nextActionNotes: "לשלוח הצעת מחיר",
      lastChannel: "PHONE",
      createdAt: "2024-12-20",
      assignedToUserId: "u2",
    },
    {
      id: "l2",
      name: "יעל ברקוביץ",
      phone: "052-3334444",
      email: "yael@example.com",
      source: "אתר אינטרנט",
      status: "CONTACTED",
      estimatedAnnualPremium: 8500,
      nextActionDate: "2025-01-05",
      nextActionNotes: "פגישה בחווה",
      lastChannel: "EMAIL",
      createdAt: "2024-12-10",
      assignedToUserId: "u2",
    },
    {
      id: "l3",
      name: "רוני שמיר",
      phone: "054-5556666",
      source: "פייסבוק",
      status: "QUOTED",
      estimatedAnnualPremium: 4200,
      createdAt: "2024-12-05",
      assignedToUserId: "e3",
      notes: "מעוניין בביטוח מדריכים",
    },
    {
      id: "l4",
      name: "דנה רוזנברג",
      phone: "050-7778888",
      email: "dana@example.com",
      source: "תערוכת סוסים",
      status: "WON",
      estimatedAnnualPremium: 12000,
      createdAt: "2024-11-20",
      assignedToUserId: "u2",
      notes: "נסגרה פוליסה!",
    },
  ]);

  // פונקציות

  const addCertificate = (c: Omit<Certificate, "id" | "createdAt">) => {
    const id = `cert_${Date.now()}`;
    const createdAt = new Date().toISOString();
    setCertificates((prev) => [...prev, { ...c, id, createdAt }]);
  };

  const addTimeOffRequest = (t: Omit<EmployeeTimeOff, "id" | "createdAt">) => {
    const newReq: EmployeeTimeOff = {
      ...t,
      id: `to${timeOffRequests.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setTimeOffRequests([...timeOffRequests, newReq]);
  };

  const updateTimeOffStatus = (id: string, status: import("../types").TimeOffStatus) => {
    setTimeOffRequests(
      timeOffRequests.map((r) => (r.id === id ? { ...r, status } : r))
    );
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
        tasks,
        leads,
        addCertificate,
        addTimeOffRequest,
        updateTimeOffStatus,
        addTask,
        updateTaskStatus,
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
