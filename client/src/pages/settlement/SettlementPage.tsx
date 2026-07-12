/**
 * SettlementPage — Enhanced Settlement Verification (Maker-Checker)
 * Design: Neobrutalist Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 * Workflow: SUBMITTED → MAKER_VERIFIED → CHECKER_APPROVED → POSTED
 * Enhanced: Detail panels, maker/checker identity, bank reference verification, screenshot inspection
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatMMK, settlements, repaymentRequests, type Settlement, type RepaymentRequest } from "@/data/mockData";
import {
  ShieldCheck, CheckCircle2, AlertCircle, Eye, FileCheck, XCircle,
  User, Building2, Landmark, Camera, ChevronRight, Clock,
  ShieldAlert, Hash, Repeat, ArrowRightLeft
} from "lucide-react";
import { useView } from "@/contexts/ViewContext";

// ─── STATUS COLORS ───────────────────────────────────────────────────────────

function SettlementStatusBadge({ status }: { status: string }) {
  const c: Record<string, { bg: string; text: string; border: string }> = {
    "SUBMITTED": { bg: "bg-amber-50 text-amber-700", border: "border-amber-200", text: "Submitted" },
    "MAKER_APPROVED": { bg: "bg-blue-50 text-blue-700", border: "border-blue-200", text: "Maker Verified" },
    "CHECKER_APPROVED": { bg: "bg-emerald-50 text-emerald-700", border: "border-emerald-200", text: "Checker Approved" },
    "POSTED": { bg: "bg-emerald-100 text-emerald-800", border: "border-emerald-300", text: "Posted" },
    "REJECTED": { bg: "bg-red-50 text-red-700", border: "border-red-200", text: "Rejected" },
  };
  const s = c[status] || c["SUBMITTED"];
  return <Badge variant="outline" className={`${s.bg} ${s.border} text-[10px] font-bold uppercase`}>{s.text}</Badge>;
}

// ─── WORKFLOW STEPPER ────────────────────────────────────────────────────────

function WorkflowStepper({ status }: { status: string }) {
  const steps = [
    { key: "SUBMITTED", label: "1.Submitted", desc: "Submitted" },
    { key: "MAKER_APPROVED", label: "2.Maker", desc: "Maker verified" },
    { key: "CHECKER_APPROVED", label: "3.Checker", desc: "Checker approved" },
    { key: "POSTED", label: "4.Posted", desc: "Posted" },
  ];
  const currentIndex = steps.findIndex(s => s.key === status);
  const actualIndex = currentIndex === -1 ? (status === "REJECTED" ? 0 : steps.length - 1) : currentIndex;

  return (
    <div className="flex items-center gap-0.5 py-1">
      {steps.map((step, i) => {
        const isComplete = i < actualIndex;
        const isCurrent = i === actualIndex && status !== "REJECTED";
        const isRejected = status === "REJECTED" && i === 0;
        const isActive = isComplete || isCurrent;

        return (
          <div key={step.key} className="flex items-center gap-0.5">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all ${
                isRejected
                  ? "bg-red-500 text-white border-red-500"
                  : isComplete
                    ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                    : isCurrent
                      ? "bg-[#0ea5e9] text-white border-[#0ea5e9]"
                      : "bg-slate-100 text-slate-400 border-slate-200"
              }`}>
                {isComplete ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-[8px] mt-0.5 font-bold uppercase tracking-wider ${
                isActive ? "text-[#1e3a5f]" : "text-slate-300"
              }`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className={`w-3 h-3 shrink-0 mb-4 ${
                i < actualIndex ? "text-[#1e3a5f]" : "text-slate-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── SETTLEMENT DETAIL PANEL ─────────────────────────────────────────────────

function SettlementDetail({ set }: { set: Settlement }) {
  const isMakerVerifier = true; // Mock: current user is the Maker
  const isCheckerVerifier = true; // Mock: current user is the Checker

  const relatedRepayment = repaymentRequests.find(r => r.companyId === set.companyId);

  return (
    <div className="space-y-4">
      {/* Settlement identity */}
      <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Settlement {set.id}
          </h3>
          <SettlementStatusBadge status={set.status} />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Company:</span>
            <span className="font-medium text-[#1e3a5f]">{set.companyName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Submitted By:</span>
            <span className="font-medium text-slate-700">{set.submittedBy}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Landmark className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Bank Reference:</span>
            <span className="font-mono font-bold text-[#1e3a5f]">{set.bankReference}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Repeat className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Payment Method:</span>
            <span className="font-medium text-slate-700">{set.paymentMethod}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Amount:</span>
            <span className="font-mono font-bold text-emerald-600">{formatMMK(set.totalAmount)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Submitted:</span>
            <span className="font-medium text-slate-700">{set.submittedAt}</span>
          </div>
        </div>
      </div>

      {/* Maker-Checker identities */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-blue-200/60">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Maker</p>
                <p className="text-xs font-semibold text-slate-700">Finance Officer A</p>
              </div>
            </div>
            {set.makerVerifiedAt ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                <span className="font-medium">Verified at {set.makerVerifiedAt}</span>
              </div>
            ) : (
              <div className="text-xs text-amber-600 font-medium">Awaiting verification</div>
            )}
          </CardContent>
        </Card>
        <Card className="border-emerald-200/60">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Checker</p>
                <p className="text-xs font-semibold text-slate-700">Finance Manager B</p>
              </div>
            </div>
            {set.checkerApprovedAt ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                <span className="font-medium">Approved at {set.checkerApprovedAt}</span>
              </div>
            ) : (
              <div className="text-xs text-amber-600 font-medium">Awaiting approval</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bank reference verification panel */}
      <Card>
        <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5" /> Bank Reference Verification
        </CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
            <div>
              <p className="text-xs font-bold text-[#1e3a5f] font-mono">{set.bankReference}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Transaction Reference Number</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[9px]">Verified</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
            <div>
              <p className="text-xs font-bold text-emerald-600 font-mono">{formatMMK(set.totalAmount)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Amount Match: {set.paymentMethod}</p>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px]">Match Confirmed</Badge>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 p-2 bg-amber-50 rounded border border-amber-200">
            <ShieldAlert className="w-3 h-3 text-amber-500" />
            <span>Maker and Checker must be different users. Both must independently verify bank reference and screenshot.</span>
          </div>
        </CardContent>
      </Card>

      {/* Screenshot inspection */}
      <Card>
        <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Camera className="w-3.5 h-3.5" /> Screenshot Inspection
        </CardTitle></CardHeader>
        <CardContent>
          {set.screenshot ? (
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">Bank transfer screenshot attached</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Shows {formatMMK(set.totalAmount)} transferred via {set.paymentMethod} to {set.companyName}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                <span>Maker confirmed screenshot matches bank reference</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-red-600 p-3 bg-red-50 rounded border border-red-200">
              <XCircle className="w-3.5 h-3.5" />
              <span className="font-bold">Screenshot Missing — Cannot proceed with verification</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related repayment items */}
      {relatedRepayment && (
        <Card>
          <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <FileCheck className="w-3.5 h-3.5" /> Related Repayment Items
          </CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Employee</TableHead>
                  <TableHead className="text-[9px] uppercase tracking-wider text-slate-500 font-bold text-right">Principal</TableHead>
                  <TableHead className="text-[9px] uppercase tracking-wider text-slate-500 font-bold text-right">Late Fee</TableHead>
                  <TableHead className="text-[9px] uppercase tracking-wider text-slate-500 font-bold text-right">Total</TableHead>
                  <TableHead className="text-[9px] uppercase tracking-wider text-slate-500 font-bold text-right">Alloc %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedRepayment.items.map(item => (
                  <TableRow key={item.employeeId} className="border-b-slate-100">
                    <TableCell className="text-xs font-medium text-[#1e3a5f]">{item.employeeName}</TableCell>
                    <TableCell className="text-xs text-right font-mono text-slate-700">{formatMMK(item.principal)}</TableCell>
                    <TableCell className="text-xs text-right font-mono text-amber-600">{formatMMK(item.lateFee)}</TableCell>
                    <TableCell className="text-xs text-right font-mono font-bold text-[#1e3a5f]">{formatMMK(item.total)}</TableCell>
                    <TableCell className="text-xs text-right font-mono text-slate-500">{item.allocationPct}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-slate-50 border-t-2 border-slate-200">
                  <TableCell className="text-xs font-bold text-[#1e3a5f]">Total</TableCell>
                  <TableCell className="text-xs text-right font-mono font-bold text-slate-800">{formatMMK(relatedRepayment.principalAmount)}</TableCell>
                  <TableCell className="text-xs text-right font-mono font-bold text-amber-600">{formatMMK(relatedRepayment.lateFeeAmount)}</TableCell>
                  <TableCell className="text-xs text-right font-mono font-bold text-emerald-600">{formatMMK(relatedRepayment.totalAmount)}</TableCell>
                  <TableCell className="text-xs text-right font-mono font-bold text-slate-500">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        {set.status === "SUBMITTED" && isMakerVerifier && (
          <>
            <Button className="h-9 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Verify as Maker
            </Button>
            <Button variant="outline" className="h-9 text-xs font-medium border-red-200 text-red-600 hover:bg-red-50">
              <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
            </Button>
          </>
        )}
        {set.status === "MAKER_APPROVED" && isCheckerVerifier && (
          <>
            <Button className="h-9 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Approve as Checker
            </Button>
            <Button variant="outline" className="h-9 text-xs font-medium border-red-200 text-red-600 hover:bg-red-50">
              <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
            </Button>
          </>
        )}
        {set.status === "CHECKER_APPROVED" && (
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold">Settlement Posted — Ledger Updated</span>
          </div>
        )}
        {set.status === "REJECTED" && (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-bold">Settlement Rejected</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export function SettlementPage() {
  const { view } = useView();
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1e3a5f] uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1e3a5f]/40" />
            Settlement Verification
          </h1>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">
            Maker-Checker Protocol · 4-Step Workflow · {settlements.length} settlements
          </p>
        </div>
      </div>

      {/* Ledger divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#0ea5e9]/30 to-transparent" />

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="bg-white border border-slate-200/60">
          <TabsTrigger value="queue" className="text-xs font-medium data-[state=active]:text-[#1e3a5f] data-[state=active]:bg-white">
            Settlement Queue
          </TabsTrigger>
          <TabsTrigger value="detail" className="text-xs font-medium data-[state=active]:text-[#1e3a5f] data-[state=active]:bg-white">
            Verification Detail
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs font-medium data-[state=active]:text-[#1e3a5f] data-[state=active]:bg-white">
            Posted History
          </TabsTrigger>
        </TabsList>

        {/* QUEUE TAB */}
        <TabsContent value="queue" className="mt-4">
          {/* Workflow Legend */}
          <Card className="border-slate-200/60">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">1. Submitted</span>
                <span className="text-slate-300">→</span>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">2. Maker Verified</span>
                <span className="text-slate-300">→</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">3. Checker Approved</span>
                <span className="text-slate-300">→</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">4. Posted</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Maker and Checker must be different users. Both must independently verify bank reference number and payment screenshot before approval.</p>
            </CardContent>
          </Card>

          {/* Settlement Table */}
          <Card>
            <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Settlement Queue</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Company</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Submitted By</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Method</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Bank Ref</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Screenshot</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Workflow</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Submitted</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.map(set => (
                    <TableRow key={set.id} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                      <TableCell className="text-xs font-mono font-bold text-[#1e3a5f]">{set.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{set.companyName}</p>
                          <p className="text-[9px] text-slate-400 font-mono">{set.companyId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{set.submittedBy}</TableCell>
                      <TableCell className="text-xs text-right font-mono font-bold text-emerald-600">{formatMMK(set.totalAmount)}</TableCell>
                      <TableCell className="text-xs text-slate-600">{set.paymentMethod}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{set.bankReference}</TableCell>
                      <TableCell>
                        {set.screenshot ? (
                          <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-600 border-emerald-200">
                            <Eye className="w-2.5 h-2.5 mr-0.5" /> Attached
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] bg-red-50 text-red-600 border-red-200">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell><SettlementStatusBadge status={set.status} /></TableCell>
                      <TableCell className="py-2"><WorkflowStepper status={set.status} /></TableCell>
                      <TableCell className="text-[10px] text-slate-500">{set.submittedAt}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] font-medium text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                          onClick={() => { setSelectedSettlement(set); }}>
                          <Eye className="w-3 h-3 mr-1" /> Verify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DETAIL TAB */}
        <TabsContent value="detail" className="mt-4">
          {selectedSettlement ? (
            <SettlementDetail set={selectedSettlement} />
          ) : (
            <div className="text-center py-16">
              <ShieldCheck className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Select a settlement from the queue to verify</p>
              <p className="text-xs text-slate-300 mt-1">Click "Verify" on any row in the Settlement Queue tab</p>
            </div>
          )}
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Posted Settlements</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Company</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Bank Ref</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Maker</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Checker</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Posted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlements.filter(s => s.status === "CHECKER_APPROVED" || s.status === "MAKER_APPROVED").map(set => (
                    <TableRow key={set.id} className="border-b-slate-100">
                      <TableCell className="text-xs font-mono font-bold text-emerald-700">{set.id}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-700">{set.companyName}</TableCell>
                      <TableCell className="text-xs text-right font-mono font-bold text-emerald-600">{formatMMK(set.totalAmount)}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{set.bankReference}</TableCell>
                      <TableCell className="text-xs text-slate-600">{set.makerVerifiedAt ? "Finance Officer A" : "—"}</TableCell>
                      <TableCell className="text-xs text-slate-600">{set.checkerApprovedAt ? "Finance Manager B" : "—"}</TableCell>
                      <TableCell className="text-[10px] text-slate-500">{set.checkerApprovedAt || "—"}</TableCell>
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
