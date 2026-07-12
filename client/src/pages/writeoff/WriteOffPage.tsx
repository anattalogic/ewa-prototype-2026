/**
 * WriteOffPage — Write-Off & Loss Provision
 * Design: Neobrutalist Fintech — Enterprise write-off management
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMMK } from "@/data/mockData";
import { AlertTriangle, XCircle } from "lucide-react";

const writeOffs = [
  { id: "WO-001", employeeName: "Phyo Min Soe", employeeId: "EMP-0019", companyName: "Skyline Trading", amount: 150000, daysOverdue: 120, reason: "Employee resigned, no payroll deduction possible", status: "Approved", approvedBy: "Finance", date: "2026-06-15" },
  { id: "WO-002", employeeName: "Aung Thu", employeeId: "EMP-0023", companyName: "TechBridge Solutions", amount: 85000, daysOverdue: 90, reason: "Company dispute, employee terminated", status: "Pending", approvedBy: "—", date: "2026-07-01" },
  { id: "WO-003", employeeName: "Mya Mya Aye", employeeId: "EMP-0011", companyName: "Myanmar Tech Solutions", amount: 200000, daysOverdue: 150, reason: "Fraudulent transaction detected", status: "Under Review", approvedBy: "—", date: "2026-07-05" },
];

export function WriteOffPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Write-Off & Loss Provision</h1>
        <p className="text-sm text-slate-500 mt-0.5">Uncollectible EWA amounts, loss provisioning, and write-off approval workflow</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /><span className="text-xs text-slate-500 uppercase tracking-wider">Total Written Off</span></div>
            <p className="text-2xl font-bold text-red-700 mt-1">{formatMMK(writeOffs.reduce((s, w) => s + w.amount, 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /><span className="text-xs text-slate-500 uppercase tracking-wider">Pending Approval</span></div>
            <p className="text-2xl font-bold text-amber-600 mt-1">{writeOffs.filter(w => w.status === "Pending").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" /><span className="text-xs text-slate-500 uppercase tracking-wider">Under Review</span></div>
            <p className="text-2xl font-bold text-orange-600 mt-1">{writeOffs.filter(w => w.status === "Under Review").length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Write-Off Queue</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Employee</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Amount</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Days Overdue</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Reason</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {writeOffs.map(wo => (
                <TableRow key={wo.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-sm font-mono font-medium text-slate-800">{wo.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{wo.employeeName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{wo.employeeId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{wo.companyName}</TableCell>
                  <TableCell className="text-sm text-right font-medium text-red-700">{formatMMK(wo.amount)}</TableCell>
                  <TableCell className="text-sm text-right text-red-600">{wo.daysOverdue} days</TableCell>
                  <TableCell className="text-sm text-slate-600 max-w-[200px] truncate">{wo.reason}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${
                      wo.status === "Approved" ? "bg-red-100 text-red-700 border-red-200" :
                      wo.status === "Pending" ? "bg-amber-100 text-amber-700 border-amber-200" :
                      "bg-orange-100 text-orange-700 border-orange-200"
                    }`}>{wo.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{wo.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
