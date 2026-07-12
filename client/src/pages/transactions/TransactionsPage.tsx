/**
 * TransactionsPage — Transaction Monitor
 * Design: Neobrutalist Fintech — Full transaction lifecycle with journal references
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMMK, transactions, type Transaction } from "@/data/mockData";
import { Search, Clock, CheckCircle2, AlertCircle, XCircle, Loader2 } from "lucide-react";

function TxStatusBadge({ status }: { status: Transaction["status"] }) {
  const c: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
    "Approved": { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
    "Disbursing": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", icon: Loader2 },
    "Repaid": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: CheckCircle2 },
    "Overdue": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", icon: AlertCircle },
    "Failed": { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: XCircle },
    "Pending": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", icon: Clock },
  };
  const s = c[status] || c["Pending"];
  const Icon = s.icon;
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </div>
  );
}

export function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = transactions.filter(t => {
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    if (search && !(t.employeeName.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Transaction Monitor</h1>
        <p className="text-sm text-slate-500 mt-0.5">{filtered.length} transactions · Full lifecycle with journal references and audit trail</p>
      </div>

      <Card>
        <CardContent className="p-3 flex items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search by employee or TXN ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-sm" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Approved", "Disbursing", "Repaid", "Overdue", "Failed", "Pending"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">TXN ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Employee</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Amount</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Fee</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Net</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Payout</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Requested</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Due</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Journal Ref</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(tx => (
                <TableRow key={tx.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-sm font-mono font-medium text-slate-800">{tx.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tx.employeeName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{tx.employeeId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{tx.companyName}</TableCell>
                  <TableCell className="text-sm text-right font-medium text-slate-800">{formatMMK(tx.amount)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-500">{formatMMK(tx.fee)}</TableCell>
                  <TableCell className="text-sm text-right font-medium text-slate-700">{formatMMK(tx.netAmount)}</TableCell>
                  <TableCell className="text-sm text-slate-600">{tx.payoutMethod}</TableCell>
                  <TableCell className="text-sm text-slate-500">{tx.requestDate}</TableCell>
                  <TableCell className="text-sm text-slate-500">{tx.dueDate}</TableCell>
                  <TableCell><TxStatusBadge status={tx.status} /></TableCell>
                  <TableCell className="text-xs font-mono text-slate-400">{tx.journalRef !== "—" ? tx.journalRef : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
