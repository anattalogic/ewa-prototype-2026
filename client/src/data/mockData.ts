/**
 * EWA 3.0 2026 — Complete Mock Data
 * Design: Neobrutalist Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 * All data reflects enterprise-scale EWA operations in Myanmar
 */

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type ViewType = "HR" | "Sales" | "Operations" | "Back Office" | "Finance" | "Risk" | "Platform Admin";
export type CompanyType = "Corporate" | "SME";
export type RiskTier = "A" | "B" | "C" | "D" | "E";
export type EmployeeStatus = "Active" | "Pending Verification" | "Frozen" | "KYC Pending" | "Inactive";
export type VerificationStatus = "Employment Verified" | "EWA Auto-Approved" | "Pending" | "Rejected";
export type TransactionStatus = "Approved" | "Disbursing" | "Repaid" | "Overdue" | "Failed" | "Pending";
export type RepaymentStatus = "DRAFT" | "SUBMITTED" | "FINANCE_REVIEW" | "FINANCE_UPDATED" | "APPROVED" | "POSTED" | "REJECTED";
export type SettlementStatus = "SUBMITTED" | "MAKER_APPROVED" | "CHECKER_APPROVED" | "REJECTED";
export type OnboardingStage = "SUBMITTED" | "KYC_REVIEW" | "CONFIGURATION" | "INTEGRATION" | "ACTIVE";

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  industry: string;
  riskTier: RiskTier;
  status: "Active" | "Pending" | "Frozen";
  totalEmployees: number;
  activeEmployees: number;
  totalBudget: number;
  utilized: number;
  remaining: number;
  creditScore: number;
  allowAmount: number;
  perEmployeeCap: number;
  feeRate: number;
  maxAdvance: number;
  branchCount: number;
}

export interface Employee {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  employeeId: string;
  branch: string;
  salary: number;
  ewaCap: number;
  outstanding: number;
  kycLevel: 0 | 1 | 2;
  status: EmployeeStatus;
  verification: {
    employment: "Verified" | "Pending" | "Rejected";
    ewaAutoApproved: boolean;
    trustedEmployee: boolean;
  };
  ewaAvailable: number;
  hasPendingRequest: boolean;
  joinDate: string;
}

export interface Transaction {
  id: string;
  employeeId: string;
  employeeName: string;
  companyId: string;
  companyName: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: TransactionStatus;
  payoutMethod: "KBZ Pay" | "Wave" | "CB Pay" | "QR Manual" | "MoPayment" | "OTC Cash Code";
  requestDate: string;
  disbursementDate: string;
  dueDate: string;
  repaymentDate?: string;
  journalRef: string;
}

export interface RepaymentRequest {
  id: string;
  companyId: string;
  companyName: string;
  initiator: ViewType;
  initiatorName: string;
  period: string;
  totalAmount: number;
  principalAmount: number;
  lateFeeAmount: number;
  status: RepaymentStatus;
  transactionDate: string;
  transactionReference: string;
  paymentMethod: string;
  attachment: boolean;
  items: RepaymentItem[];
  submittedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  postedAt?: string;
  comments?: string;
}

export interface RepaymentItem {
  employeeId: string;
  employeeName: string;
  principal: number;
  lateFee: number;
  serviceFee: number;
  total: number;
  allocationPct: number;
  allocatedAmount: number;
}

export interface JournalEntry {
  id: string;
  journalId: string;
  date: string;
  description: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  referenceId: string;
  companyId: string;
  postedBy: string;
}

export interface GLBalance {
  accountCode: string;
  accountName: string;
  type: "Asset" | "Liability" | "Income" | "Expense" | "Equity";
  openingBalance: number;
  periodDebit: number;
  periodCredit: number;
  closingBalance: number;
}

export interface Settlement {
  id: string;
  companyId: string;
  companyName: string;
  submittedBy: string;
  totalAmount: number;
  paymentMethod: string;
  bankReference: string;
  screenshot: boolean;
  status: SettlementStatus;
  submittedAt: string;
  makerVerifiedAt?: string;
  checkerApprovedAt?: string;
}

