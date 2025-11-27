// src/types.ts

// ------------ משתמשים / תפקידים ------------

export type Role = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// ------------ חברות / מוצרים ------------

export type CompanyCode = "MENORA" | "HACHSHARA" | "OTHER";

export interface Company {
  id: CompanyCode;
  name: string;
}

export type ProductType =
  | "HORSE"
  | "FARM"
  | "INSTRUCTOR"
  | "TRAINER"
  | "OTHER";

// ------------ מבוטחים / פוליסות ------------

export interface Client {
  id: string;
  name: string;
  idNumber: string; // ת"ז / ח"פ
  businessName?: string;
  companyNumber?: string;
  homeAddress?: string;
  businessAddress?: string;
  phone?: string;
  email?: string;
}

export interface Policy {
  id: string;
  clientId: string;
  companyId: CompanyCode;
  productType: ProductType;
  policyNumber: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;
  annualPremium: number;
  notes?: string;
}

// ------------ חידושים ------------

export type RenewalStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "QUOTED"
  | "WAITING_CLIENT"
  | "COMPLETED"
  | "CANCELLED";

export interface Renewal {
  id: string;
  policyId: string;
  clientId: string;
  assignedToUserId: string;
  expectedRenewalDate: string;
  previousPremium?: number;
  expectedPremium?: number;
  status: RenewalStatus;
  notes?: string;
}

// ------------ גבייה ------------

export type CollectionStatus =
  | "NEW"
  | "REMINDER_SENT"
  | "PARTIAL"
  | "PAID"
  | "WRITTEN_OFF";

export interface Collection {
  id: string;
  policyId: string;
  clientId: string;
  amountToCollect: number;
  status: CollectionStatus;
  assignedToUserId: string;
  dueDate: string;
  notes?: string;
}

// ------------ עמלות ------------

export interface CommissionAgreement {
  id: string;
  companyId: CompanyCode;
  productType: ProductType;
