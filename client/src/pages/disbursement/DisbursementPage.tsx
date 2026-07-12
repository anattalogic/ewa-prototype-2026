/**
 * DisbursementPage — Full Disbursement Engine with State Machine
 * States: REQUESTED → VALIDATING → DISBURSING → COMPLETED / FAILED / RETRYING / TIMEOUT
 * Features: Auto-disbursement after EWA verification, cashout channel selection, retry management
 * Design: Enterprise Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Zap, Clock, CheckCircle2, XCircle, RotateCcw, AlertTriangle,
  ChevronRight, ArrowRightLeft, Building2, CreditCard, Smartphone,
  Hash, Eye, History, BarChart3
} from "lucide-react";

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "MMK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

// ─── DISBURSEMENT STATE MACHINE ──────────────────────────────────────────────

type DisbursementStatus = "REQUESTED" | "VALIDATING" | "DISBURSING" | "COMPLETED" | "FAILED" | "RETRYING" | "TIMEOUT";

const STATUS_FLOW: DisbursementStatus[] = ["REQUESTED", "VALIDATING", "DISBURSING", "COMPLETED"];
const FAIL_FLOW: DisbursementStatus[] = ["REQUESTED", "VALIDATING", "DISBURSING", "FAILED"];
const RETRY_FLOW: DisbursementStatus[] = ["REQUESTED", "VALIDATING", "DISBURSING", "FAILED", "RETRYING", "COMPLETED"];
const TIMEOUT_FLOW: DisbursementStatus[] = ["REQUESTED", "VALIDATING", "TIMEOUT"];

function getFlowStatus(status: DisbursementStatus): number {
  if (status === "COMPLETED") return 3;
  if (status === "FAILED") return 3;
  if (status === "TIMEOUT") return 2;
  if (status === "RETRYING") return 3;
  const idx = STATUS_FLOW.indexOf(status);
  return idx >= 0 ? idx : 0;
}

const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  "REQUESTED": { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", label: "Requested" },
  "VALIDATING": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Validating" },
  "DISBURSING": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Disbursing" },
  "COMPLETED": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Completed" },
  "FAILED": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Failed" },
  "RETRYING": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", label: "Retrying" },
  "TIMEOUT": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", label: "Timeout" },
};

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

interface DisbursementRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  companyName: string;
  amount: number;
  cashoutChannel: "BANK_TRANSFER" | "MOBILE_WALLET" | "AGENT_OTC";
  bankName: string;
  status: DisbursementStatus;
  retryCount: number;
  maxRetries: number;
  requestedAt: string;
  validatedAt: string | null;
  disbursedAt: string | null;
  journalRef: string;
  timeoutAt: string | null;
  failureReason: string | null;
  ewaVerified: boolean;
  budgetAvailable: boolean;
}

const disbursementRecords: DisbursementRecord[] = [
  { id: "DISB-001", employeeId: "EMP-001", employeeName: "Aung Kyaw", companyName: "Tech Solutions Ltd", amount: 50000, cashoutChannel: "BANK_TRANSFER", bankName: "KBZ Bank", status: "COMPLETED", retryCount: 0, maxRetries: 3, requestedAt: "2026-07-10 09:15", validatedAt: "2026-07-10 09:16", disbursedAt: "2026-07-10 09:18", journalRef: "JE-2026-1001", timeoutAt: null, failureReason: null, ewaVerified: true, budgetAvailable: true },
  { id: "DISB-002", employeeId: "EMP-003", employeeName: "Thet Hnin", companyName: "Manufacturing Co", amount: 75000, cashoutChannel: "MOBILE_WALLET", bankName: "Wave Money", status: "DISBURSING", retryCount: 0, maxRetries: 3, requestedAt: "2026-07-10 10:30", validatedAt: "2026-07-10 10:31", disbursedAt: null, journalRef: "JE-2026-1002", timeoutAt: null, failureReason: null, ewaVerified: true, budgetAvailable: true },
  { id: "DISB-003", employeeId: "EMP-005", employeeName: "Zaw Win", companyName: "Logistics Myanmar", amount: 30000, cashoutChannel: "AGENT_OTC", bankName: "CB Bank", status: "FAILED", retryCount: 2, maxRetries: 3, requestedAt: "2026-07-09 14:20", validatedAt: "2026-07-09 14:21", disbursedAt: null, journalRef: "JE-2026-1003", timeoutAt: null, failureReason: "Bank gateway timeout", ewaVerified: true, budgetAvailable: true },
  { id: "DISB-004", employeeId: "EMP-008", employeeName: "Hla May", companyName: "Retail Chain", amount: 100000, cashoutChannel: "BANK_TRANSFER", bankName: "AYA Bank", status: "RETRYING", retryCount: 3, maxRetries: 5, requestedAt: "2026-07-09 11:00", validatedAt: "2026-07-09 11:02", disbursedAt: null, journalRef: "JE-2026-1004", timeoutAt: null, failureReason: "Insufficient prefund balance", ewaVerified: true, budgetAvailable: false },
  { id: "DISB-005", employeeId: "EMP-012", employeeName: "Myo Lin", companyName: "Tech Solutions Ltd", amount: 25000, cashoutChannel: "MOBILE_WALLET", bankName: "KBZ Pay", status: "TIMEOUT", retryCount: 0, maxRetries: 3, requestedAt: "2026-07-08 16:45", validatedAt: null, disbursedAt: null, journalRef: "JE-2026-1005", timeoutAt: "2026-07-08 17:15", failureReason: "Validation timeout — payroll data sync failed", ewaVerified: false, budgetAvailable: true },
  { id: "DISB-006", employeeId: "EMP-002", employeeName: "Nyein Chan", companyName: "Manufacturing Co", amount: 60000, cashoutChannel: "BANK_TRANSFER", bankName: "KBZ Bank", status: "VALIDATING", retryCount: 0, maxRetries: 3, requestedAt: "2026-07-10 11:00", validatedAt: null, disbursedAt: null, journalRef: "JE-2026-1006", timeoutAt: null, failureReason: null, ewaVerified: true, budgetAvailable: true },
];

// ─── STATE FLOW VISUAL ──────────────────────────────────────────────────────

function StateFlowVisual({ status }: { status: DisbursementStatus }) {
  const flow = status === "TIMEOUT" ? TIMEOUT_FLOW : status === "FAILED" || status === "RETRYING" ? RETRY_FLOW : STATUS_FLOW;
  const currentIndex = flow.indexOf(status);

  return (
    <div className="flex items-center gap-0.5 py-2">
      {flow.map((step, i) => {
        const sc = statusConfig[step];
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex items-center">
            <div className={`px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase border ${isCompleted ? "bg-emerald-50 border-emerald-200 text-emerald-700" : isCurrent ? sc.bg + " " + sc.border + " " + sc.text : "bg-slate-50 border-slate-200 text-slate-400"}`}>
              {statusConfig[step].label}
            </div>
            {i < flow.length - 1 && (
              <ChevronRight className={`w-3 h-3 mx-0.5 ${isCompleted ? "text-emerald-400" : "text-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export function DisbursementPage() {
  const [selectedRecord, setSelectedRecord] = useState<DisbursementRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filtered = filterStatus === "ALL" ? disbursementRecords : disbursementRecords.filter(r => r.status === filterStatus);

  const stats = {
    total: disbursementRecords.length,
    completed: disbursementRecords.filter(r => r.status === "COMPLETED").length,
    disburSing: disbursementRecords.filter(r => r.status === "DISBURSING").length,
    failed: disbursementRecords.filter(r => r.status === "FAILED").length,
    retrying: disbursementRecords.filter(r => r.status === "RETRYING").length,
    timeout: disbursementRecords.filter(r => r.status === "TIMEOUT").length,
    validating: disbursementRecords.filter(r => r.status === "VALIDATING").length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal-500" />
          Disbursement Engine
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Auto-disbursement after EWA verification · Cashout channel selection · Retry & timeout management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-7 gap-2">
        <KpiCard label="Total Requests" value={String(stats.total)} color="border-t-[#1e3a5f]" />
        <KpiCard label="Completed" value={String(stats.completed)} color="border-t-emerald-500" />
        <KpiCard label="Disbursing" value={String(stats.disburSing)} color="border-t-blue-500" />
        <KpiCard label="Validating" value={String(stats.validating)} color="border-t-amber-500" />
        <KpiCard label="Failed" value={String(stats.failed)} color="border-t-red-500" />
        <KpiCard label="Retrying" value={String(stats.retrying)} color="border-t-purple-500" />
        <KpiCard label="Timeout" value={String(stats.timeout)} color="border-t-orange-500" />
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="bg-slate-100/50">
          <TabsTrigger value="queue" className="text-[10px]">Queue</TabsTrigger>
          <TabsTrigger value="detail" className="text-[10px]">Detail</TabsTrigger>
          <TabsTrigger value="history" className="text-[10px]">History</TabsTrigger>
          <TabsTrigger value="analytics" className="text-[10px]">Analytics</TabsTrigger>
        </TabsList>

        {/* QUEUE TAB */}
        <TabsContent value="queue" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Disbursement Queue</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {["ALL", "REQUESTED", "VALIDATING", "DISBURSING", "COMPLETED", "FAILED", "RETRYING", "TIMEOUT"].map(s => (
                  <button key={s} className={`px-2 py-0.5 text-[9px] font-bold rounded-sm border transition-colors ${filterStatus === s ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`} onClick={() => setFilterStatus(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Employee</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Channel</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Bank</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">EWA Verified</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Budget</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Retry</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Flow</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Requested</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(r => {
                    const sc = statusConfig[r.status];
                    return (
                      <TableRow key={r.id} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                        <TableCell className="text-xs font-mono font-bold text-[#1e3a5f]">{r.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{r.employeeName}</p>
                            <p className="text-[9px] text-slate-400 font-mono">{r.companyName}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-mono font-bold text-emerald-600">{formatMMK(r.amount)}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-[10px]">
                            {r.cashoutChannel === "BANK_TRANSFER" && <Building2 className="w-3 h-3 text-blue-500" />}
                            {r.cashoutChannel === "MOBILE_WALLET" && <Smartphone className="w-3 h-3 text-purple-500" />}
                            {r.cashoutChannel === "AGENT_OTC" && <CreditCard className="w-3 h-3 text-amber-500" />}
                            {r.cashoutChannel.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell className="text-[10px] text-slate-600">{r.bankName}</TableCell>
                        <TableCell>
                          {r.ewaVerified ? (
                            <Badge variant="outline" className="text-[8px] bg-emerald-50 text-emerald-600 border-emerald-200">Verified</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[8px] bg-red-50 text-red-600 border-red-200">Failed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {r.budgetAvailable ? (
                            <Badge variant="outline" className="text-[8px] bg-blue-50 text-blue-600 border-blue-200">OK</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[8px] bg-red-50 text-red-600 border-red-200">Low</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-[10px] font-mono text-slate-500">{r.retryCount}/{r.maxRetries}</TableCell>
                        <TableCell><Badge variant="outline" className={`text-[9px] font-bold uppercase ${sc.bg} ${sc.border} ${sc.text}`}>{sc.label}</Badge></TableCell>
                        <TableCell className="py-2"><StateFlowVisual status={r.status} /></TableCell>
                        <TableCell className="text-[10px] text-slate-500">{r.requestedAt}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-7 text-[10px] font-medium text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                            onClick={() => setSelectedRecord(r)}>
                            <Eye className="w-3 h-3 mr-1" /> Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DETAIL TAB */}
        <TabsContent value="detail" className="mt-4">
          {selectedRecord ? (
            <div className="space-y-4">
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-teal-500" />
                    {selectedRecord.id} — {selectedRecord.employeeName}
                  </h3>
                  <Badge variant="outline" className={`text-[9px] font-bold uppercase ${statusConfig[selectedRecord.status].bg} ${statusConfig[selectedRecord.status].border} ${statusConfig[selectedRecord.status].text}`}>
                    {statusConfig[selectedRecord.status].label}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-2 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Amount</p>
                    <p className="text-base font-bold font-mono text-[#1e3a5f]">{formatMMK(selectedRecord.amount)}</p>
                  </div>
                  <div className="p-2 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Channel</p>
                    <p className="text-xs font-medium text-slate-700">{selectedRecord.cashoutChannel.replace("_", " ")}</p>
                  </div>
                  <div className="p-2 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Bank</p>
                    <p className="text-xs font-medium text-slate-700">{selectedRecord.bankName}</p>
                  </div>
                  <div className="p-2 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Journal</p>
                    <p className="text-xs font-mono text-slate-600">{selectedRecord.journalRef}</p>
                  </div>
                </div>

                {/* State Flow */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">State Flow</p>
                  <StateFlowVisual status={selectedRecord.status} />
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-4 gap-3">
                  <TimelineEntry label="Requested" value={selectedRecord.requestedAt} status={selectedRecord.status !== "REQUESTED" ? "done" : "current"} />
                  <TimelineEntry label="Validated" value={selectedRecord.validatedAt || "—"} status={selectedRecord.validatedAt ? "done" : selectedRecord.timeoutAt ? "failed" : "pending"} />
                  <TimelineEntry label="Disbursed" value={selectedRecord.disbursedAt || "—"} status={selectedRecord.disbursedAt ? "done" : "pending"} />
                  <TimelineEntry label="Failure" value={selectedRecord.failureReason || "—"} status={selectedRecord.failureReason ? "failed" : "pending"} />
                </div>

                {/* Retry Management */}
                {selectedRecord.status === "FAILED" || selectedRecord.status === "RETRYING" ? (
                  <div className="mt-4 p-3 bg-red-50/50 border border-red-100 rounded-sm">
                    <div className="flex items-center gap-2 text-xs text-red-700 mb-2">
                      <RotateCcw className="w-4 h-4" />
                      <span className="font-bold">Retry Management — {selectedRecord.retryCount}/{selectedRecord.maxRetries} attempts used</span>
                    </div>
                    <Progress value={(selectedRecord.retryCount / selectedRecord.maxRetries) * 100} className="h-2" />
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" disabled={selectedRecord.retryCount >= selectedRecord.maxRetries}>
                        <RotateCcw className="w-3 h-3 mr-1" /> Retry Now
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 text-red-600">
                        Cancel Disbursement
                      </Button>
                    </div>
                    {selectedRecord.failureReason && (
                      <p className="text-[10px] text-red-500 mt-2">Last failure: {selectedRecord.failureReason}</p>
                    )}
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  {selectedRecord.status === "REQUESTED" && (
                    <Button className="h-9 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                      <Zap className="w-3.5 h-3.5 mr-1.5" /> Initiate Auto-Disbursement
                    </Button>
                  )}
                  {selectedRecord.status === "VALIDATING" && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold">Validation in progress — checking EWA cap, budget, payroll data...</span>
                    </div>
                  )}
                  {selectedRecord.status === "COMPLETED" && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold">Disbursement Complete — Ledger posted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Zap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Select a disbursement from the queue to view details</p>
            </div>
          )}
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Completed Disbursements</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Employee</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Channel</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Bank Ref</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Journal</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Disbursed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disbursementRecords.filter(r => r.status === "COMPLETED").map(r => (
                    <TableRow key={r.id} className="border-b-slate-100">
                      <TableCell className="text-xs font-mono font-bold text-emerald-700">{r.id}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-700">{r.employeeName}</TableCell>
                      <TableCell className="text-xs text-right font-mono font-bold text-emerald-600">{formatMMK(r.amount)}</TableCell>
                      <TableCell className="text-[10px] text-slate-600">{r.cashoutChannel.replace("_", " ")}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{r.journalRef}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{r.journalRef}</TableCell>
                      <TableCell className="text-[10px] text-slate-500">{r.disbursedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Disbursement Analytics</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-sm border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Channel Distribution</p>
                  <div className="space-y-2">
                    {["BANK_TRANSFER", "MOBILE_WALLET", "AGENT_OTC"].map(ch => {
                      const count = disbursementRecords.filter(r => r.cashoutChannel === ch).length;
                      const pct = Math.round((count / disbursementRecords.length) * 100);
                      return (
                        <div key={ch}>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-600">{ch.replace("_", " ")}</span>
                            <span className="font-mono text-slate-700">{count} ({pct}%)</span>
                          </div>
                          <Progress value={pct} className="h-1.5 mt-1" />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-sm border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Success Rate</p>
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-emerald-600 font-mono">{Math.round((stats.completed / stats.total) * 100)}%</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Completion Rate</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-sm border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Retry Statistics</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-600">Failed + Retrying</span>
                      <span className="font-mono text-red-600">{stats.failed + stats.retrying}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-600">Timeout</span>
                      <span className="font-mono text-orange-600">{stats.timeout}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-600">Avg Retry Count</span>
                      <span className="font-mono text-slate-700">1.4</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={"p-3 bg-white rounded-sm border border-slate-100 " + color + " border-t-2"}>
      <p className="text-lg font-bold text-[#1e3a5f] font-mono">{value}</p>
      <p className="text-[8px] text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function TimelineEntry({ label, value, status }: { label: string; value: string; status: "done" | "current" | "pending" | "failed" }) {
  const colors = { done: "text-emerald-600", current: "text-amber-600", pending: "text-slate-400", failed: "text-red-600" };
  return (
    <div className="p-2 bg-white rounded-sm border border-slate-100">
      <p className="text-[9px] text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={"text-xs font-mono " + colors[status]}>{value}</p>
    </div>
  );
}