export interface RiskAssessment {
  id: string;
  companyId: string;
  companyName: string;
  revenueStability: number;
  employeeStability: number;
  industryRisk: number;
  financialHealth: number;
  totalScore: number;
  riskTier: RiskTier;
  allowAmount: number;
  perEmployeeCap: number;
  creditPool: number;
  status: "Pending" | "Approved" | "Rejected";
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

export const companies: Company[] = [
  { id: "cmp-001", name: "Myanmar Tech Solutions Ltd.", type: "Corporate", industry: "Technology", riskTier: "A", status: "Active", totalEmployees: 12, activeEmployees: 10, totalBudget: 15000000, utilized: 8200000, remaining: 6800000, creditScore: 92, allowAmount: 15000000, perEmployeeCap: 200000, feeRate: 2.0, maxAdvance: 200000, branchCount: 3 },
  { id: "cmp-002", name: "Golden Harvest Trading Co.", type: "Corporate", industry: "Agriculture", riskTier: "B", status: "Active", totalEmployees: 8, activeEmployees: 7, totalBudget: 8000000, utilized: 5100000, remaining: 2900000, creditScore: 78, allowAmount: 8000000, perEmployeeCap: 150000, feeRate: 2.25, maxAdvance: 150000, branchCount: 2 },
  { id: "cmp-003", name: "Skyline Trading Enterprise", type: "Corporate", industry: "Import/Export", riskTier: "C", status: "Active", totalEmployees: 5, activeEmployees: 4, totalBudget: 5000000, utilized: 3800000, remaining: 1200000, creditScore: 62, allowAmount: 5000000, perEmployeeCap: 120000, feeRate: 2.5, maxAdvance: 120000, branchCount: 1 },
  { id: "cmp-004", name: "Quick Print Services", type: "SME", industry: "Printing", riskTier: "E", status: "Frozen", totalEmployees: 3, activeEmployees: 2, totalBudget: 1500000, utilized: 1500000, remaining: 0, creditScore: 35, allowAmount: 1500000, perEmployeeCap: 60000, feeRate: 3.0, maxAdvance: 60000, branchCount: 1 },
  { id: "cmp-005", name: "Fresh Mart Groceries", type: "SME", industry: "Retail", riskTier: "D", status: "Active", totalEmployees: 4, activeEmployees: 3, totalBudget: 3000000, utilized: 1800000, remaining: 1200000, creditScore: 48, allowAmount: 3000000, perEmployeeCap: 80000, feeRate: 2.75, maxAdvance: 80000, branchCount: 1 },
];

export const employees: Employee[] = [
  // Myanmar Tech Solutions (cmp-001)
  { id: "emp-001", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", name: "Aung Kyaw Zaw", employeeId: "MTS-001", branch: "Head Office", salary: 800000, ewaCap: 400000, outstanding: 0, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 400000, hasPendingRequest: false, joinDate: "2025-01-15" },
  { id: "emp-002", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", name: "Thida Aye", employeeId: "MTS-002", branch: "Head Office", salary: 650000, ewaCap: 325000, outstanding: 150000, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 175000, hasPendingRequest: true, joinDate: "2025-03-01" },
  { id: "emp-003", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", name: "Maung Maung", employeeId: "MTS-003", branch: "Yangon Branch", salary: 550000, ewaCap: 275000, outstanding: 0, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 275000, hasPendingRequest: false, joinDate: "2025-06-10" },
  { id: "emp-004", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", name: "Kyaw Kyaw Hlaing", employeeId: "MTS-004", branch: "Mandalay Branch", salary: 700000, ewaCap: 350000, outstanding: 200000, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 150000, hasPendingRequest: false, joinDate: "2024-11-20" },
  { id: "emp-005", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", name: "Nilar Win", employeeId: "MTS-005", branch: "Head Office", salary: 900000, ewaCap: 450000, outstanding: 0, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 450000, hasPendingRequest: false, joinDate: "2025-02-14" },
  // Golden Harvest (cmp-002)
  { id: "emp-006", companyId: "cmp-002", companyName: "Golden Harvest Trading", name: "Thant Zin", employeeId: "GH-001", branch: "Head Office", salary: 450000, ewaCap: 292500, outstanding: 100000, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 192500, hasPendingRequest: false, joinDate: "2025-04-01" },
  { id: "emp-007", companyId: "cmp-002", companyName: "Golden Harvest Trading", name: "Myint Myint Aye", employeeId: "GH-002", branch: "Head Office", salary: 500000, ewaCap: 325000, outstanding: 0, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 325000, hasPendingRequest: false, joinDate: "2025-05-15" },
  { id: "emp-008", companyId: "cmp-002", companyName: "Golden Harvest Trading", name: "Zaw Win Htet", employeeId: "GH-003", branch: "Bago Branch", salary: 400000, ewaCap: 260000, outstanding: 50000, kycLevel: 1, status: "Pending Verification", verification: { employment: "Pending", ewaAutoApproved: false, trustedEmployee: false }, ewaAvailable: 0, hasPendingRequest: false, joinDate: "2026-07-01" },
  // Skyline Trading (cmp-003)
  { id: "emp-009", companyId: "cmp-003", companyName: "Skyline Trading Enterprise", name: "Min Tun", employeeId: "ST-001", branch: "Head Office", salary: 600000, ewaCap: 300000, outstanding: 120000, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 180000, hasPendingRequest: true, joinDate: "2025-08-20" },
  { id: "emp-010", companyId: "cmp-003", companyName: "Skyline Trading Enterprise", name: "Aye Aye San", employeeId: "ST-002", branch: "Head Office", salary: 550000, ewaCap: 275000, outstanding: 0, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 275000, hasPendingRequest: false, joinDate: "2025-09-01" },
  { id: "emp-011", companyId: "cmp-003", companyName: "Skyline Trading Enterprise", name: "Paing Paing Soe", employeeId: "ST-003", branch: "Head Office", salary: 480000, ewaCap: 240000, outstanding: 0, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: false }, ewaAvailable: 240000, hasPendingRequest: false, joinDate: "2026-06-15" },
  // Quick Print (cmp-004) — Frozen
  { id: "emp-012", companyId: "cmp-004", companyName: "Quick Print Services", name: "Htet Htet Aung", employeeId: "QP-001", branch: "Head Office", salary: 350000, ewaCap: 70000, outstanding: 60000, kycLevel: 2, status: "Frozen", verification: { employment: "Verified", ewaAutoApproved: false, trustedEmployee: true }, ewaAvailable: 0, hasPendingRequest: false, joinDate: "2025-01-01" },
  { id: "emp-013", companyId: "cmp-004", companyName: "Quick Print Services", name: "Nay Lin", employeeId: "QP-002", branch: "Head Office", salary: 320000, ewaCap: 64000, outstanding: 64000, kycLevel: 2, status: "Frozen", verification: { employment: "Verified", ewaAutoApproved: false, trustedEmployee: true }, ewaAvailable: 0, hasPendingRequest: false, joinDate: "2025-03-10" },
  // Fresh Mart (cmp-005)
  { id: "emp-014", companyId: "cmp-005", companyName: "Fresh Mart Groceries", name: "Chit Chit", employeeId: "FM-001", branch: "Head Office", salary: 420000, ewaCap: 294000, outstanding: 80000, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 214000, hasPendingRequest: false, joinDate: "2025-07-01" },
  { id: "emp-015", companyId: "cmp-005", companyName: "Fresh Mart Groceries", name: "Soe Myat", employeeId: "FM-002", branch: "Head Office", salary: 380000, ewaCap: 266000, outstanding: 0, kycLevel: 2, status: "Active", verification: { employment: "Verified", ewaAutoApproved: true, trustedEmployee: true }, ewaAvailable: 266000, hasPendingRequest: false, joinDate: "2025-10-15" },
  { id: "emp-016", companyId: "cmp-005", companyName: "Fresh Mart Groceries", name: "Phyo Pyae", employeeId: "FM-003", branch: "Head Office", salary: 500000, ewaCap: 350000, outstanding: 0, kycLevel: 1, status: "KYC Pending", verification: { employment: "Verified", ewaAutoApproved: false, trustedEmployee: true }, ewaAvailable: 0, hasPendingRequest: false, joinDate: "2026-07-05" },
];

export const transactions: Transaction[] = [
  { id: "TXN-2026-07-01", employeeId: "emp-001", employeeName: "Aung Kyaw Zaw", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", amount: 100000, fee: 2000, netAmount: 98000, status: "Repaid", payoutMethod: "KBZ Pay", requestDate: "2026-07-01", disbursementDate: "2026-07-01", dueDate: "2026-07-25", repaymentDate: "2026-07-25", journalRef: "JRN-2026-07-01-001" },
  { id: "TXN-2026-07-02", employeeId: "emp-002", employeeName: "Thida Aye", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", amount: 150000, fee: 3000, netAmount: 147000, status: "Disbursing", payoutMethod: "Wave", requestDate: "2026-07-02", disbursementDate: "2026-07-02", dueDate: "2026-07-25", journalRef: "JRN-2026-07-02-001" },
  { id: "TXN-2026-07-03", employeeId: "emp-004", employeeName: "Kyaw Kyaw Hlaing", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", amount: 200000, fee: 4000, netAmount: 196000, status: "Approved", payoutMethod: "KBZ Pay", requestDate: "2026-07-03", disbursementDate: "—", dueDate: "2026-07-25", journalRef: "JRN-2026-07-03-001" },
  { id: "TXN-2026-07-05", employeeId: "emp-006", employeeName: "Thant Zin", companyId: "cmp-002", companyName: "Golden Harvest Trading", amount: 100000, fee: 2250, netAmount: 97750, status: "Repaid", payoutMethod: "CB Pay", requestDate: "2026-07-05", disbursementDate: "2026-07-05", dueDate: "2026-07-31", repaymentDate: "2026-07-31", journalRef: "JRN-2026-07-05-001" },
  { id: "TXN-2026-07-06", employeeId: "emp-008", employeeName: "Zaw Win Htet", companyId: "cmp-002", companyName: "Golden Harvest Trading", amount: 50000, fee: 1125, netAmount: 48875, status: "Repaid", payoutMethod: "MoPayment", requestDate: "2026-07-06", disbursementDate: "2026-07-06", dueDate: "2026-07-31", repaymentDate: "2026-07-31", journalRef: "JRN-2026-07-06-001" },
  { id: "TXN-2026-07-07", employeeId: "emp-009", employeeName: "Min Tun", companyId: "cmp-003", companyName: "Skyline Trading Enterprise", amount: 120000, fee: 3000, netAmount: 117000, status: "Overdue", payoutMethod: "KBZ Pay", requestDate: "2026-06-15", disbursementDate: "2026-06-15", dueDate: "2026-07-10", journalRef: "JRN-2026-06-15-001" },
  { id: "TXN-2026-07-08", employeeId: "emp-012", employeeName: "Htet Htet Aung", companyId: "cmp-004", companyName: "Quick Print Services", amount: 60000, fee: 1800, netAmount: 58200, status: "Overdue", payoutMethod: "QR Manual", requestDate: "2026-06-20", disbursementDate: "2026-06-20", dueDate: "2026-07-10", journalRef: "JRN-2026-06-20-001" },
  { id: "TXN-2026-07-09", employeeId: "emp-013", employeeName: "Nay Lin", companyId: "cmp-004", companyName: "Quick Print Services", amount: 64000, fee: 1920, netAmount: 62080, status: "Overdue", payoutMethod: "OTC Cash Code", requestDate: "2026-06-18", disbursementDate: "2026-06-18", dueDate: "2026-07-10", journalRef: "JRN-2026-06-18-001" },
  { id: "TXN-2026-07-10", employeeId: "emp-014", employeeName: "Chit Chit", companyId: "cmp-005", companyName: "Fresh Mart Groceries", amount: 80000, fee: 2200, netAmount: 77800, status: "Repaid", payoutMethod: "Wave", requestDate: "2026-07-10", disbursementDate: "2026-07-10", dueDate: "2026-07-31", repaymentDate: "2026-07-31", journalRef: "JRN-2026-07-10-001" },
  { id: "TXN-2026-07-11", employeeId: "emp-005", employeeName: "Nilar Win", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", amount: 200000, fee: 4000, netAmount: 196000, status: "Pending", payoutMethod: "KBZ Pay", requestDate: "2026-07-11", disbursementDate: "—", dueDate: "2026-07-25", journalRef: "—" },
];

export const repaymentRequests: RepaymentRequest[] = [
  {
    id: "REP-2026-07-001", companyId: "cmp-003", companyName: "Skyline Trading Enterprise",
    initiator: "Sales", initiatorName: "Sale Representative", period: "July 2026",
    totalAmount: 126000, principalAmount: 120000, lateFeeAmount: 6000,
    status: "FINANCE_REVIEW", transactionDate: "2026-07-09", transactionReference: "KBZ-TXN-20260709-4421",
    paymentMethod: "Bank Transfer", attachment: true, submittedAt: "2026-07-11 08:30", reviewedAt: undefined,
    items: [{ employeeId: "emp-009", employeeName: "Min Tun", principal: 120000, lateFee: 6000, serviceFee: 0, total: 126000, allocationPct: 100, allocatedAmount: 126000 }]
  },
  {
    id: "REP-2026-07-002", companyId: "cmp-004", companyName: "Quick Print Services",
    initiator: "HR", initiatorName: "Admin HR", period: "July 2026",
    totalAmount: 131000, principalAmount: 124000, lateFeeAmount: 7000,
    status: "APPROVED", transactionDate: "2026-07-10", transactionReference: "KBZ-TXN-20260710-8832",
    paymentMethod: "Bank Transfer", attachment: true, submittedAt: "2026-07-11 09:00", reviewedAt: "2026-07-11 10:15", approvedAt: "2026-07-11 10:45",
    items: [
      { employeeId: "emp-012", employeeName: "Htet Htet Aung", principal: 60000, lateFee: 3600, serviceFee: 0, total: 63600, allocationPct: 48.5, allocatedAmount: 63600 },
      { employeeId: "emp-013", employeeName: "Nay Lin", principal: 64000, lateFee: 3400, serviceFee: 0, total: 67400, allocationPct: 51.5, allocatedAmount: 67400 }
    ]
  },
  {
    id: "REP-2026-07-003", companyId: "cmp-001", companyName: "Myanmar Tech Solutions",
    initiator: "Operations", initiatorName: "Ops Lead", period: "June 2026",
    totalAmount: 500000, principalAmount: 495000, lateFeeAmount: 5000,
    status: "POSTED", transactionDate: "2026-07-08", transactionReference: "KBZ-TXN-20260708-1155",
    paymentMethod: "Bank Transfer", attachment: true, submittedAt: "2026-07-08 14:00", reviewedAt: "2026-07-08 15:30", approvedAt: "2026-07-08 16:00", postedAt: "2026-07-08 16:01",
    items: [
      { employeeId: "emp-001", employeeName: "Aung Kyaw Zaw", principal: 100000, lateFee: 0, serviceFee: 0, total: 100000, allocationPct: 20, allocatedAmount: 100000 },
      { employeeId: "emp-002", employeeName: "Thida Aye", principal: 150000, lateFee: 2000, serviceFee: 0, total: 152000, allocationPct: 30.4, allocatedAmount: 152000 },
      { employeeId: "emp-004", employeeName: "Kyaw Kyaw Hlaing", principal: 200000, lateFee: 3000, serviceFee: 0, total: 203000, allocationPct: 40.6, allocatedAmount: 203000 },
      { employeeId: "emp-005", employeeName: "Nilar Win", principal: 45000, lateFee: 0, serviceFee: 0, total: 45000, allocationPct: 9, allocatedAmount: 45000 }
    ]
  },
];

export const journalEntries: JournalEntry[] = [
  { id: "jl-001", journalId: "JRN-2026-07-08-001", date: "2026-07-08", description: "Repayment Settlement — Skyline Trading", accountCode: "1100", accountName: "Cash & Bank", debit: 126000, credit: 0, referenceId: "REP-2026-07-001", companyId: "cmp-003", postedBy: "System" },
  { id: "jl-002", journalId: "JRN-2026-07-08-001", date: "2026-07-08", description: "Repayment Settlement — Skyline Trading", accountCode: "1200", accountName: "Advance Receivable", debit: 0, credit: 120000, referenceId: "REP-2026-07-001", companyId: "cmp-003", postedBy: "System" },
  { id: "jl-003", journalId: "JRN-2026-07-08-001", date: "2026-07-08", description: "Repayment Settlement — Skyline Trading", accountCode: "4100", accountName: "Late Fee Revenue", debit: 0, credit: 6000, referenceId: "REP-2026-07-001", companyId: "cmp-003", postedBy: "System" },
  { id: "jl-004", journalId: "JRN-2026-07-08-002", date: "2026-07-08", description: "Repayment Settlement — Quick Print", accountCode: "1100", accountName: "Cash & Bank", debit: 131000, credit: 0, referenceId: "REP-2026-07-002", companyId: "cmp-004", postedBy: "System" },
  { id: "jl-005", journalId: "JRN-2026-07-08-002", date: "2026-07-08", description: "Repayment Settlement — Quick Print", accountCode: "1200", accountName: "Advance Receivable", debit: 0, credit: 124000, referenceId: "REP-2026-07-002", companyId: "cmp-004", postedBy: "System" },
  { id: "jl-006", journalId: "JRN-2026-07-08-002", date: "2026-07-08", description: "Repayment Settlement — Quick Print", accountCode: "4100", accountName: "Late Fee Revenue", debit: 0, credit: 7000, referenceId: "REP-2026-07-002", companyId: "cmp-004", postedBy: "System" },
  { id: "jl-007", journalId: "JRN-2026-07-01-001", date: "2026-07-01", description: "Disbursement — Aung Kyaw Zaw", accountCode: "1200", accountName: "Advance Receivable", debit: 100000, credit: 0, referenceId: "TXN-2026-07-01", companyId: "cmp-001", postedBy: "System" },
  { id: "jl-008", journalId: "JRN-2026-07-01-001", date: "2026-07-01", description: "Disbursement — Aung Kyaw Zaw", accountCode: "1100", accountName: "Cash & Bank", debit: 0, credit: 98000, referenceId: "TXN-2026-07-01", companyId: "cmp-001", postedBy: "System" },
  { id: "jl-009", journalId: "JRN-2026-07-01-001", date: "2026-07-01", description: "Disbursement — Aung Kyaw Zaw (Fee)", accountCode: "2100", accountName: "Suspense GL", debit: 0, credit: 2000, referenceId: "TXN-2026-07-01", companyId: "cmp-001", postedBy: "System" },
  { id: "jl-010", journalId: "JRN-2026-07-01-001", date: "2026-07-01", description: "Disbursement — Aung Kyaw Zaw (Fee Income)", accountCode: "2100", accountName: "Suspense GL", debit: 2000, credit: 0, referenceId: "TXN-2026-07-01", companyId: "cmp-001", postedBy: "System" },
  { id: "jl-011", journalId: "JRN-2026-07-01-001", date: "2026-07-01", description: "Disbursement — Aung Kyaw Zaw (Fee Income)", accountCode: "4000", accountName: "Fee Revenue", debit: 0, credit: 2000, referenceId: "TXN-2026-07-01", companyId: "cmp-001", postedBy: "System" },
  { id: "jl-012", journalId: "JRN-2026-07-25-001", date: "2026-07-25", description: "Repayment — Aung Kyaw Zaw", accountCode: "1100", accountName: "Cash & Bank", debit: 100000, credit: 0, referenceId: "TXN-2026-07-01", companyId: "cmp-001", postedBy: "System" },
  { id: "jl-013", journalId: "JRN-2026-07-25-001", date: "2026-07-25", description: "Repayment — Aung Kyaw Zaw", accountCode: "1200", accountName: "Advance Receivable", debit: 0, credit: 100000, referenceId: "TXN-2026-07-01", companyId: "cmp-001", postedBy: "System" },
  { id: "jl-014", journalId: "JRN-2026-07-10-001", date: "2026-07-10", description: "Disbursement — Chit Chit", accountCode: "1200", accountName: "Advance Receivable", debit: 80000, credit: 0, referenceId: "TXN-2026-07-10", companyId: "cmp-005", postedBy: "System" },
  { id: "jl-015", journalId: "JRN-2026-07-10-001", date: "2026-07-10", description: "Disbursement — Chit Chit", accountCode: "1100", accountName: "Cash & Bank", debit: 0, credit: 77800, referenceId: "TXN-2026-07-10", companyId: "cmp-005", postedBy: "System" },
  { id: "jl-016", journalId: "JRN-2026-07-10-001", date: "2026-07-10", description: "Disbursement — Chit Chit (Fee)", accountCode: "2100", accountName: "Suspense GL", debit: 0, credit: 2200, referenceId: "TXN-2026-07-10", companyId: "cmp-005", postedBy: "System" },
];

export const glBalances: GLBalance[] = [
  { accountCode: "1100", accountName: "Cash & Bank", type: "Asset", openingBalance: 50000000, periodDebit: 757000, periodCredit: 175800, closingBalance: 50581200 },
  { accountCode: "1200", accountName: "Advance Receivable", type: "Asset", openingBalance: 3500000, periodDebit: 180000, periodCredit: 344000, closingBalance: 3336000 },
  { accountCode: "1300", accountName: "Fee Receivable", type: "Asset", openingBalance: 0, periodDebit: 0, periodCredit: 0, closingBalance: 0 },
  { accountCode: "2100", accountName: "Suspense GL", type: "Liability", openingBalance: 0, periodDebit: 4200, periodCredit: 4200, closingBalance: 0 },
  { accountCode: "2200", accountName: "Settlement Payable", type: "Liability", openingBalance: 0, periodDebit: 0, periodCredit: 0, closingBalance: 0 },
  { accountCode: "4000", accountName: "Fee Revenue", type: "Income", openingBalance: 0, periodDebit: 0, periodCredit: 17370, closingBalance: -17370 },
  { accountCode: "4100", accountName: "Late Fee Revenue", type: "Income", openingBalance: 0, periodDebit: 0, periodCredit: 13000, closingBalance: -13000 },
  { accountCode: "5100", accountName: "Bad Debt Expense", type: "Expense", openingBalance: 0, periodDebit: 0, periodCredit: 0, closingBalance: 0 },
  { accountCode: "5200", accountName: "Payment Gateway Fees", type: "Expense", openingBalance: 0, periodDebit: 0, periodCredit: 0, closingBalance: 0 },
];

export const settlements: Settlement[] = [
  { id: "SET-001", companyId: "cmp-003", companyName: "Skyline Trading Enterprise", submittedBy: "HR Admin", totalAmount: 126000, paymentMethod: "Bank Transfer", bankReference: "KBZ-TXN-20260709-4421", screenshot: true, status: "SUBMITTED", submittedAt: "2026-07-11 08:30" },
  { id: "SET-002", companyId: "cmp-004", companyName: "Quick Print Services", submittedBy: "Finance Officer", totalAmount: 131000, paymentMethod: "KBZ Pay", bankReference: "KBZ-TXN-20260710-8832", screenshot: true, status: "CHECKER_APPROVED", submittedAt: "2026-07-10 14:00", makerVerifiedAt: "2026-07-10 15:30", checkerApprovedAt: "2026-07-10 16:00" },
  { id: "SET-003", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", submittedBy: "HR Admin", totalAmount: 500000, paymentMethod: "Bank Transfer", bankReference: "KBZ-TXN-20260708-1155", screenshot: true, status: "CHECKER_APPROVED", submittedAt: "2026-07-08 14:00", makerVerifiedAt: "2026-07-08 15:00", checkerApprovedAt: "2026-07-08 15:45" },
];

export const riskAssessments: RiskAssessment[] = [
  { id: "RA-001", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", revenueStability: 95, employeeStability: 90, industryRisk: 88, financialHealth: 92, totalScore: 92, riskTier: "A", allowAmount: 15000000, perEmployeeCap: 200000, creditPool: 18000000, status: "Approved" },
  { id: "RA-002", companyId: "cmp-002", companyName: "Golden Harvest Trading", revenueStability: 75, employeeStability: 82, industryRisk: 70, financialHealth: 78, totalScore: 78, riskTier: "B", allowAmount: 8000000, perEmployeeCap: 150000, creditPool: 7800000, status: "Approved" },
  { id: "RA-003", companyId: "cmp-003", companyName: "Skyline Trading Enterprise", revenueStability: 60, employeeStability: 65, industryRisk: 55, financialHealth: 68, totalScore: 62, riskTier: "C", allowAmount: 5000000, perEmployeeCap: 120000, creditPool: 4500000, status: "Approved" },
  { id: "RA-004", companyId: "cmp-004", companyName: "Quick Print Services", revenueStability: 30, employeeStability: 40, industryRisk: 35, financialHealth: 38, totalScore: 35, riskTier: "E", allowAmount: 1500000, perEmployeeCap: 60000, creditPool: 560000, status: "Approved" },
  { id: "RA-005", companyId: "cmp-005", companyName: "Fresh Mart Groceries", revenueStability: 45, employeeStability: 50, industryRisk: 42, financialHealth: 52, totalScore: 48, riskTier: "D", allowAmount: 3000000, perEmployeeCap: 80000, creditPool: 2500000, status: "Approved" },
];

export const chartOfAccounts = [
  { code: "1100", name: "Cash & Bank", type: "Asset" as const, parent: null },
  { code: "1200", name: "Advance Receivable", type: "Asset" as const, parent: null },
  { code: "1300", name: "Fee Receivable", type: "Asset" as const, parent: null },
  { code: "2100", name: "Suspense GL", type: "Liability" as const, parent: null },
  { code: "2200", name: "Settlement Payable", type: "Liability" as const, parent: null },
  { code: "4000", name: "Fee Revenue", type: "Income" as const, parent: null },
  { code: "4100", name: "Late Fee Revenue", type: "Income" as const, parent: null },
  { code: "5100", name: "Bad Debt Expense", type: "Expense" as const, parent: null },
  { code: "5200", name: "Payment Gateway Fees", type: "Expense" as const, parent: null },
];

export const onboardingPipeline = [
  { id: "OB-001", companyId: "cmp-001", companyName: "Myanmar Tech Solutions", companyType: "Corporate", currentStage: "ACTIVE", stage: 5, totalStages: 5, submittedAt: "2025-01-01", stageName: "Active" },
  { id: "OB-002", companyId: "cmp-002", companyName: "Golden Harvest Trading", companyType: "Corporate", currentStage: "ACTIVE", stage: 5, totalStages: 5, submittedAt: "2025-03-15", stageName: "Active" },
  { id: "OB-003", companyId: "cmp-003", companyName: "Skyline Trading Enterprise", companyType: "Corporate", currentStage: "ACTIVE", stage: 5, totalStages: 5, submittedAt: "2025-05-20", stageName: "Active" },
  { id: "OB-004", companyId: "cmp-004", companyName: "Quick Print Services", companyType: "SME", currentStage: "ACTIVE", stage: 3, totalStages: 3, submittedAt: "2025-01-10", stageName: "Active" },
  { id: "OB-005", companyId: "cmp-005", companyName: "Fresh Mart Groceries", companyType: "SME", currentStage: "ACTIVE", stage: 3, totalStages: 3, submittedAt: "2025-06-01", stageName: "Active" },
  { id: "OB-006", companyId: "cmp-006", companyName: "Delta Manufacturing Ltd.", companyType: "Corporate", currentStage: "KYC_REVIEW", stage: 2, totalStages: 5, submittedAt: "2026-07-10", stageName: "KYC Review" },
];

export const feePolicies = [
  { companyId: "cmp-001", companyName: "Myanmar Tech Solutions", serviceFeeRate: 2.0, serviceFeeMin: 1000, serviceFeeMax: 5000, feeBearer: "Employee", lateFeeRate: 0.1, lateFeeGraceDays: 3, lateFeeSlab: [{ from: 1, to: 10, rate: 0.1 }, { from: 11, to: 999, rate: 0.2 }], lateFeeCap: 20000, whtRate: 5, vatRate: 5, bankCharge: 500, bankChargeBearer: "Employee" },
  { companyId: "cmp-002", companyName: "Golden Harvest Trading", serviceFeeRate: 2.25, serviceFeeMin: 1500, serviceFeeMax: 4000, feeBearer: "Employee", lateFeeRate: 0.1, lateFeeGraceDays: 5, lateFeeSlab: [{ from: 1, to: 10, rate: 0.1 }, { from: 11, to: 999, rate: 0.2 }], lateFeeCap: 15000, whtRate: 5, vatRate: 5, bankCharge: 500, bankChargeBearer: "Employee" },
  { companyId: "cmp-003", companyName: "Skyline Trading Enterprise", serviceFeeRate: 2.5, serviceFeeMin: 2000, serviceFeeMax: 5000, feeBearer: "Employee", lateFeeRate: 0.1, lateFeeGraceDays: 3, lateFeeSlab: [{ from: 1, to: 10, rate: 0.1 }, { from: 11, to: 999, rate: 0.2 }], lateFeeCap: 20000, whtRate: 5, vatRate: 5, bankCharge: 500, bankChargeBearer: "Platform" },
  { companyId: "cmp-004", companyName: "Quick Print Services", serviceFeeRate: 3.0, serviceFeeMin: 1000, serviceFeeMax: 3000, feeBearer: "Employee", lateFeeRate: 0.15, lateFeeGraceDays: 0, lateFeeSlab: [{ from: 1, to: 999, rate: 0.15 }], lateFeeCap: 10000, whtRate: 5, vatRate: 5, bankCharge: 500, bankChargeBearer: "Employee" },
  { companyId: "cmp-005", companyName: "Fresh Mart Groceries", serviceFeeRate: 2.75, serviceFeeMin: 1500, serviceFeeMax: 4000, feeBearer: "Employee", lateFeeRate: 0.1, lateFeeGraceDays: 3, lateFeeSlab: [{ from: 1, to: 10, rate: 0.1 }, { from: 11, to: 999, rate: 0.2 }], lateFeeCap: 15000, whtRate: 5, vatRate: 5, bankCharge: 500, bankChargeBearer: "Employee" },
];

export const errorMessages = [
  { code: "EWA-001", english: "Your account is not active. Contact HR.", burmese: "သင့်အကောင့်သည် အလုပ်မလုပ်ပါ။ HR ကိုဆက်သွယ်ပါ။" },
  { code: "EWA-002", english: "EWA access not enabled. Contact HR.", burmese: "EWA ဝန်ဆောင်မှုကို ဖွင့်မထားပါ။ HR ကိုဆက်သွယ်ပါ။" },
  { code: "EWA-003", english: "Request period has ended for this cycle.", burmese: "ဤလစဉ်အတွက် တောင်းဆိုခွင့်ကာလ ကုန်ဆုံးသွားပါပြီ။" },
  { code: "EWA-004", english: "You have a pending advance request.", burmese: "ဆောင်ရွက်ဆဲ ကြိုတင်ငွေထုတ်တောင်းဆိုမှုရှိပါသည်။" },
  { code: "EWA-005", english: "Amount exceeds available limit of {Limit} MMK.", burmese: "တောင်းဆိုငွေသည် ခွင့်ပြုငွေ {Limit} ကျပ်ထက်ကျော်လွန်နေပါသည်။" },
  { code: "EWA-006", english: "Maximum monthly requests reached.", burmese: "ဤလအတွက် အများဆုံးတောင်းဆိုနိုင်သောအကြိမ်ရေ ပြည့်သွားပါပြီ။" },
  { code: "EWA-011", english: "Transfer failed. Try different payout method.", burmese: "ငွေလွှဲပြောင်းမှုမအောင်မြင်ပါ။ အခြားငွေထုတ်နည်းလမ်းကိုရွေးချယ်ပါ။" },
  { code: "EWA-013", english: "Company cap limit reached. Contact admin.", burmese: "ကုမ္ပဏီ၏ကန့်သတ်ငွေပမာဏပြည့်သွားပါပြီ။ အက်ဒမင်ကိုဆက်သွယ်ပါ။" },
  { code: "EWA-014", english: "Duplicate request detected.", burmese: "ထပ်နေသောတောင်းဆိုမှုကိုတွေ့ရှိပါသည်။" },
  { code: "EWA-018", english: "Company budget exhausted. Contact admin.", burmese: "ကုမ္ပဏီဘတ်ဂျက်ကုန်သွားပါပြီ။ အက်ဒမင်ကိုဆက်သွယ်ပါ။" },
  { code: "EWA-022", english: "Employment re-verification failed. Contact HR.", burmese: "အလုပ်အကိုင်အတည်ပြုခြင်းမအောင်မြင်ပါ။ HR ကိုဆက်သွယ်ပါ။" },
  { code: "EWA-025", english: "Maker and Checker cannot be the same user.", burmese: "Maker နှင့် Checker သည်တူညီသောအသုံးပြုသူမဖြစ်နိုင်ပါ။" },
];

export const notificationTemplates = [
  { event: "ADVANCE_PENDING", title: "Advance Request Received", recipients: "Employee", channel: "App Push", body: "Your request for {Amount} MMK is being processed. Ref: {RefID}" },
  { event: "DISBURSE_COMPLETE", title: "Advance Disbursed ✅", recipients: "Employee", channel: "App Push + SMS", body: "{Amount} MMK has been sent to your {Method}. Ref: {RefID}" },
  { event: "DISBURSE_FAILED", title: "Transfer Failed", recipients: "Employee", channel: "App Push", body: "Transfer of {Amount} MMK failed. Please try a different payout method." },
  { event: "REPAYMENT_REMINDER", title: "EWA Repayment Reminder", recipients: "Employee + HR", channel: "Email", body: "Your repayment of {Amount} MMK is due in 3 days on {DueDate}." },
  { event: "OVERDUE_ALERT", title: "⚠️ Repayment Overdue", recipients: "Employee + HR", channel: "Email + Push", body: "Repayment overdue by {Days} day(s). Late fees of {Rate}%/day accumulating." },
  { event: "SETTLEMENT_APPROVED", title: "Settlement Complete ✅", recipients: "Employee + HR", channel: "Email + Push", body: "EWA settlement of {Amount} MMK approved. Outstanding: 0 MMK." },
  { event: "BUDGET_APPROVED", title: "Budget Allocated", recipients: "Admin HR", channel: "Email", body: "{Company} allocated {Amount} MMK (Tier {Tier}). You can now onboard employees." },
  { event: "GHOST_EMPLOYEE_ALERT", title: "⚠️ Ghost Employee Detected", recipients: "Risk Manager + Admin HR", channel: "Email + Portal", body: "Employee {Name} ({ID}) is missing from latest roster but has {Amount} MMK outstanding." },
  { event: "COMPANY_FROZEN", title: "Account Frozen", recipients: "Admin HR + All Employees", channel: "Email + Push", body: "Your company EWA access has been temporarily suspended." },
];

export const formatMMK = (amount: number): string => {
  return amount.toLocaleString("en-US") + " MMK";
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("en-US");
};
