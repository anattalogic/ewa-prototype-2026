/**
 * EmployeesPage — Employee Management (SAP Fiori List Report)
 * SAP Fiori Pattern: List Report with toolbar filters + data table
 * Enterprise table with structured columns, semantic status colors
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMMK, employees, type Employee } from "@/data/mockData";
import { EmployeeDetailSheet } from "@/components/EmployeeDetailSheet";
import { Search, Filter, Download, Plus, ShieldCheck, ShieldX, Clock, AlertCircle, UserCheck, Lock, UsersRound, ListFilter } from "lucide-react";
import { useView } from "@/contexts/ViewContext";

/* ===== Fiori Semantic Badge ===== */
function FioriStatusBadge({ status }: { status: Employee["status"] }) {
  const config: Record<string, { bg: string; text: string; border: string }> = {
    "Active": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#a5d6a7]" },
    "Pending Verification": { bg: "bg-[#fff8e1]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "Frozen": { bg: "bg-[#fce4ec]", text: "text-[#b71c1c]", border: "border-[#ef9a9a]" },
    "KYC Pending": { bg: "bg-[#e3f2fd]", text: "text-[#0d47a1]", border: "border-[#90caf9]" },
    "Inactive": { bg: "bg-[#f5f5f5]", text: "text-[#616161]", border: "border-[#bdbdbd]" },
  };
  const c = config[status] || { bg: "bg-[#f5f5f5]", text: "text-[#616161]", border: "border-[#bdbdbd]" };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}>{status}</span>;
}

function VerificationBadge({ emp }: { emp: Employee }) {
  const configs: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; border: string }> = {
    "trusted": { icon: ShieldCheck, label: "Trusted", color: "text-[#1b5e20]", bg: "bg-[#e8f5e9]", border: "border-[#a5d6a7]" },
    "verified-no-auto": { icon: Clock, label: "Verified / No Auto", color: "text-[#e65100]", bg: "bg-[#fff8e1]", border: "border-[#ffcc80]" },
    "rejected": { icon: ShieldX, label: "Rejected", color: "text-[#b71c1c]", bg: "bg-[#fce4ec]", border: "border-[#ef9a9a]" },
    "pending": { icon: Clock, label: "Pending", color: "text-[#0d47a1]", bg: "bg-[#e3f2fd]", border: "border-[#90caf9]" },
  };

  let key = "pending";
  if (emp.verification.employment === "Verified" && emp.verification.ewaAutoApproved) key = "trusted";
  else if (emp.verification.employment === "Verified" && !emp.verification.ewaAutoApproved) key = "verified-no-auto";
  else if (emp.verification.employment === "Rejected") key = "rejected";

  const cfg = configs[key];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
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
    <div className="space-y-3">
      {/* ===== SAP Fiori Object Page Header ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersRound className="w-4 h-4 text-[#0ea5e9]" />
          <div>
            <h1 className="text-[15px] font-bold text-[#1e3a5f] uppercase tracking-wide">Employee Management</h1>
            <p className="text-[10px] text-[#90a4ae] uppercase tracking-wider">
              {filtered.length} of {employees.length} records
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="text-[10px] font-medium uppercase tracking-wider border-[#d1d9e0] text-[#5a6b7c] h-8 rounded-[3px]">
            <Download className="w-3 h-3 mr-1" /> Export
          </Button>
          {(view === "HR" || view === "Operations" || view === "Platform Admin") && (
            <Button size="sm" className="text-[10px] font-semibold uppercase tracking-wider bg-[#1e3a5f] hover:bg-[#1a3250] text-white h-8 rounded-[3px]">
              <Plus className="w-3 h-3 mr-1" /> Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* ===== SAP Fiori Toolbar — Filter Bar ===== */}
      <div className="flex items-center gap-2 flex-wrap bg-white border border-[#d1d9e0] rounded-[3px] p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <ListFilter className="w-3.5 h-3.5 text-[#5a6b7c] ml-1" />
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#90a4ae]" />
          <Input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 text-[11px] h-8 rounded-[3px] border-[#d1d9e0] focus:border-[#0ea5e9]" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] text-[11px] h-8 rounded-[3px] border-[#d1d9e0]">
            <Filter className="w-3 h-3 mr-1.5 text-[#5a6b7c]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(s => <SelectItem key={s} value={s} className="text-[11px]">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-[170px] text-[11px] h-8 rounded-[3px] border-[#d1d9e0]">
            <SelectValue placeholder="All Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="text-[11px]">All Companies</SelectItem>
            {uniqueCompanies.map(c => <SelectItem key={c} value={c} className="text-[11px]">{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* ===== SAP Fiori Data Table ===== */}
      <div className="bg-white border border-[#d1d9e0] rounded-[3px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f5f8fb] border-b-[#d1d9e0]">
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c]">Employee</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c]">Company</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c]">Branch</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c] text-right">Salary</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c] text-right">EWA Cap</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c] text-right">Available</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c] text-right">Outstanding</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c]">Verification</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c]">Status</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c]">KYC</TableHead>
              <TableHead className="text-[9px] font-bold uppercase tracking-widest text-[#5a6b7c]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(emp => (
              <TableRow key={emp.id} className="hover:bg-[#f5f8fb] border-b-[#e8ecf0] transition-colors">
                <TableCell>
                  <div>
                    <p className="text-[12px] font-semibold text-[#1e3a5f]">{emp.name}</p>
                    <p className="text-[9px] text-[#90a4ae] font-mono">{emp.employeeId}</p>
                  </div>
                </TableCell>
                <TableCell className="text-[11px] text-[#5a6b7c]">{emp.companyName}</TableCell>
                <TableCell className="text-[11px] text-[#90a4ae]">{emp.branch}</TableCell>
                <TableCell className="text-[11px] text-right font-mono font-semibold text-[#1e3a5f]">{formatMMK(emp.salary)}</TableCell>
                <TableCell className="text-[11px] text-right font-mono text-[#5a6b7c]">{formatMMK(emp.ewaCap)}</TableCell>
                <TableCell className={`text-[11px] text-right font-mono font-medium ${emp.ewaAvailable > 0 ? "text-[#2e7d32]" : "text-[#bdbdbd]"}`}>
                  {emp.ewaAvailable > 0 ? formatMMK(emp.ewaAvailable) : "—"}
                </TableCell>
                <TableCell className={`text-[11px] text-right font-mono font-medium ${emp.outstanding > 0 ? "text-[#e65100]" : "text-[#2e7d32]"}`}>
                  {emp.outstanding > 0 ? formatMMK(emp.outstanding) : "0"}
                </TableCell>
                <TableCell><VerificationBadge emp={emp} /></TableCell>
                <TableCell><FioriStatusBadge status={emp.status} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <UserCheck className={`w-3.5 h-3.5 ${emp.kycLevel === 2 ? "text-[#2e7d32]" : emp.kycLevel === 1 ? "text-[#e65100]" : "text-[#bdbdbd]"}`} />
                    <span className="text-[10px] text-[#5a6b7c] font-medium">L{emp.kycLevel}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-[9px] font-medium text-[#1565c0] hover:bg-[#1565c0]/8 hover:text-[#0d47a1] rounded-[2px]"
                    onClick={() => setSelectedEmployee(emp)}>
                    View Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-[#d1d9e0] mx-auto mb-2" />
            <p className="text-[11px] text-[#90a4ae]">No employees match your filters</p>
          </div>
        )}
      </div>

      <EmployeeDetailSheet employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />

      {/* ===== Workflow Legend — Fiori Message Strip style ===== */}
      <div className="bg-white border border-[#d1d9e0] rounded-[3px] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h3 className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest mb-2">Verification Workflow</h3>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#e3f2fd] border border-[#90caf9] text-[#0d47a1] text-[10px] font-semibold">
            <Clock className="w-3 h-3" /> 1. Employment Verified
          </span>
          <span className="text-[#d1d9e0] font-bold">→</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#fff8e1] border border-[#ffcc80] text-[#e65100] text-[10px] font-semibold">
            <Lock className="w-3 h-3" /> 2. EWA Auto-Approved
          </span>
          <span className="text-[#d1d9e0] font-bold">→</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#e8f5e9] border border-[#a5d6a7] text-[#1b5e20] text-[10px] font-semibold">
            <ShieldCheck className="w-3 h-3" /> 3. Trusted Employee
          </span>
        </div>
        <p className="text-[10px] text-[#90a4ae] mt-1.5">Both Employment Verification AND EWA Auto-Approval must pass for instant disbursement eligibility.</p>
      </div>
    </div>
  );
}
