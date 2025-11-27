// src/types.ts

// ===== משתמשים / הרשאות =====
export type Role = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// ===== חברות ביטוח / מוצרים =====
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

// ===== מבוטחים / פוליסות =====
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
  compa
