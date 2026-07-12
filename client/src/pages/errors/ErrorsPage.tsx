/**
 * ErrorsPage — Error Monitoring & Resolution
 * Design: Neobrutalist Fintech — Transaction error tracking and resolution
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMMK } from "@/data/mockData";
import { XCircle, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

const errors = [
  { id: "ERR-001", type: "Disbursement Failed", employeeName: "Aung Tun", employeeId: "EMP-0008", companyName: "TechBridge Solutions", amount: 120000, date: "2026-07-10", reason: "Insufficient funds in payout bank account", status: "Resolved", retryCount: 2 },
  { id: "ERR-002", type: "KYC Mismatch", employeeName: "Khin Sandar", employeeId: "EMP-0020", companyName: "Diamond Trading", amount: 0, date: "2026-07-08", reason: "National ID doesn't match payroll record", status: "Pending", retryCount: 0 },
  { id: "ERR-003", type: "Settlement Error", employeeName: "—", employeeId: "—", companyName: "Golden Harvest Foods", amount: 850000, date: "2026-07-05", reason: "Bank reconciliation mismatch — 5,000 MMK difference", status: "In Progress", retryCount: 1 },
  { id: "ERR-004", type: "Duplicate Request", employeeName: "Thet Mon", employeeId: "EMP-0015", companyName: "Myanmar Tech Solutions", amount: 75000, date: "2026-07-03", reason: "Duplicate EWA request detected within 24h window", status: "Resolved", retryCount: 0 },
  { id: "ERR-005", type: "Fee Calculation Error", employeeName: "Win Htut", employeeId: "EMP-0012", companyName: "Skyline Trading", amount: 95000, date: "2026-07-01", reason: "Late fee not applied after grace period expiry", status: "Resolved", retryCount: 1 },
];

function ErrorStatusBadge({ status }: { status: string }) {
  const c: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    "Resolved": { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2 },
    "Pending": { bg: "bg-amber-100", text: "text-amber-700", icon: AlertTriangle },
    "In Progress": { bg: "bg-blue-100", text: "text-blue-700", icon: RefreshCw },
    "Escalated": { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  };
  const s = c[status] || c["Pending"];
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <s.icon className="w-3 h-3" />
      {status}
    </div>
  );
}

export function ErrorsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Error Monitoring & Resolution</h1>
        <p className="text-sm text-slate-500 mt-0.5">Transaction errors, KYC mismatches, settlement discrepancies, and retry tracking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold text-red-600">{errors.filter(e => e.status !== "Resolved").length}</p><p className="text-xs text-slate-400 mt-1">Open Errors</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold text-emerald-600">{errors.filter(e => e.status === "Resolved").length}</p><p className="text-xs text-slate-400 mt-1">Resolved</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold text-amber-600">{errors.filter(e => e.status === "Pending").length}</p><p className="text-xs text-slate-400 mt-1">Pending</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold text-slate-900">{errors.length}</p><p className="text-xs text-slate-400 mt-1">Total</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Error Log</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Error ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Type</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Employee</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Amount</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Reason</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Retries</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.map(e => (
                <TableRow key={e.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-sm font-mono font-medium text-slate-800">{e.id}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">{e.type}</Badge></TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-slate-700">{e.employeeName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{e.employeeId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{e.companyName}</TableCell>
                  <TableCell className="text-sm text-right font-medium text-red-700">{formatMMK(e.amount)}</TableCell>
                  <TableCell className="text-sm text-slate-500 max-w-[200px] truncate">{e.reason}</TableCell>
                  <TableCell><ErrorStatusBadge status={e.status} /></TableCell>
                  <TableCell className="text-sm text-center text-slate-500">{e.retryCount}</TableCell>
                  <TableCell className="text-sm text-slate-500">{e.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
