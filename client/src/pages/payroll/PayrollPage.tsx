/**
 * PayrollPage — Payroll & Deduction
 * Design: Neobrutalist Fintech — Payroll policy per company, deduction tracking, and payroll reconciliation
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMMK, employees, companies } from "@/data/mockData";
import { FileSpreadsheet, DollarSign, ArrowDownCircle } from "lucide-react";

export function PayrollPage() {
  const activeEmployees = employees.filter(e => e.status === "Active");
  const totalOutstanding = activeEmployees.reduce((s, e) => s + e.outstanding, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Payroll & Deduction</h1>
        <p className="text-sm text-slate-500 mt-0.5">Company payroll policies, EWA deduction tracking, and payroll reconciliation</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-[#0ea5e9]" /><span className="text-xs text-slate-500 uppercase tracking-wider">Total Outstanding</span></div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatMMK(totalOutstanding)}</p>
            <p className="text-xs text-slate-400 mt-0.5">{activeEmployees.length} active employees with EWA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-500" /><span className="text-xs text-slate-500 uppercase tracking-wider">Payroll Cycle</span></div>
            <p className="text-2xl font-bold text-slate-900 mt-1">July 2026</p>
            <p className="text-xs text-slate-400 mt-0.5">Pay date: July 25, 2026</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2"><ArrowDownCircle className="w-4 h-4 text-amber-500" /><span className="text-xs text-slate-500 uppercase tracking-wider">Deduction Ready</span></div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{activeEmployees.filter(e => e.outstanding > 0).length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Employees with outstanding EWA</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Deduction List */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Payroll Deduction — July 2026</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Employee</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Monthly Salary</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">EWA Outstanding</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Deduction Amount</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Net Pay</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeEmployees.map(emp => {
                const netPay = emp.salary - emp.outstanding;
                return (
                  <TableRow key={emp.id} className="hover:bg-slate-50/80">
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{emp.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{emp.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{emp.companyName}</TableCell>
                    <TableCell className="text-sm text-right text-slate-600">{formatMMK(emp.salary)}</TableCell>
                    <TableCell className={`text-sm text-right font-medium ${emp.outstanding > 0 ? "text-amber-600" : "text-emerald-500"}`}>
                      {emp.outstanding > 0 ? formatMMK(emp.outstanding) : "0"}
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium text-red-700">
                      {emp.outstanding > 0 ? formatMMK(emp.outstanding) : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium text-slate-800">{formatMMK(netPay)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${emp.outstanding > 0 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}`}>
                        {emp.outstanding > 0 ? "Deduct" : "No Deduction"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Total Row */}
              <TableRow className="bg-slate-50 border-t-2 border-slate-300">
                <TableCell className="font-bold text-slate-900" colSpan={2}>TOTAL</TableCell>
                <TableCell className="text-sm text-right font-bold text-slate-900">{formatMMK(activeEmployees.reduce((s, e) => s + e.salary, 0))}</TableCell>
                <TableCell className="text-sm text-right font-bold text-amber-600">{formatMMK(totalOutstanding)}</TableCell>
                <TableCell className="text-sm text-right font-bold text-red-700">{formatMMK(totalOutstanding)}</TableCell>
                <TableCell className="text-sm text-right font-bold text-slate-900">{formatMMK(activeEmployees.reduce((s, e) => s + e.salary, 0) - totalOutstanding)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payroll Policy Summary */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Company Payroll Policy Summary</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Payroll Day</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">EWA Deduction %</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Max Deduction</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Policy Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map(c => (
                <TableRow key={c.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-sm font-medium text-slate-800">{c.name}</TableCell>
                  <TableCell className="text-sm text-slate-600">25th of month</TableCell>
                  <TableCell className="text-sm text-slate-600">100% of outstanding EWA</TableCell>
                  <TableCell className="text-sm text-slate-600">{formatMMK(c.perEmployeeCap)}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${c.status === "Active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}>{c.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
