/**
 * RepaymentPage — Repayment & Settlement Module
 * Design: Neobrutalist Fintech — Full enterprise repayment workflow with maker-checker
 * Workflow: DRAFT → SUBMITTED → FINANCE_REVIEW → FINANCE_UPDATED → APPROVED → POSTED
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMMK, repaymentRequests, settlements } from "@/data/mockData";
import { Search, FileText, ShieldCheck, ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock, Repeat } from "lucide-react";

function RepaymentStatusBadge({ status }: { status: string }) {
  const c: Record<string, { bg: string; text: string }> = {
    "DRAFT": { bg: "bg-slate-100", text: "text-slate-600" },
    "SUBMITTED": { bg: "bg-blue-100", text: "text-blue-700" },
    "FINANCE_REVIEW": { bg: "bg-amber-100", text: "text-amber-700" },
    "FINANCE_UPDATED": { bg: "bg-purple-100", text: "text-purple-700" },
    "APPROVED": { bg: "bg-emerald-100", text: "text-emerald-700" },
    "POSTED": { bg: "bg-emerald-50", text: "text-emerald-600" },
    "REJECTED": { bg: "bg-red-100", text: "text-red-700" },
  };
  const s = c[status] || c["DRAFT"];
  return <Badge variant="outline" className={`${s.bg} ${s.text} ${s.bg.replace("bg-", "border-").replace("100", "200")} text-xs font-medium`}>{status.replace("_", " ")}</Badge>;
}

function WorkflowSteps({ status }: { status: string }) {
  const steps = ["DRAFT", "SUBMITTED", "FINANCE_REVIEW", "FINANCE_UPDATED", "APPROVED", "POSTED"];
  const currentIndex = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
            i <= currentIndex ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
          }`}>
            {i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-4 h-0.5 ${i < currentIndex ? "bg-emerald-500" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function RepaymentPage() {
  const [search, setSearch] = useState("");

  const filtered = repaymentRequests.filter(r => {
    if (search && !(r.companyName.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Repayment & Settlement</h1>
        <p className="text-sm text-slate-500 mt-0.5">DRAFT → SUBMITTED → FINANCE REVIEW → FINANCE UPDATED → APPROVED → POSTED</p>
      </div>

      <Tabs defaultValue="repayments">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="repayments" className="text-sm">Repayment Requests</TabsTrigger>
          <TabsTrigger value="settlements" className="text-sm">Settlements</TabsTrigger>
        </TabsList>

        <TabsContent value="repayments">
          <Card className="mt-3">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search company or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-3">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">ID</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Initiator</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Period</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Principal</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Late Fee</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Payment</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Workflow</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(req => (
                    <TableRow key={req.id} className="hover:bg-slate-50/80">
                      <TableCell className="text-sm font-mono font-medium text-slate-800">{req.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{req.companyName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{req.companyId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-slate-700">{req.initiatorName}</p>
                          <p className="text-[11px] text-slate-400">{req.initiator}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{req.period}</TableCell>
                      <TableCell className="text-sm text-right font-medium text-slate-800">{formatMMK(req.totalAmount)}</TableCell>
                      <TableCell className="text-sm text-right text-slate-600">{formatMMK(req.principalAmount)}</TableCell>
                      <TableCell className={`text-sm text-right font-medium ${req.lateFeeAmount > 0 ? "text-amber-600" : "text-slate-400"}`}>
                        {req.lateFeeAmount > 0 ? formatMMK(req.lateFeeAmount) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{req.paymentMethod}</TableCell>
                      <TableCell><RepaymentStatusBadge status={req.status} /></TableCell>
                      <TableCell><WorkflowSteps status={req.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Detail Expansion */}
          <Card className="mt-3">
            <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Repayment Items — REP-2026-07-003 (Myanmar Tech Solutions)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Employee</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Principal</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Late Fee</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Service Fee</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Allocation %</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Allocated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repaymentRequests[2].items.map((item, i) => (
                    <TableRow key={i} className="hover:bg-slate-50/80">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.employeeName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{item.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-right text-slate-700">{formatMMK(item.principal)}</TableCell>
                      <TableCell className={`text-sm text-right ${item.lateFee > 0 ? "text-amber-600 font-medium" : "text-slate-400"}`}>{item.lateFee > 0 ? formatMMK(item.lateFee) : "—"}</TableCell>
                      <TableCell className="text-sm text-right text-slate-500">{item.serviceFee > 0 ? formatMMK(item.serviceFee) : "—"}</TableCell>
                      <TableCell className="text-sm text-right font-medium text-slate-800">{formatMMK(item.total)}</TableCell>
                      <TableCell className="text-sm text-right text-slate-600">{item.allocationPct}%</TableCell>
                      <TableCell className="text-sm text-right font-medium text-slate-800">{formatMMK(item.allocatedAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlements">
          <Card className="mt-3">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">ID</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Submitted By</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Amount</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Method</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Bank Ref</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map(set => (
                    <TableRow key={set.id} className="hover:bg-slate-50/80">
                      <TableCell className="text-sm font-mono font-medium text-slate-800">{set.id}</TableCell>
                      <TableCell className="text-sm text-slate-700">{set.companyName}</TableCell>
                      <TableCell className="text-sm text-slate-600">{set.submittedBy}</TableCell>
                      <TableCell className="text-sm text-right font-medium text-slate-800">{formatMMK(set.totalAmount)}</TableCell>
                      <TableCell className="text-sm text-slate-600">{set.paymentMethod}</TableCell>
                      <TableCell className="text-xs font-mono text-slate-400">{set.bankReference}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${set.status === "CHECKER_APPROVED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : set.status === "MAKER_APPROVED" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                          {set.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{set.submittedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
