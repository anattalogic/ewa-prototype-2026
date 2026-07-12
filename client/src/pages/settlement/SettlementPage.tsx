/**
 * SettlementPage — Settlement Verification (SAP Fiori)
 * SAP Fiori Pattern: Object Page with Tabs (Queue / Detail / History)
 * Maker-Checker Protocol with detail panels and modal
 */
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatMMK, settlements, repaymentRequests, type Settlement } from "@/data/mockData";
import {
  ShieldCheck, CheckCircle2, AlertCircle, Eye, FileCheck, XCircle,
  User, Building2, Landmark, Camera, ChevronRight, Clock,
  ShieldAlert, Hash, Repeat, ArrowRightLeft, Shield, FileText
} from "lucide-react";
import { useView } from "@/contexts/ViewContext";
import { MakerCheckerModal } from "@/components/MakerCheckerModal";

/* ===== Fiori Semantic Status Badge ===== */
function SettlementStatusBadge({ status }: { status: string }) {
  const c: Record<string, { bg: string; text: string; border: string; label: string }> = {
    "SUBMITTED": { bg: "bg-[#fff8e1]", text: "text-[#e65100]", border: "border-[#ffcc80]", label: "Submitted" },
    "MAKER_APPROVED": { bg: "bg-[#e3f2fd]", text: "text-[#0d47a1]", border: "border-[#90caf9]", label: "Maker Verified" },
    "CHECKER_APPROVED": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#a5d6a7]", label: "Checker Approved" },
    "POSTED": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#81c784]", label: "Posted" },
    "REJECTED": { bg: "bg-[#fce4ec]", text: "text-[#b71c1c]", border: "border-[#ef9a9a]", label: "Rejected" },
  };
  const s = c[status] || c["SUBMITTED"];
  return <Badge variant="outline" className={`${s.bg} ${s.text} ${s.border} text-[10px] font-bold uppercase tracking-wider`}>{s.label}</Badge>;
}

