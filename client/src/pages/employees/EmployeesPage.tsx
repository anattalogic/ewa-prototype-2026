/**
 * EmployeesPage — Employee Management Module
 * Design: Institutional Fintech Command Center
 * Two-stage verification workflow: Employment Verify → EWA Auto-Approved → Trusted
 */
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMMK, employees, type Employee } from "@/data/mockData";
import { EmployeeDetailSheet } from "@/components/EmployeeDetailSheet";
import { Search, Filter, Download, Plus, MoreHorizontal, ShieldCheck, ShieldX, CheckCircle2, Clock, AlertCircle, UserCheck, Lock } from "lucide-react";
import { useView } from "@/contexts/ViewContext";

function StatusBadge({ status }: { status: Employee["status"] }) {
  const config: Record<string, { bg: string; text: string }> = {
    "Active": { bg: "bg-emerald-50", text: "text-emerald-700" },
    "Pending Verification": { bg: "bg-amber-50", text: "text-amber-700" },
    "Frozen": { bg: "bg-red-50", text: "text-red-700" },
    "KYC Pending": { bg: "bg-blue-50", text: "text-blue-700" },
    "Inactive": { bg: "bg-slate-50", text: "text-slate-500" },
  };
  const c = config[status] || { bg: "bg-slate-50", text: "text-slate-500" };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>{status}</span>;
}

function VerificationBadge({ emp }: { emp: Employee }) {
  const configs: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
    "trusted": { icon: ShieldCheck, label: "Trusted", color: "text-emerald-600", bg: "bg-emerald-50" },
    "verified-no-auto": { icon: Clock, label: "Verified / No Auto", color: "text-amber-600", bg: "bg-amber-50" },
    "rejected": { icon: ShieldX, label: "Rejected", color: "text-red-600", bg: "bg-red-50" },
    "pending": { icon: Clock, label: "Pending", color: "text-blue-600", bg: "bg-blue-50" },
  };

  let key = "pending";
  if (emp.verification.employment === "Verified" && emp.verification.ewaAutoApproved) key = "trusted";
  else if (emp.verification.employment === "Verified" && !emp.verification.ewaAutoApproved) key = "verified-no-auto";
  else if (emp.verification.employment === "Rejected") key = "rejected";

  const cfg = configs[key];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export function EmployeesPage() {
  const { view } = useView();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filtered = employees.filter(e => {
    if (statusFilter !== "All" && e.status !== statusFilter) return false;
    if (companyFilter !== "All" && e.companyName !== companyFilter) return false;
    if (search && !(e.name.toLowerCase().includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const uniqueCompanies = Array.from(new Set(employees.map(e => e.companyName)));
  const statuses = ["All", "Active", "Pending Verification", "Frozen", "KYC Pending", "Inactive"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1e3a5f] uppercase tracking-tight flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#1e3a5f]/40" />
            Employee Management
          </h1>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">
            {filtered.length} of {employees.length} records · Workflow: Employment Verify → EWA Auto-Approved → Trusted
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[11px] font-medium uppercase tracking-wider border-slate-200">
            <Download className="w-3 h-3 mr-1.5" /> Export
          </Button>
          {(view === "HR" || view === "Operations" || view === "Platform Admin") && (
            <Button size="sm" className="text-[11px] font-semibold uppercase tracking-wider bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
              <Plus className="w-3 h-3 mr-1.5" /> Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Ledger flow divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#0ea5e9]/30 to-transparent" />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap bg-white border border-slate-200/60 p-3 rounded">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-sm h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] text-sm h-9">
            <Filter className="w-3.5 h-3.5 mr-2 text-slate-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-[180px] text-sm h-9">
            <SelectValue placeholder="All Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Companies</SelectItem>
            {uniqueCompanies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/60 rounded overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b-slate-200">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Employee</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Company</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Branch</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Salary</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">EWA Cap</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Available</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Outstanding</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Verification</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">KYC</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(emp => (
              <TableRow key={emp.id} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                <TableCell>
                  <div>
                    <p className="text-sm font-semibold text-[#1e3a5f]">{emp.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{emp.employeeId}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-600">{emp.companyName}</TableCell>
                <TableCell className="text-sm text-slate-500">{emp.branch}</TableCell>
                <TableCell className="text-sm text-right font-mono font-semibold text-[#1e3a5f]">{formatMMK(emp.salary)}</TableCell>
                <TableCell className="text-sm text-right font-mono text-slate-600">{formatMMK(emp.ewaCap)}</TableCell>
                <TableCell className={`text-sm text-right font-mono font-medium ${emp.ewaAvailable > 0 ? "text-emerald-600" : "text-slate-300"}`}>
                  {emp.ewaAvailable > 0 ? formatMMK(emp.ewaAvailable) : "—"}
                </TableCell>
                <TableCell className={`text-sm text-right font-mono font-medium ${emp.outstanding > 0 ? "text-amber-600" : "text-emerald-500"}`}>
                  {emp.outstanding > 0 ? formatMMK(emp.outstanding) : "0"}
                </TableCell>
                <TableCell><VerificationBadge emp={emp} /></TableCell>
                <TableCell><StatusBadge status={emp.status} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <UserCheck className={`w-3.5 h-3.5 ${emp.kycLevel === 2 ? "text-emerald-500" : emp.kycLevel === 1 ? "text-amber-500" : "text-slate-300"}`} />
                    <span className="text-[11px] text-slate-500 font-medium">L{emp.kycLevel}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                    onClick={() => setSelectedEmployee(emp)}>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> View Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-10">
            <AlertCircle className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No employees match your filters</p>
          </div>
        )}
      </div>

      <EmployeeDetailSheet employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />

      {/* Workflow Legend */}
      <div className="bg-white border border-slate-200/60 p-4">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Verification Workflow</h3>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] font-semibold">
            <Clock className="w-3 h-3" /> 1. Employment Verified
          </span>
          <span className="text-slate-300 font-bold">→</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-semibold">
            <Lock className="w-3 h-3" /> 2. EWA Auto-Approved
          </span>
          <span className="text-slate-300 font-bold">→</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-semibold">
            <ShieldCheck className="w-3 h-3" /> 3. Trusted Employee
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">Both Employment Verification AND EWA Auto-Approval must pass for an employee to be trusted and eligible for instant disbursement.</p>
      </div>
    </div>
  );
}
