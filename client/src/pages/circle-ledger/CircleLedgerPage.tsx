/**
 * CircleLedgerPage — Circle Ledger & GL Accounting
 * Design: Institutional Fintech Command Center
 * Double-entry accounting, journal entries, GL balances, trial balance
 * Signature motif: ledger flow line, debit/credit precision
 */
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMMK, journalEntries, glBalances, chartOfAccounts } from "@/data/mockData";
import { BookOpen, FileText, Scale, Lock } from "lucide-react";

export function CircleLedgerPage() {
  const [journalFilter, setJournalFilter] = useState("All");

  const uniqueJournals = Array.from(new Set(journalEntries.map(j => j.journalId)));

  const groupedJournals = journalFilter === "All"
    ? journalEntries
    : journalEntries.filter(j => j.journalId === journalFilter);

  const totalDebit = glBalances.reduce((s, g) => s + g.periodDebit, 0);
  const totalCredit = glBalances.reduce((s, g) => s + g.periodCredit, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-[#1e3a5f] uppercase tracking-tight flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#1e3a5f]/40" />
          Circle Ledger (GL Accounting)
        </h1>
        <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">
          Double-entry accounting · Journal entries · GL balances · Trial balance
        </p>
      </div>

      {/* Ledger flow divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#0ea5e9]/30 to-transparent" />

      <Tabs defaultValue="journals">
        <TabsList className="bg-slate-100/80 border border-slate-200/60">
          <TabsTrigger value="journals" className="text-[11px] font-semibold uppercase tracking-wider data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
            <BookOpen className="w-3 h-3 mr-1" /> Journal Entries
          </TabsTrigger>
          <TabsTrigger value="gl" className="text-[11px] font-semibold uppercase tracking-wider data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
            <FileText className="w-3 h-3 mr-1" /> GL Balances
          </TabsTrigger>
          <TabsTrigger value="trial" className="text-[11px] font-semibold uppercase tracking-wider data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
            <Scale className="w-3 h-3 mr-1" /> Trial Balance
          </TabsTrigger>
        </TabsList>

        {/* Journal Entries */}
        <TabsContent value="journals">
          <div className="bg-white border border-slate-200/60 rounded overflow-hidden mt-3">
            <div className="p-3 border-b border-slate-100">
              <Select value={journalFilter} onValueChange={setJournalFilter}>
                <SelectTrigger className="w-[280px] text-sm h-9">
                  <SelectValue placeholder="Filter by Journal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Journals</SelectItem>
                  {uniqueJournals.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b-slate-200">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Journal ID</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">GL Code</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Account</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Debit</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Credit</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reference</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Company</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Posted By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedJournals.map(jl => (
                    <TableRow key={jl.id} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                      <TableCell className="text-[11px] font-mono text-slate-500">{jl.journalId}</TableCell>
                      <TableCell className="text-sm text-slate-600 font-medium">{jl.date}</TableCell>
                      <TableCell className="text-sm text-[#1e3a5f] font-medium">{jl.description}</TableCell>
                      <TableCell className="text-sm font-mono font-semibold text-[#1e3a5f]">{jl.accountCode}</TableCell>
                      <TableCell className="text-sm text-slate-600">{jl.accountName}</TableCell>
                      <TableCell className={`text-sm text-right font-mono font-semibold ${jl.debit > 0 ? "text-emerald-700" : "text-slate-300"}`}>
                        {jl.debit > 0 ? formatMMK(jl.debit) : "—"}
                      </TableCell>
                      <TableCell className={`text-sm text-right font-mono font-semibold ${jl.credit > 0 ? "text-red-700" : "text-slate-300"}`}>
                        {jl.credit > 0 ? formatMMK(jl.credit) : "—"}
                      </TableCell>
                      <TableCell className="text-[11px] font-mono text-slate-400">{jl.referenceId}</TableCell>
                      <TableCell className="text-sm text-slate-500">{jl.companyId}</TableCell>
                      <TableCell className="text-sm text-slate-400">{jl.postedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* GL Balances */}
        <TabsContent value="gl">
          <div className="bg-white border border-slate-200/60 rounded overflow-hidden mt-3">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b-slate-200">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">GL Code</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Account Name</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Type</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Opening Balance</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Period Debit</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Period Credit</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Closing Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {glBalances.map(gl => (
                    <TableRow key={gl.accountCode} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                      <TableCell className="text-sm font-mono font-semibold text-[#1e3a5f]">{gl.accountCode}</TableCell>
                      <TableCell className="text-sm font-semibold text-[#1e3a5f]">{gl.accountName}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          gl.type === "Asset" ? "bg-blue-50 text-blue-700" :
                          gl.type === "Liability" ? "bg-amber-50 text-amber-700" :
                          gl.type === "Income" ? "bg-emerald-50 text-emerald-700" :
                          gl.type === "Expense" ? "bg-red-50 text-red-700" :
                          "bg-slate-50 text-slate-600"
                        }`}>{gl.type}</span>
                      </TableCell>
                      <TableCell className="text-sm text-right font-mono text-slate-500">{formatMMK(gl.openingBalance)}</TableCell>
                      <TableCell className={`text-sm text-right font-mono font-medium ${gl.periodDebit > 0 ? "text-emerald-700" : "text-slate-300"}`}>
                        {gl.periodDebit > 0 ? formatMMK(gl.periodDebit) : "—"}
                      </TableCell>
                      <TableCell className={`text-sm text-right font-mono font-medium ${gl.periodCredit > 0 ? "text-red-700" : "text-slate-300"}`}>
                        {gl.periodCredit > 0 ? formatMMK(gl.periodCredit) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-right font-mono font-bold text-[#1e3a5f]">{formatMMK(gl.closingBalance)}</TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-[#1e3a5f]/5 border-t-2 border-[#1e3a5f]/20">
                    <TableCell className="text-sm font-bold text-[#1e3a5f]" colSpan={3}>TOTAL</TableCell>
                    <TableCell className="text-sm text-right font-mono font-bold text-[#1e3a5f]">{formatMMK(glBalances.reduce((s, g) => s + g.openingBalance, 0))}</TableCell>
                    <TableCell className="text-sm text-right font-mono font-bold text-emerald-700">{formatMMK(totalDebit)}</TableCell>
                    <TableCell className="text-sm text-right font-mono font-bold text-red-700">{formatMMK(totalCredit)}</TableCell>
                    <TableCell className="text-sm text-right font-mono font-bold text-[#1e3a5f]">{formatMMK(glBalances.reduce((s, g) => s + g.closingBalance, 0))}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Trial Balance */}
        <TabsContent value="trial">
          <div className="bg-white border border-slate-200/60 rounded overflow-hidden mt-3">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b-slate-200">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">GL Code</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Account</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Type</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Debit</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {glBalances.map(gl => {
                    const debit = gl.closingBalance > 0 ? gl.closingBalance : 0;
                    const credit = gl.closingBalance < 0 ? Math.abs(gl.closingBalance) : 0;
                    return (
                      <TableRow key={gl.accountCode} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                        <TableCell className="text-sm font-mono text-slate-500">{gl.accountCode}</TableCell>
                        <TableCell className="text-sm font-medium text-[#1e3a5f]">{gl.accountName}</TableCell>
                        <TableCell className="text-sm text-slate-500">{gl.type}</TableCell>
                        <TableCell className={`text-sm text-right font-mono font-semibold ${debit > 0 ? "text-emerald-700" : "text-slate-300"}`}>
                          {debit > 0 ? formatMMK(debit) : "—"}
                        </TableCell>
                        <TableCell className={`text-sm text-right font-mono font-semibold ${credit > 0 ? "text-red-700" : "text-slate-300"}`}>
                          {credit > 0 ? formatMMK(credit) : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-[#1e3a5f]/5 border-t-2 border-[#1e3a5f]/20">
                    <TableCell className="font-bold text-[#1e3a5f]" colSpan={3}>TOTAL</TableCell>
                    <TableCell className="text-sm text-right font-mono font-bold text-emerald-700">
                      {formatMMK(glBalances.reduce((s, g) => (g.closingBalance > 0 ? s + g.closingBalance : s), 0))}
                    </TableCell>
                    <TableCell className="text-sm text-right font-mono font-bold text-red-700">
                      {formatMMK(glBalances.reduce((s, g) => (g.closingBalance < 0 ? s + Math.abs(g.closingBalance) : s), 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Chart of Accounts */}
      <div className="bg-white border border-slate-200/60 rounded p-4">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Chart of Accounts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {chartOfAccounts.map(acct => (
            <div key={acct.code} className="flex items-center gap-2.5 p-3 rounded border border-slate-200/60 bg-slate-50/50">
              <span className="text-[11px] font-mono font-bold text-[#1e3a5f]">{acct.code}</span>
              <span className="text-sm text-slate-700 font-medium">{acct.name}</span>
              <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                acct.type === "Asset" ? "bg-blue-50 text-blue-700" :
                acct.type === "Liability" ? "bg-amber-50 text-amber-700" :
                acct.type === "Income" ? "bg-emerald-50 text-emerald-700" :
                acct.type === "Expense" ? "bg-red-50 text-red-700" :
                "bg-slate-100 text-slate-600"
              }`}>{acct.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
