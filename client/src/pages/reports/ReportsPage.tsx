/**
 * ReportsPage — Reports Center
 * Design: Institutional Fintech Command Center
 * Multi-report types, grouping, financial statements, audit trail
 */
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMMK, transactions, repaymentRequests, companies, employees, glBalances, journalEntries } from "@/data/mockData";
import { FileText, Download, Eye, Receipt, FileSpreadsheet, Users, Building2, BookOpen, Lock } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend, XAxis, YAxis } from "recharts";

type ReportType = "financial" | "transaction" | "employee" | "company" | "gl" | "audit";

const REPORT_TYPES: { id: ReportType; label: string; icon: React.ElementType }[] = [
  { id: "financial", label: "Financial Statements", icon: FileSpreadsheet },
  { id: "transaction", label: "Transaction Reports", icon: Receipt },
  { id: "employee", label: "Employee Reports", icon: Users },
  { id: "company", label: "Company Portfolio", icon: Building2 },
  { id: "gl", label: "GL Ledger Reports", icon: BookOpen },
  { id: "audit", label: "Audit Trail", icon: FileText },
];

export function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("financial");
  const [period, setPeriod] = useState("July 2026");

  const selectedReport = REPORT_TYPES.find(r => r.id === reportType)!;

  const totalRevenue = transactions.reduce((s, t) => s + t.fee, 0) + repaymentRequests.reduce((s, r) => s + r.lateFeeAmount, 0);
  const totalDisbursed = transactions.reduce((s, t) => s + t.amount, 0);
  const totalRepaid = transactions.filter(t => t.status === "Repaid").reduce((s, t) => s + t.amount, 0);
  const totalOutstanding = transactions.filter(t => t.status === "Overdue" || t.status === "Disbursing" || t.status === "Approved").reduce((s, t) => s + t.amount, 0);
  const totalAssets = glBalances.filter(g => g.type === "Asset").reduce((s, g) => s + g.closingBalance, 0);
  const totalLiabilities = glBalances.filter(g => g.type === "Liability").reduce((s, g) => s + g.closingBalance, 0);
  const totalIncome = Math.abs(glBalances.filter(g => g.type === "Income").reduce((s, g) => s + g.closingBalance, 0));

  const monthlyData = [
    { month: "Jan", disbursed: 2.1, repaid: 1.8, fee: 0.12 },
    { month: "Feb", disbursed: 2.5, repaid: 2.2, fee: 0.15 },
    { month: "Mar", disbursed: 3.0, repaid: 2.8, fee: 0.18 },
    { month: "Apr", disbursed: 2.8, repaid: 2.5, fee: 0.16 },
    { month: "May", disbursed: 3.5, repaid: 3.2, fee: 0.21 },
    { month: "Jun", disbursed: 4.0, repaid: 3.8, fee: 0.24 },
    { month: "Jul", disbursed: 0.72, repaid: 0.45, fee: 0.02 },
  ];

  const reportRows = (() => {
    switch (reportType) {
      case "financial":
        return [
          { label: "Total Revenue (Fees + Late Fees)", value: formatMMK(totalRevenue), type: "Income" },
          { label: "Total Disbursed", value: formatMMK(totalDisbursed), type: "Asset" },
          { label: "Total Repaid", value: formatMMK(totalRepaid), type: "Asset" },
          { label: "Total Outstanding", value: formatMMK(totalOutstanding), type: "Liability" },
          { label: "Total Assets", value: formatMMK(totalAssets), type: "Asset" },
          { label: "Total Liabilities", value: formatMMK(totalLiabilities), type: "Liability" },
          { label: "Total Income", value: formatMMK(totalIncome), type: "Income" },
          { label: "Net Position (Assets - Liabilities)", value: formatMMK(totalAssets - totalLiabilities), type: "Equity" },
        ];
      case "transaction":
        return transactions.map(t => ({ label: t.id, value: formatMMK(t.amount), type: t.status }));
      case "employee":
        return employees.map(e => ({ label: `${e.name} (${e.employeeId})`, value: formatMMK(e.outstanding), type: e.status }));
      case "company":
        return companies.map(c => ({ label: c.name, value: formatMMK(c.utilized), type: c.status }));
      case "gl":
        return glBalances.map(g => ({ label: `${g.accountCode} — ${g.accountName}`, value: formatMMK(g.closingBalance), type: g.type }));
      default:
        return journalEntries.slice(0, 10).map(j => ({ label: j.journalId, value: formatMMK(j.debit || j.credit), type: "Entry" }));
    }
  })();

  const typeColors: Record<string, string> = {
    "Income": "bg-emerald-50 text-emerald-700",
    "Asset": "bg-blue-50 text-blue-700",
    "Liability": "bg-amber-50 text-amber-700",
    "Equity": "bg-violet-50 text-violet-700",
    "Active": "bg-emerald-50 text-emerald-700",
    "Repaid": "bg-emerald-50 text-emerald-700",
    "Overdue": "bg-red-50 text-red-700",
    "Frozen": "bg-red-50 text-red-700",
    "Pending": "bg-amber-50 text-amber-700",
    "Disbursing": "bg-amber-50 text-amber-700",
    "Approved": "bg-blue-50 text-blue-700",
    "Entry": "bg-slate-50 text-slate-600",
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-[#1e3a5f] uppercase tracking-tight flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#1e3a5f]/40" />
          Reports Center
        </h1>
        <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">
          Financial statements, transaction reports, employee reports, GL ledger, and audit trail
        </p>
      </div>

      {/* Ledger flow divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#0ea5e9]/30 to-transparent" />

      {/* Report Type Selector */}
      <div className="flex items-center gap-3 bg-white border border-slate-200/60 p-3 rounded">
        <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
          <SelectTrigger className="w-[220px] text-sm h-9">
            <selectedReport.icon className="w-3.5 h-3.5 mr-2 text-[#0ea5e9]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REPORT_TYPES.map(r => (
              <SelectItem key={r.id} value={r.id}>
                <div className="flex items-center gap-2">
                  <r.icon className="w-3.5 h-3.5" />
                  {r.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px] text-sm h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="July 2026">July 2026</SelectItem>
            <SelectItem value="June 2026">June 2026</SelectItem>
            <SelectItem value="Q2 2026">Q2 2026</SelectItem>
            <SelectItem value="FY 2026">FY 2026</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="text-[11px] font-medium uppercase tracking-wider border-slate-200">
            <Eye className="w-3 h-3 mr-1.5" /> Preview
          </Button>
          <Button size="sm" className="text-[11px] font-semibold uppercase tracking-wider bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
            <Download className="w-3 h-3 mr-1.5" /> Export
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white border border-slate-200/60 rounded overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-widest flex items-center gap-2">
            <selectedReport.icon className="w-3.5 h-3.5 text-[#0ea5e9]" />
            {selectedReport.label} — {period}
          </h3>
          <Badge variant="outline" className="text-[10px] font-mono text-slate-400 border-slate-200 uppercase tracking-wider">Generated: 12 JUL 2026</Badge>
        </div>

        {reportType === "financial" ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b-slate-200">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Line Item</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Amount</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportRows.map((r, i) => (
                    <TableRow key={i} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                      <TableCell className="text-sm font-medium text-[#1e3a5f]">{r.label}</TableCell>
                      <TableCell className="text-sm text-right font-mono font-bold text-[#1e3a5f]">{r.value}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeColors[r.type] || "bg-slate-50 text-slate-600"}`}>
                          {r.type}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 border-t border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Monthly Financial Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `${v}M`} />
                  <Tooltip formatter={(v: number) => [`${formatMMK(v * 1000000)}`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="disbursed" name="Disbursed" stroke="#1e3a5f" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="repaid" name="Repaid" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="fee" name="Fee Revenue" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b-slate-200">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Name / ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Amount</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status / Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportRows.map((r, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                    <TableCell className="text-sm font-medium text-[#1e3a5f]">{r.label}</TableCell>
                    <TableCell className="text-sm text-right font-mono font-semibold text-[#1e3a5f]">{r.value}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeColors[r.type] || "bg-slate-50 text-slate-600"}`}>
                        {r.type}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