/* ===== Compact Workflow Stepper ===== */
function WorkflowStepper({ status }: { status: string }) {
  const steps = ["SUBMITTED", "MAKER_APPROVED", "CHECKER_APPROVED", "POSTED"];
  const labels = ["Submitted", "Maker Verified", "Checker Approved", "Posted"];
  const colors = ["#f59e0b", "#1565c0", "#2e7d32", "#1b5e20"];
  const currentIndex = steps.indexOf(status);
  const actualIndex = currentIndex === -1 ? (status === "REJECTED" ? -1 : steps.length - 1) : currentIndex;

  return (
    <div className="flex items-center gap-1 py-1">
      {status === "REJECTED" ? (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#fce4ec] border border-[#ef9a9a] rounded-[2px]">
          <XCircle className="w-3.5 h-3.5 text-[#c62828]" />
          <span className="text-[9px] font-bold text-[#b71c1c] uppercase tracking-wider">Rejected</span>
        </div>
      ) : (
        <>
          {steps.map((step, i) => {
            const isComplete = i < actualIndex;
            const isCurrent = i === actualIndex;
            return (
              <div key={step} className="flex items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border ${
                  isComplete ? "bg-[#2e7d32] text-white border-[#2e7d32]" :
                  isCurrent ? `bg-white text-[#1e3a5f] border-2 border-[${colors[i]}]` :
                  "bg-[#f5f5f5] text-[#bdbdbd] border-[#e0e0e0]"
                }`} style={isCurrent ? { borderColor: colors[i] } : {}}>
                  {isComplete ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className={`w-2.5 h-2.5 ${i < actualIndex ? "text-[#2e7d32]" : "text-[#e0e0e0]"}`} />
                )}
              </div>
            );
          })}
          <span className="text-[8px] text-[#5a6b7c] font-medium ml-1">{labels[actualIndex >= 0 ? actualIndex : 0]}</span>
        </>
      )}
    </div>
  );
}

/* ===== Maker/Checker Identity Card ===== */
function IdentityCard({ role, name, verifiedAt }: { role: "Maker" | "Checker"; name: string; verifiedAt?: string }) {
  const isMaker = role === "Maker";
  return (
    <div className={`bg-white border rounded-[3px] p-3 ${isMaker ? "border-[#90caf9]" : "border-[#a5d6a7]"}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isMaker ? "bg-[#e3f2fd]" : "bg-[#e8f5e9]"}`}>
          {isMaker ? <User className="w-3.5 h-3.5 text-[#1565c0]" /> : <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />}
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: isMaker ? "#1565c0" : "#2e7d32" }}>{role}</p>
          <p className="text-[11px] font-semibold text-[#1e3a5f]">{name}</p>
        </div>
      </div>
      {verifiedAt ? (
        <div className="flex items-center gap-1.5 text-[10px] text-[#2e7d32]">
          <CheckCircle2 className="w-3 h-3" />
          <span className="font-medium">Verified at {verifiedAt}</span>
        </div>
      ) : (
        <div className="text-[10px] text-[#e65100] font-medium">Awaiting verification</div>
      )}
    </div>
  );
}

/* ===== Settlement Detail Panel ===== */
function SettlementDetail({ set, onModalOpen }: { set: Settlement; onModalOpen: (role: "MAKER" | "CHECKER", mode: "APPROVE" | "REJECT") => void }) {
  const relatedRepayment = repaymentRequests.find(r => r.companyId === set.companyId);

  return (
    <div className="space-y-3">
      {/* Settlement identity */}
      <div className="bg-[#f5f8fb] border border-[#d1d9e0] rounded-[3px] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-[#1e3a5f] flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#0ea5e9]" />
            Settlement {set.id}
          </h3>
          <SettlementStatusBadge status={set.status} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-[11px]">
            <Building2 className="w-3.5 h-3.5 text-[#90a4ae]" />
            <span className="text-[#90a4ae]">Company:</span>
            <span className="font-medium text-[#1e3a5f]">{set.companyName}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <User className="w-3.5 h-3.5 text-[#90a4ae]" />
            <span className="text-[#90a4ae]">Submitted By:</span>
            <span className="font-medium text-[#5a6b7c]">{set.submittedBy}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Landmark className="w-3.5 h-3.5 text-[#90a4ae]" />
            <span className="text-[#90a4ae]">Bank Reference:</span>
            <span className="font-mono font-bold text-[#1e3a5f]">{set.bankReference}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Repeat className="w-3.5 h-3.5 text-[#90a4ae]" />
            <span className="text-[#90a4ae]">Payment Method:</span>
            <span className="font-medium text-[#5a6b7c]">{set.paymentMethod}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#90a4ae]" />
            <span className="text-[#90a4ae]">Amount:</span>
            <span className="font-mono font-bold text-[#2e7d32]">{formatMMK(set.totalAmount)}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#90a4ae]" />
            <span className="text-[#90a4ae]">Submitted:</span>
            <span className="font-medium text-[#5a6b7c]">{set.submittedAt}</span>
          </div>
        </div>
      </div>

      {/* Maker-Checker identities */}
      <div className="grid grid-cols-2 gap-3">
        <IdentityCard role="Maker" name="Finance Officer A" verifiedAt={set.makerVerifiedAt} />
        <IdentityCard role="Checker" name="Finance Manager B" verifiedAt={set.checkerApprovedAt} />
      </div>

      {/* Bank reference verification */}
      <div className="bg-white border border-[#d1d9e0] rounded-[3px] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h3 className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5" /> Bank Reference Verification
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-[#f5f8fb] rounded-[2px] border border-[#e8ecf0]">
            <div>
              <p className="text-[11px] font-bold text-[#1e3a5f] font-mono">{set.bankReference}</p>
              <p className="text-[9px] text-[#90a4ae] mt-0.5">Transaction Reference Number</p>
            </div>
            <Badge variant="outline" className="bg-[#e3f2fd] text-[#0d47a1] border-[#90caf9] text-[9px]">Verified</Badge>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-[#f5f8fb] rounded-[2px] border border-[#e8ecf0]">
            <div>
              <p className="text-[11px] font-bold text-[#2e7d32] font-mono">{formatMMK(set.totalAmount)}</p>
              <p className="text-[9px] text-[#90a4ae] mt-0.5">Amount Match: {set.paymentMethod}</p>
            </div>
            <Badge variant="outline" className="bg-[#e8f5e9] text-[#1b5e20] border-[#a5d6a7] text-[9px]">Match Confirmed</Badge>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[#e65100] p-2 bg-[#fff8e1] rounded-[2px] border border-[#ffcc80]">
            <ShieldAlert className="w-3 h-3" />
            <span>Maker and Checker must be different users. Both must independently verify bank reference and screenshot.</span>
          </div>
        </div>
      </div>

      {/* Screenshot inspection */}
      <div className="bg-white border border-[#d1d9e0] rounded-[3px] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h3 className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" /> Screenshot Inspection
        </h3>
        {set.screenshot ? (
          <div className="space-y-2">
            <div className="p-2.5 bg-[#f5f8fb] rounded-[2px] border border-[#e8ecf0]">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-[#90a4ae]" />
                <span className="text-[11px] font-medium text-[#5a6b7c]">Bank transfer screenshot attached</span>
              </div>
              <p className="text-[9px] text-[#90a4ae] mt-1">Shows {formatMMK(set.totalAmount)} transferred via {set.paymentMethod} to {set.companyName}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#2e7d32]">
              <CheckCircle2 className="w-3 h-3" />
              <span>Maker confirmed screenshot matches bank reference</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] text-[#b71c1c] p-2.5 bg-[#fce4ec] rounded-[2px] border border-[#ef9a9a]">
            <XCircle className="w-3.5 h-3.5" />
            <span className="font-bold">Screenshot Missing — Cannot proceed with verification</span>
          </div>
        )}
      </div>

      {/* Related repayment items */}
      {relatedRepayment && (
        <div className="bg-white border border-[#d1d9e0] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h3 className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest p-3 pb-1.5 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" /> Related Repayment Items
          </h3>
          <ScrollArea className="max-h-[200px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f5f8fb] border-b-[#e8ecf0]">
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Employee</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold text-right">Principal</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold text-right">Late Fee</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold text-right">Total</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold text-right">Alloc %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedRepayment.items.map(item => (
                  <TableRow key={item.employeeId} className="border-b-[#e8ecf0]">
                    <TableCell className="text-[11px] font-medium text-[#1e3a5f]">{item.employeeName}</TableCell>
                    <TableCell className="text-[11px] text-right font-mono text-[#5a6b7c]">{formatMMK(item.principal)}</TableCell>
                    <TableCell className="text-[11px] text-right font-mono text-[#e65100]">{formatMMK(item.lateFee)}</TableCell>
                    <TableCell className="text-[11px] text-right font-mono font-bold text-[#1e3a5f]">{formatMMK(item.total)}</TableCell>
                    <TableCell className="text-[11px] text-right font-mono text-[#90a4ae]">{item.allocationPct}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-[#f5f8fb] border-t-2 border-[#d1d9e0]">
                  <TableCell className="text-[11px] font-bold text-[#1e3a5f]">Total</TableCell>
                  <TableCell className="text-[11px] text-right font-mono font-bold text-[#1e3a5f]">{formatMMK(relatedRepayment.principalAmount)}</TableCell>
                  <TableCell className="text-[11px] text-right font-mono font-bold text-[#e65100]">{formatMMK(relatedRepayment.lateFeeAmount)}</TableCell>
                  <TableCell className="text-[11px] text-right font-mono font-bold text-[#2e7d32]">{formatMMK(relatedRepayment.totalAmount)}</TableCell>
                  <TableCell className="text-[11px] text-right font-mono font-bold text-[#5a6b7c]">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        {set.status === "SUBMITTED" && (
          <>
            <Button className="h-8 text-[10px] font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white rounded-[3px]"
              onClick={() => onModalOpen("MAKER", "APPROVE")}>
              <CheckCircle2 className="w-3 h-3 mr-1" /> Verify as Maker
            </Button>
            <Button variant="outline" className="h-8 text-[10px] font-medium border-[#ef9a9a] text-[#b71c1c] hover:bg-[#fce4ec] rounded-[3px]"
              onClick={() => onModalOpen("MAKER", "REJECT")}>
              <XCircle className="w-3 h-3 mr-1" /> Reject
            </Button>
          </>
        )}
        {set.status === "MAKER_APPROVED" && (
          <>
            <Button className="h-8 text-[10px] font-semibold bg-[#2e7d32] hover:bg-[#1b5e20] text-white rounded-[3px]"
              onClick={() => onModalOpen("CHECKER", "APPROVE")}>
              <ShieldCheck className="w-3 h-3 mr-1" /> Approve as Checker
            </Button>
            <Button variant="outline" className="h-8 text-[10px] font-medium border-[#ef9a9a] text-[#b71c1c] hover:bg-[#fce4ec] rounded-[3px]"
              onClick={() => onModalOpen("CHECKER", "REJECT")}>
              <XCircle className="w-3 h-3 mr-1" /> Reject
            </Button>
          </>
        )}
        {set.status === "CHECKER_APPROVED" && (
          <div className="flex items-center gap-2 text-[#2e7d32]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Settlement Posted — Ledger Updated</span>
          </div>
        )}
        {set.status === "REJECTED" && (
          <div className="flex items-center gap-2 text-[#b71c1c]">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Settlement Rejected</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== MAIN PAGE ===== */
export function SettlementPage() {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [modalState, setModalState] = useState<{
    settlement: Settlement;
    role: "MAKER" | "CHECKER";
    mode: "APPROVE" | "REJECT";
  } | null>(null);

  const handleModalSubmit = () => setModalState(null);

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0ea5e9]" />
          <div>
            <h1 className="text-[15px] font-bold text-[#1e3a5f] uppercase tracking-wide">Settlement Verification</h1>
            <p className="text-[10px] text-[#90a4ae] uppercase tracking-wider">
              Maker-Checker Protocol · {settlements.length} settlements
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="bg-white border border-[#d1d9e0] rounded-[3px] h-9">
          <TabsTrigger value="queue" className="text-[10px] font-medium data-[state=active]:text-[#1e3a5f] data-[state=active]:bg-white rounded-[2px]">
            <FileText className="w-3 h-3 mr-1" /> Settlement Queue
          </TabsTrigger>
          <TabsTrigger value="detail" className="text-[10px] font-medium data-[state=active]:text-[#1e3a5f] data-[state=active]:bg-white rounded-[2px]">
            <Eye className="w-3 h-3 mr-1" /> Verification Detail
          </TabsTrigger>
          <TabsTrigger value="history" className="text-[10px] font-medium data-[state=active]:text-[#1e3a5f] data-[state=active]:bg-white rounded-[2px]">
            <Clock className="w-3 h-3 mr-1" /> Posted History
          </TabsTrigger>
        </TabsList>

        {/* QUEUE TAB */}
        <TabsContent value="queue" className="mt-3">
          {/* Workflow Legend */}
          <div className="bg-white border border-[#d1d9e0] rounded-[3px] p-2.5 mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-[10px] flex-wrap">
              <span className="px-2.5 py-1 rounded-[2px] bg-[#fff8e1] text-[#e65100] text-[9px] font-bold border border-[#ffcc80]">1. Submitted</span>
              <span className="text-[#e0e0e0]">→</span>
              <span className="px-2.5 py-1 rounded-[2px] bg-[#e3f2fd] text-[#0d47a1] text-[9px] font-bold border border-[#90caf9]">2. Maker Verified</span>
              <span className="text-[#e0e0e0]">→</span>
              <span className="px-2.5 py-1 rounded-[2px] bg-[#e8f5e9] text-[#1b5e20] text-[9px] font-bold border border-[#a5d6a7]">3. Checker Approved</span>
              <span className="text-[#e0e0e0]">→</span>
              <span className="px-2.5 py-1 rounded-[2px] bg-[#c8e6c9] text-[#1b5e20] text-[9px] font-bold border border-[#81c784]">4. Posted</span>
            </div>
          </div>

          {/* Settlement Table */}
          <div className="bg-white border border-[#d1d9e0] rounded-[3px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest p-3 pb-1.5">Settlement Queue</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f5f8fb] border-b-[#d1d9e0]">
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">ID</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Company</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Submitted By</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold text-right">Amount</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Method</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Bank Ref</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Screenshot</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Status</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Workflow</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Submitted</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map(set => (
                  <TableRow key={set.id} className="hover:bg-[#f5f8fb] border-b-[#e8ecf0] transition-colors">
                    <TableCell className="text-[10px] font-mono font-bold text-[#1e3a5f]">{set.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-[11px] font-semibold text-[#1e3a5f]">{set.companyName}</p>
                        <p className="text-[8px] text-[#90a4ae] font-mono">{set.companyId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] text-[#5a6b7c]">{set.submittedBy}</TableCell>
                    <TableCell className="text-[11px] text-right font-mono font-bold text-[#2e7d32]">{formatMMK(set.totalAmount)}</TableCell>
                    <TableCell className="text-[11px] text-[#5a6b7c]">{set.paymentMethod}</TableCell>
                    <TableCell className="text-[9px] font-mono text-[#90a4ae]">{set.bankReference}</TableCell>
                    <TableCell>
                      {set.screenshot ? (
                        <Badge variant="outline" className="text-[8px] bg-[#e8f5e9] text-[#1b5e20] border-[#a5d6a7]">
                          <Eye className="w-2.5 h-2.5 mr-0.5" /> Attached
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[8px] bg-[#fce4ec] text-[#b71c1c] border-[#ef9a9a]">Missing</Badge>
                      )}
                    </TableCell>
                    <TableCell><SettlementStatusBadge status={set.status} /></TableCell>
                    <TableCell className="py-2"><WorkflowStepper status={set.status} /></TableCell>
                    <TableCell className="text-[9px] text-[#90a4ae]">{set.submittedAt}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="h-7 text-[9px] font-medium text-[#1565c0] hover:bg-[#1565c0]/8 rounded-[2px]"
                        onClick={() => setSelectedSettlement(set)}>
                        <Eye className="w-3 h-3 mr-0.5" /> Verify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* DETAIL TAB */}
        <TabsContent value="detail" className="mt-3">
          {selectedSettlement ? (
            <SettlementDetail set={selectedSettlement} onModalOpen={(role, mode) => setModalState({ settlement: selectedSettlement, role, mode })} />
          ) : (
            <div className="text-center py-12">
              <Shield className="w-10 h-10 text-[#d1d9e0] mx-auto mb-3" />
              <p className="text-[11px] text-[#90a4ae]">Select a settlement from the queue to verify</p>
              <p className="text-[10px] text-[#bdbdbd] mt-1">Click "Verify" on any row in the Settlement Queue tab</p>
            </div>
          )}
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="mt-3">
          <div className="bg-white border border-[#d1d9e0] rounded-[3px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest p-3 pb-1.5">Posted Settlements</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f5f8fb] border-b-[#d1d9e0]">
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">ID</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Company</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold text-right">Amount</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Bank Ref</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Maker</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Checker</TableHead>
                  <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.filter(s => s.status === "CHECKER_APPROVED" || s.status === "MAKER_APPROVED").map(set => (
                  <TableRow key={set.id} className="border-b-[#e8ecf0]">
                    <TableCell className="text-[10px] font-mono font-bold text-[#2e7d32]">{set.id}</TableCell>
                    <TableCell className="text-[11px] font-medium text-[#1e3a5f]">{set.companyName}</TableCell>
                    <TableCell className="text-[11px] text-right font-mono font-bold text-[#2e7d32]">{formatMMK(set.totalAmount)}</TableCell>
                    <TableCell className="text-[9px] font-mono text-[#90a4ae]">{set.bankReference}</TableCell>
                    <TableCell className="text-[11px] text-[#5a6b7c]">{set.makerVerifiedAt ? "Finance Officer A" : "—"}</TableCell>
                    <TableCell className="text-[11px] text-[#5a6b7c]">{set.checkerApprovedAt ? "Finance Manager B" : "—"}</TableCell>
                    <TableCell className="text-[9px] text-[#90a4ae]">{set.checkerApprovedAt || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Maker-Checker Modal */}
      {modalState && (
        <MakerCheckerModal
          settlement={modalState.settlement}
          role={modalState.role}
          mode={modalState.mode}
          onSubmit={handleModalSubmit}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}
