/**
 * EmployeeDetailSheet — Full employee detail with 9 tabbed sections
 * Tabs: Personal | Employment | Payroll | Budget | Policies | Bank | Documents | History | Transactions
 */
import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatMMK, employees, transactions, type Employee, type Transaction } from "@/data/mockData";
import {
  ShieldCheck, ShieldX, Clock, User, Building2, Wallet, FileText, Landmark,
  History, CreditCard, AlertCircle, Eye, Download, UserCheck, Lock,
  Calendar, MapPin, Briefcase, Hash
} from "lucide-react";

interface Props {
  employee: Employee | null;
  onClose: () => void;
}

function TabBadge({ children, count }: { children: React.ReactNode; count: number }) {
  return (
    <span className="flex items-center gap-1">
      {children}
      <span className="bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">{count}</span>
    </span>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50/80 border border-slate-200/60 rounded-md p-4">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function FieldRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-xs font-mono font-medium ${highlight ? "text-[#1e3a5f]" : "text-slate-700"}`}>{value}</span>
    </div>
  );
}

function VerificationBadge({ emp }: { emp: Employee }) {
  if (emp.verification.trustedEmployee) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200"><ShieldCheck className="w-3 h-3" /> Trusted</span>;
  }
  if (emp.verification.employment === "Verified" && !emp.verification.ewaAutoApproved) {
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200"><Clock className="w-3 h-3" /> Verified / No Auto</span>;
  }
  if (emp.verification.employment === "Rejected") {
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-200"><ShieldX className="w-3 h-3" /> Rejected</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"><Clock className="w-3 h-3" /> Pending</span>;
}

// ─── TAB COMPONENTS ──────────────────────────────────────────────────────────

function PersonalTab({ emp }: { emp: Employee }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Personal Information">
        <FieldRow label="Employee ID" value={emp.employeeId} highlight />
        <FieldRow label="Full Name" value={emp.name} />
        <FieldRow label="Company" value={emp.companyName} />
        <FieldRow label="Branch" value={emp.branch} />
        <FieldRow label="Join Date" value={emp.joinDate} />
        <FieldRow label="KYC Level" value={
          <span className="flex items-center gap-1">
            <UserCheck className={`w-3 h-3 ${emp.kycLevel === 2 ? "text-emerald-500" : "text-amber-500"}`} />
            Level {emp.kycLevel}
          </span>
        } />
      </SectionCard>
      <SectionCard title="Verification Status">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">Employment Verification</span>
            </div>
            <Badge variant="outline" className={emp.verification.employment === "Verified" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
              {emp.verification.employment}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">EWA Auto-Approval</span>
            </div>
            <Badge variant="outline" className={emp.verification.ewaAutoApproved ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
              {emp.verification.ewaAutoApproved ? "Approved" : "Not Auto-Approved"}
            </Badge>
          </div>
        </div>
        <div className="mt-3 p-3 rounded bg-[#1e3a5f]/5 border border-[#1e3a5f]/10">
          <p className="text-[11px] text-[#1e3a5f]/80 font-medium">Both Employment Verification AND EWA Auto-Approval must pass for Trusted status and instant disbursement eligibility.</p>
        </div>
      </SectionCard>
    </div>
  );
}

function EmploymentTab({ emp }: { emp: Employee }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Employment Details">
        <FieldRow label="Employee ID" value={emp.employeeId} highlight />
        <FieldRow label="Name" value={emp.name} />
        <FieldRow label="Company" value={
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            {emp.companyName}
          </span>
        } />
        <FieldRow label="Branch" value={
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {emp.branch}
          </span>
        } />
        <FieldRow label="Status" value={(
          <Badge variant="outline" className={
            emp.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
            emp.status === "Frozen" ? "bg-red-50 text-red-700 border-red-200" :
            "bg-amber-50 text-amber-700 border-amber-200"
          }>{emp.status}</Badge>
        )} />
        <FieldRow label="Verification" value={<VerificationBadge emp={emp} />} />
      </SectionCard>
      <SectionCard title="Salary & EWA Parameters">
        <FieldRow label="Base Salary" value={formatMMK(emp.salary)} highlight />
        <FieldRow label="EWA Cap (50%)" value={formatMMK(emp.ewaCap)} />
        <FieldRow label="Current Available" value={
          <span className={emp.ewaAvailable > 0 ? "text-emerald-600" : "text-slate-300"}>{emp.ewaAvailable > 0 ? formatMMK(emp.ewaAvailable) : "—"}</span>
        } />
        <FieldRow label="Outstanding" value={
          <span className={emp.outstanding > 0 ? "text-amber-600" : "text-emerald-500"}>{emp.outstanding > 0 ? formatMMK(emp.outstanding) : "0"}</span>
        } />
      </SectionCard>
    </div>
  );
}

function PayrollTab({ emp }: { emp: Employee }) {
  const empTxns = transactions.filter(t => t.employeeId === emp.id);
  const totalAdvanced = empTxns.reduce((s, t) => s + t.amount, 0);
  const totalFees = empTxns.reduce((s, t) => s + t.fee, 0);

  return (
    <div className="space-y-4">
      <SectionCard title="Payroll Summary">
        <FieldRow label="Base Salary" value={formatMMK(emp.salary)} highlight />
        <FieldRow label="Total Advanced (Cycle)" value={formatMMK(totalAdvanced)} />
        <FieldRow label="Total Fees (Cycle)" value={formatMMK(totalFees)} />
        <FieldRow label="Net Payouts (Cycle)" value={formatMMK(empTxns.reduce((s, t) => s + t.netAmount, 0))} />
        <FieldRow label="EWA Cap" value={formatMMK(emp.ewaCap)} />
        <FieldRow label="Cap Utilization" value={
          <span className="text-amber-600">{(totalAdvanced / emp.ewaCap * 100).toFixed(1)}%</span>
        } />
      </SectionCard>
      <SectionCard title="Transaction Count">
        <div className="flex gap-4">
          <div className="text-center p-3 bg-white rounded border border-slate-200 flex-1">
            <p className="text-lg font-bold text-[#1e3a5f] font-mono">{empTxns.length}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Requests</p>
          </div>
          <div className="text-center p-3 bg-white rounded border border-slate-200 flex-1">
            <p className="text-lg font-bold text-emerald-600 font-mono">{empTxns.filter(t => t.status === "Repaid").length}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Repaid</p>
          </div>
          <div className="text-center p-3 bg-white rounded border border-slate-200 flex-1">
            <p className="text-lg font-bold text-amber-600 font-mono">{empTxns.filter(t => t.status === "Approved" || t.status === "Disbursing").length}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Active</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function BudgetTab({ emp }: { emp: Employee }) {
  const companyBudget = { total: 15000000, utilized: 8200000, remaining: 6800000 };
  const utilization = (companyBudget.utilized / companyBudget.total * 100);

  return (
    <div className="space-y-4">
      <SectionCard title="Budget Eligibility">
        <FieldRow label="Salary × EWA%" value={`${formatMMK(emp.salary)} × 50%`} />
        <FieldRow label="Calculated EWA Cap" value={formatMMK(emp.ewaCap)} highlight />
        <FieldRow label="Pro-rata Factor" value="1.0 (Full cycle)" />
        <FieldRow label="Budget Check" value={
          <span className="text-emerald-600 font-medium">✓ Sufficient</span>
        } />
      </SectionCard>
      <SectionCard title="Company Budget Overview">
        <div className="space-y-2">
          <FieldRow label="Total Budget" value={formatMMK(companyBudget.total)} />
          <FieldRow label="Utilized" value={<span className="text-amber-600">{formatMMK(companyBudget.utilized)}</span>} />
          <FieldRow label="Remaining" value={<span className="text-emerald-600">{formatMMK(companyBudget.remaining)}</span>} />
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span>Utilization</span>
            <span className="font-bold">{utilization.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#1e3a5f] rounded-full transition-all" style={{ width: `${utilization}%` }} />
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Cap Generation">
        <FieldRow label="Cycle Limit" value={formatMMK(emp.ewaCap)} />
        <FieldRow label="Daily Available" value={formatMMK(Math.floor(emp.ewaCap / 30))} />
        <FieldRow label="Maximum Withdrawal" value={formatMMK(Math.floor(emp.ewaCap * 0.8))} />
        <FieldRow label="Current Available" value={
          <span className={emp.ewaAvailable > 0 ? "text-emerald-600 font-bold" : "text-slate-300"}>{emp.ewaAvailable > 0 ? formatMMK(emp.ewaAvailable) : "—"}</span>
        } />
      </SectionCard>
    </div>
  );
}

function PoliciesTab({ emp }: { emp: Employee }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Assigned Policies">
        {["Payroll Policy", "EWA Policy", "Withdrawal Policy", "Fee Policy", "Company Rules", "Employee Category Rules"].map((p, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
            <span className="text-xs font-medium text-slate-700">{p}</span>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Active</Badge>
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Policy Engine Assignment">
        <p className="text-[11px] text-slate-500 mb-2">Policies assigned based on employee attributes:</p>
        <FieldRow label="Payroll Cycle" value="Monthly (25th)" />
        <FieldRow label="EWA Eligibility" value={emp.verification.trustedEmployee ? "Instant" : "Requires Approval"} />
        <FieldRow label="Max Requests/Day" value="1" />
        <FieldRow label="Max Requests/Month" value="5" />
      </SectionCard>
    </div>
  );
}

function BankTab({ emp }: { emp: Employee }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Bank Account">
        <FieldRow label="Bank Name" value="KBZ Bank" />
        <FieldRow label="Account Number" value="***-***-****-4521" />
        <FieldRow label="Account Type" value="Savings" />
        <FieldRow label="Branch" value="Main Branch, Yangon" />
        <FieldRow label="Status" value={<Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Verified</Badge>} />
      </SectionCard>
      <SectionCard title="Mobile Wallet">
        <FieldRow label="Primary Method" value="KBZ Pay" />
        <FieldRow label="Phone Number" value="+95 9*** *** 421" />
        <FieldRow label="Status" value={<Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Verified</Badge>} />
      </SectionCard>
      <SectionCard title="Payout History">
        <div className="grid grid-cols-3 gap-2 text-center">
          {["KBZ Pay", "Wave", "CB Pay"].map(m => (
            <div key={m} className="p-2 bg-white rounded border border-slate-200">
              <p className="text-xs font-bold text-slate-700">{m}</p>
              <p className="text-[10px] text-slate-400">Used</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function DocumentsTab({ emp }: { emp: Employee }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Uploaded Documents">
        {[
          { name: "National ID Card", status: "Verified", icon: UserCheck },
          { name: "Employment Letter", status: "Verified", icon: FileText },
          { name: "Bank Statement", status: "Verified", icon: Landmark },
          { name: "Selfie Verification", status: "Verified", icon: Eye },
        ].map((doc, i) => (
          <div key={i} className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200">
            <div className="flex items-center gap-2">
              <doc.icon className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-700">{doc.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">{doc.status}</Badge>
              <Eye className="w-3 h-3 text-slate-300 cursor-pointer hover:text-[#0ea5e9]" />
            </div>
          </div>
        ))}
      </SectionCard>
      <SectionCard title="KYC Verification Trail">
        <div className="space-y-2">
          {[
            { step: "National ID Scan", date: "2025-01-15", status: "Pass" },
            { step: "Employment Cross-Check", date: "2025-01-15", status: "Pass" },
            { step: "Bank Account Verify", date: "2025-01-16", status: "Pass" },
            { step: "Selfie Match", date: "2025-01-16", status: "Pass" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{i + 1}</span>
                <span className="text-xs text-slate-600">{item.step}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{item.date}</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px]">{item.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function HistoryTab({ emp }: { emp: Employee }) {
  const events = [
    { date: "2025-01-15", event: "Employee onboarded", by: "HR Admin", type: "info" },
    { date: "2025-01-15", event: "Employment verified", by: "System", type: "success" },
    { date: "2025-01-15", event: "EWA auto-approved", by: "Policy Engine", type: "success" },
    { date: "2025-01-16", event: "Bank account verified", by: "System", type: "success" },
    { date: "2025-01-20", event: "Trusted status granted", by: "System", type: "success" },
    { date: "2025-02-14", event: "First EWA request", by: emp.name, type: "info" },
    { date: "2025-07-01", event: "Company annual review passed", by: "Risk Officer", type: "success" },
  ];

  const typeColors: Record<string, string> = {
    success: "bg-emerald-500",
    info: "bg-blue-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Employee Timeline">
        <div className="space-y-0 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200" />
          {events.map((ev, i) => (
            <div key={i} className="flex items-start gap-3 py-2 relative">
              <div className={`w-[10px] h-[10px] rounded-full mt-1 shrink-0 border-2 border-white ${typeColors[ev.type]}`} />
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-700">{ev.event}</p>
                <p className="text-[10px] text-slate-400">{ev.date} · {ev.by}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function TransactionsTab({ emp }: { emp: Employee }) {
  const empTxns = transactions.filter(t => t.employeeId === emp.id);

  const statusColors: Record<string, { bg: string; text: string }> = {
    "Repaid": { bg: "bg-emerald-50", text: "text-emerald-700" },
    "Disbursing": { bg: "bg-blue-50", text: "text-blue-700" },
    "Approved": { bg: "bg-amber-50", text: "text-amber-700" },
    "Overdue": { bg: "bg-red-50", text: "text-red-700" },
    "Failed": { bg: "bg-red-50", text: "text-red-700" },
    "Pending": { bg: "bg-slate-50", text: "text-slate-500" },
  };

  return (
    <div className="space-y-4">
      <SectionCard title={`Transaction History (${empTxns.length} records)`}>
        {empTxns.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="w-6 h-6 text-slate-200 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-1.5 px-1 font-bold text-slate-400 uppercase tracking-wider">TXN ID</th>
                  <th className="text-right py-1.5 px-1 font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="text-right py-1.5 px-1 font-bold text-slate-400 uppercase tracking-wider">Fee</th>
                  <th className="text-right py-1.5 px-1 font-bold text-slate-400 uppercase tracking-wider">Net</th>
                  <th className="text-left py-1.5 px-1 font-bold text-slate-400 uppercase tracking-wider">Method</th>
                  <th className="text-left py-1.5 px-1 font-bold text-slate-400 uppercase tracking-wider">Dates</th>
                  <th className="text-left py-1.5 px-1 font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-1.5 px-1 font-bold text-slate-400 uppercase tracking-wider">Journal</th>
                </tr>
              </thead>
              <tbody>
                {empTxns.map(t => {
                  const sc = statusColors[t.status] || statusColors["Pending"];
                  return (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-1.5 px-1 font-mono text-slate-700">{t.id}</td>
                      <td className="py-1.5 px-1 text-right font-mono text-slate-800">{formatMMK(t.amount)}</td>
                      <td className="py-1.5 px-1 text-right font-mono text-amber-600">{formatMMK(t.fee)}</td>
                      <td className="py-1.5 px-1 text-right font-mono font-medium text-slate-800">{formatMMK(t.netAmount)}</td>
                      <td className="py-1.5 px-1 text-slate-600">{t.payoutMethod}</td>
                      <td className="py-1.5 px-1 text-slate-500">
                        <div className="text-[10px]">Req: {t.requestDate}</div>
                        <div className="text-[10px] text-slate-300">Due: {t.dueDate}</div>
                      </td>
                      <td className="py-1.5 px-1">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${sc.bg} ${sc.text}`}>{t.status}</span>
                      </td>
                      <td className="py-1.5 px-1 font-mono text-[10px] text-slate-400">{t.journalRef}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
      {empTxns.length > 0 && (
        <SectionCard title="Transaction Summary">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-2 bg-white rounded border border-slate-200">
              <p className="text-sm font-bold text-[#1e3a5f] font-mono">{empTxns.length}</p>
              <p className="text-[9px] text-slate-400 uppercase">Total</p>
            </div>
            <div className="text-center p-2 bg-white rounded border border-slate-200">
              <p className="text-sm font-bold text-emerald-600 font-mono">{formatMMK(empTxns.reduce((s, t) => s + t.amount, 0))}</p>
              <p className="text-[9px] text-slate-400 uppercase">Gross</p>
            </div>
            <div className="text-center p-2 bg-white rounded border border-slate-200">
              <p className="text-sm font-bold text-amber-600 font-mono">{formatMMK(empTxns.reduce((s, t) => s + t.fee, 0))}</p>
              <p className="text-[9px] text-slate-400 uppercase">Fees</p>
            </div>
            <div className="text-center p-2 bg-white rounded border border-slate-200">
              <p className="text-sm font-bold text-[#1e3a5f] font-mono">{formatMMK(empTxns.reduce((s, t) => s + t.netAmount, 0))}</p>
              <p className="text-[9px] text-slate-400 uppercase">Net Paid</p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "employment", label: "Employment", icon: Building2 },
  { id: "payroll", label: "Payroll", icon: Wallet },
  { id: "budget", label: "Budget", icon: Hash },
  { id: "policies", label: "Policies", icon: ShieldCheck },
  { id: "bank", label: "Bank", icon: Landmark },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "history", label: "History", icon: History },
  { id: "transactions", label: "Transactions", icon: CreditCard },
];

export function EmployeeDetailSheet({ employee, onClose }: Props) {
  const [activeTab, setActiveTab] = useState("personal");

  // Reset tab when employee changes
  useMemo(() => setActiveTab("personal"), [employee?.id]);

  if (!employee) return null;

  return (
    <Sheet open={!!employee} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[85%] sm:max-w-[750px] p-0 flex flex-col bg-white">
        {/* Header */}
        <div className="shrink-0 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between px-5 py-3">
            <div>
              <SheetTitle className="text-sm font-bold text-[#1e3a5f] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1e3a5f]/40" />
                {employee.name}
              </SheetTitle>
              <SheetDescription className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                {employee.employeeId} · {employee.companyName} · {employee.branch}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              <VerificationBadge emp={employee} />
              <Button variant="outline" size="sm" className="h-7 text-[10px]">
                <Download className="w-3 h-3 mr-1" /> Export
              </Button>
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="flex items-center gap-4 px-5 py-2 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">Salary</span>
              <span className="text-xs font-mono font-bold text-[#1e3a5f]">{formatMMK(employee.salary)}</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">Cap</span>
              <span className="text-xs font-mono font-medium text-slate-600">{formatMMK(employee.ewaCap)}</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">Available</span>
              <span className="text-xs font-mono font-medium text-emerald-600">{employee.ewaAvailable > 0 ? formatMMK(employee.ewaAvailable) : "—"}</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase">Outstanding</span>
              <span className={`text-xs font-mono font-medium ${employee.outstanding > 0 ? "text-amber-600" : "text-emerald-500"}`}>
                {employee.outstanding > 0 ? formatMMK(employee.outstanding) : "0"}
              </span>
            </div>
          </div>

          {/* Ledger divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#0ea5e9]/30 to-transparent" />
        </div>

        {/* Tabs + Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="shrink-0 border-b border-slate-200 px-4 bg-slate-50/50">
            <TabsList className="h-auto bg-transparent p-0 gap-0 flex-wrap">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`px-3 py-2.5 text-[11px] font-medium rounded-none border-b-2 transition-all data-[state=active]:border-[#0ea5e9] data-[state=active]:text-[#1e3a5f] data-[state=active]:bg-white ${
                      isActive ? "border-[#0ea5e9] text-[#1e3a5f] bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Icon className="w-3 h-3 mr-1.5" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-5">
            <TabsContent value="personal" className="mt-0"><PersonalTab emp={employee} /></TabsContent>
            <TabsContent value="employment" className="mt-0"><EmploymentTab emp={employee} /></TabsContent>
            <TabsContent value="payroll" className="mt-0"><PayrollTab emp={employee} /></TabsContent>
            <TabsContent value="budget" className="mt-0"><BudgetTab emp={employee} /></TabsContent>
            <TabsContent value="policies" className="mt-0"><PoliciesTab emp={employee} /></TabsContent>
            <TabsContent value="bank" className="mt-0"><BankTab emp={employee} /></TabsContent>
            <TabsContent value="documents" className="mt-0"><DocumentsTab emp={employee} /></TabsContent>
            <TabsContent value="history" className="mt-0"><HistoryTab emp={employee} /></TabsContent>
            <TabsContent value="transactions" className="mt-0"><TransactionsTab emp={employee} /></TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
