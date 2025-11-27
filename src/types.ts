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
  description: string;
  ratePercent: number;
  baseType: "GROSS" | "NET";
}

export interface CommissionEntry {
  id: string;
  policyId: string;
  clientId: string;
  companyId: CompanyCode;
  productType: ProductType;
  grossPremium: number;
  netPremium: number;
  finalCommission: number;
}

// ------------ אישורי קיום ------------

export type CertificateMode = "NORMAL" | "REQUESTOR";

export interface Certificate {
  id: string;
  clientId: string;
  policyId?: string;
  mode: CertificateMode;
  requestorId?: string;
  requestorName: string;
  productType?: ProductType;
  codes: string[];
  freeText?: string;
  createdAt: string;
  createdByUserId: string;
}

// ------------ מסמכים ------------

export type DocumentSource = "COMPANY" | "AGENCY";

export type DocumentKind =
  | "JACKET"
  | "POLICY_TERMS"
  | "PROPOSAL_FORM"
  | "CLAIM_FORM"
  | "SAFETY"
  | "CERT_FORM"
  | "OTHER";

export interface DocumentMeta {
  id: string;
  title: string;
  description?: string;
  companyId?: CompanyCode;
  productTypes?: ProductType[];
  source: DocumentSource;
  kind: DocumentKind;
  fileUrl: string;
}

// ------------ חוקים / חוזרים ------------

export interface Regulation {
  id: string;
  title: string;
  description?: string;
  year?: number;
  domainTags: string[];
  fileUrl: string;
}

// ------------ עובדים / חופשות ------------

export interface Employee {
  id: string;
  name: string;
  em
