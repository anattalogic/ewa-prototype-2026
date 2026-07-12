/**
 * SettlementPage — Settlement Verification (Maker-Checker)
 * Design: Neobrutalist Fintech — SUBMITTED → MAKER_APPROVED → CHECKER_APPROVED
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMMK, settlements } from "@/data/mockData";
import { ShieldCheck, CheckCircle2, AlertCircle, Eye, FileCheck } from "lucide-react";

function SettlementStatusBadge({ status }: { status: string }) {
  const c: Record<string, { bg: string; text: string; border: string }> = {
    "SUBMITTED": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
    "MAKER_APPROVED": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    "CHECKER_APPROVED": { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
    "REJECTED": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  };
  const s = c[status] || c["SUBMITTED"];
  return <Badge variant="outline" className={`${s.bg} ${s.text} ${s.border} text-xs font-medium`}>{status.replace("_", " ")}</Badge>;
}

function WorkflowSteps({ status }: { status: string }) {
  const steps = ["SUBMITTED", "MAKER_APPROVED", "CHECKER_APPROVED"];
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

export function SettlementPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settlement Verification</h1>
        <p className="text-sm text-slate-500 mt-0.5">Maker-Checker protocol: SUBMITTED → MAKER APPROVED → CHECKER APPROVED</p>
      </div>

      {/* Workflow Legend */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">1. Submitted</span>
            <span className="text-slate-300">→</span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">2. Maker Approved</span>
            <span className="text-slate-300">→</span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">3. Checker Approved</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Maker and Checker must be different users. Both must verify bank reference and screenshot.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Settlement Queue</CardTitle></CardHeader>
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
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Screenshot</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Workflow</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Submitted</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlements.map(set => (
                <TableRow key={set.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-sm font-mono font-medium text-slate-800">{set.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{set.companyName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{set.companyId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{set.submittedBy}</TableCell>
                  <TableCell className="text-sm text-right font-medium text-slate-800">{formatMMK(set.totalAmount)}</TableCell>
                  <TableCell className="text-sm text-slate-600">{set.paymentMethod}</TableCell>
                  <TableCell className="text-xs font-mono text-slate-400">{set.bankReference}</TableCell>
                  <TableCell>
                    {set.screenshot ? (
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200">
                        <Eye className="w-3 h-3 mr-1" /> Attached
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">Missing</Badge>
                    )}
                  </TableCell>
                  <TableCell><SettlementStatusBadge status={set.status} /></TableCell>
                  <TableCell><WorkflowSteps status={set.status} /></TableCell>
                  <TableCell className="text-xs text-slate-500">{set.submittedAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {set.status === "SUBMITTED" && (
                        <>
                          <Button size="sm" className="h-7 text-xs bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Verify
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      {set.status === "MAKER_APPROVED" && (
                        <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                          <FileCheck className="w-3 h-3 mr-1" /> Final Approve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
