/**
 * WorkflowPage — Enterprise Workflow & Case Management
 * Design: Neobrutalist Fintech — Workflow engine, case tracking, SLA monitoring
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

const cases = [
  { id: "WF-001", type: "Employee Verification", subject: "Htet Oo Kyaw — Employment Check", priority: "High", status: "In Progress", assignee: "Operations", sla: "2h", created: "2026-07-12 09:00", updated: "2026-07-12 10:30" },
  { id: "WF-002", type: "Company Onboarding", subject: "Golden Harvest Foods — KYC Review", priority: "Medium", status: "Pending", assignee: "Back Office", sla: "4h", created: "2026-07-12 08:15", updated: "—" },
  { id: "WF-003", type: "Repayment Dispute", subject: "REP-2026-07-003 — Amount Discrepancy", priority: "High", status: "Resolved", assignee: "Finance", sla: "1h", created: "2026-07-11 14:00", updated: "2026-07-12 09:00" },
  { id: "WF-004", type: "Settlement Verification", subject: "SET-2026-07-002 — Missing Screenshot", priority: "Medium", status: "In Progress", assignee: "Back Office", sla: "3h", created: "2026-07-12 07:30", updated: "2026-07-12 08:45" },
  { id: "WF-005", type: "Write-Off Approval", subject: "WO-002 — Aung Thu Write-Off Review", priority: "Low", status: "Pending", assignee: "Finance", sla: "24h", created: "2026-07-11 16:00", updated: "—" },
];

function PriorityBadge({ priority }: { priority: string }) {
  const c: Record<string, { bg: string; text: string; border: string }> = {
    "High": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
    "Medium": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
    "Low": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  };
  const s = c[priority] || c["Low"];
  return <Badge variant="outline" className={`${s.bg} ${s.text} ${s.border} text-xs font-medium`}>{priority}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const c: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    "In Progress": { bg: "bg-blue-100", text: "text-blue-700", icon: RefreshCw },
    "Pending": { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
    "Resolved": { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2 },
    "Escalated": { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
  };
  const s = c[status] || c["Pending"];
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <s.icon className="w-3 h-3" />
      {status}
    </div>
  );
}

export function WorkflowPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Enterprise Workflow & Case Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Workflow engine, case tracking, SLA monitoring, and escalation management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold text-slate-900">{cases.filter(c => c.status === "In Progress").length}</p><p className="text-xs text-slate-400 mt-1">In Progress</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold text-amber-600">{cases.filter(c => c.status === "Pending").length}</p><p className="text-xs text-slate-400 mt-1">Pending</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold text-emerald-600">{cases.filter(c => c.status === "Resolved").length}</p><p className="text-xs text-slate-400 mt-1">Resolved</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold text-slate-900">{cases.length}</p><p className="text-xs text-slate-400 mt-1">Total Cases</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Active Cases</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Case ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Type</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Subject</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Priority</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Assignee</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">SLA</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Created</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map(c => (
                <TableRow key={c.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-sm font-mono font-medium text-slate-800">{c.id}</TableCell>
                  <TableCell className="text-sm text-slate-600">{c.type}</TableCell>
                  <TableCell className="text-sm text-slate-700 max-w-[200px] truncate">{c.subject}</TableCell>
                  <TableCell><PriorityBadge priority={c.priority} /></TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-sm text-slate-600">{c.assignee}</TableCell>
                  <TableCell className="text-sm font-mono text-slate-500">{c.sla}</TableCell>
                  <TableCell className="text-xs text-slate-500">{c.created}</TableCell>
                  <TableCell className="text-xs text-slate-500">{c.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
