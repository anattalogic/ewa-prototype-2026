/**
 * BankIntegrationPage — Pay Channel Integration, Prefund Accounts, Bank Service Fees
 * Design: Enterprise Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Landmark, Building2, CreditCard, Smartphone, Banknote, ArrowRightLeft, ShieldCheck, AlertTriangle, Plus, Eye } from "lucide-react";

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "MMK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

interface PayChannel {
  id: string;
  bankName: string;
  channelType: "BANK_TRANSFER" | "MOBILE_WALLET" | "INSTANT_PAYMENT";
  accountNumber: string;
  prefundBalance: number;
  minPrefund: number;
  serviceFee: number;
  serviceFeeType: "FLAT" | "PERCENT";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  ledgerAccount: string;
  lastSync: string;
}

const payChannels: PayChannel[] = [
  { id: "CH-001", bankName: "KBZ Bank", channelType: "BANK_TRANSFER", accountNumber: "001-234567-890", prefundBalance: 15000000, minPrefund: 5000000, serviceFee: 1500, serviceFeeType: "FLAT", status: "ACTIVE", ledgerAccount: "COA-2100-KBZ", lastSync: "2026-07-10 14:30" },
  { id: "CH-002", bankName: "AYA Bank", channelType: "BANK_TRANSFER", accountNumber: "002-345678-901", prefundBalance: 10000000, minPrefund: 5000000, serviceFee: 1500, serviceFeeType: "FLAT", status: "ACTIVE", ledgerAccount: "COA-2100-AYA", lastSync: "2026-07-10 14:28" },
  { id: "CH-003", bankName: "CB Bank", channelType: "BANK_TRANSFER", accountNumber: "003-456789-012", prefundBalance: 3000000, minPrefund: 5000000, serviceFee: 1500, serviceFeeType: "FLAT", status: "ACTIVE", ledgerAccount: "COA-2100-CB", lastSync: "2026-07-10 14:15" },
  { id: "CH-004", bankName: "Wave Money", channelType: "MOBILE_WALLET", accountNumber: "WM-077-1234567", prefundBalance: 8000000, minPrefund: 2000000, serviceFee: 500, serviceFeeType: "FLAT", status: "ACTIVE", ledgerAccount: "COA-2100-WM", lastSync: "2026-07-10 14:32" },
  { id: "CH-005", bankName: "KBZ Pay", channelType: "MOBILE_WALLET", accountNumber: "KP-077-2345678", prefundBalance: 12000000, minPrefund: 2000000, serviceFee: 0.5, serviceFeeType: "PERCENT", status: "ACTIVE", ledgerAccount: "COA-2100-KP", lastSync: "2026-07-10 14:31" },
  { id: "CH-006", bankName: "Myanmar Post Bank", channelType: "INSTANT_PAYMENT", accountNumber: "MPB-567890-123", prefundBalance: 7000000, minPrefund: 3000000, serviceFee: 1000, serviceFeeType: "FLAT", status: "PENDING", ledgerAccount: "COA-2100-MPB", lastSync: "2026-07-09 16:00" },
];

interface LedgerFlow {
  id: string;
  date: string;
  channelId: string;
  channelName: string;
  type: "PREFUND_DEPOSIT" | "DISBURSEMENT_DEBIT" | "SERVICE_FEE" | "RECONCILIATION" | "REFUND";
  amount: number;
  journalRef: string;
  balance: number;
  description: string;
}

const ledgerFlows: LedgerFlow[] = [
  { id: "LF-001", date: "2026-07-10 09:00", channelId: "CH-001", channelName: "KBZ Bank", type: "PREFUND_DEPOSIT", amount: 5000000, journalRef: "JE-2026-0950", balance: 15000000, description: "Prefund top-up from bank transfer" },
  { id: "LF-002", date: "2026-07-10 09:18", channelId: "CH-001", channelName: "KBZ Bank", type: "DISBURSEMENT_DEBIT", amount: -50000, journalRef: "JE-2026-1001", balance: 14950000, description: "Disbursement to EMP-001 Aung Kyaw" },
  { id: "LF-003", date: "2026-07-10 09:18", channelId: "CH-001", channelName: "KBZ Bank", type: "SERVICE_FEE", amount: -1500, journalRef: "JE-2026-1001-FEE", balance: 14948500, description: "Bank service fee for transaction DISB-001" },
  { id: "LF-004", date: "2026-07-10 10:31", channelId: "CH-004", channelName: "Wave Money", type: "DISBURSEMENT_DEBIT", amount: -75000, journalRef: "JE-2026-1002", balance: 7925000, description: "Disbursement to EMP-003 Thet Hnin" },
  { id: "LF-005", date: "2026-07-10 10:31", channelId: "CH-004", channelName: "Wave Money", type: "SERVICE_FEE", amount: -500, journalRef: "JE-2026-1002-FEE", balance: 7924500, description: "Bank service fee for transaction DISB-002" },
  { id: "LF-006", date: "2026-07-10 11:00", channelId: "CH-001", channelName: "KBZ Bank", type: "DISBURSEMENT_DEBIT", amount: -60000, journalRef: "JE-2026-1006", balance: 14888500, description: "Disbursement to EMP-002 Nyein Chan" },
];

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export function BankIntegrationPage() {
  const [selectedChannel, setSelectedChannel] = useState<PayChannel | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
          <Landmark className="w-5 h-5 text-teal-500" />
          Bank Integration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Pay Channel management · Prefund accounts · Bank service fees · Ledger flow integration</p>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="bg-slate-100/50">
          <TabsTrigger value="channels" className="text-[10px]">Pay Channels</TabsTrigger>
          <TabsTrigger value="detail" className="text-[10px]">Channel Detail</TabsTrigger>
          <TabsTrigger value="ledger" className="text-[10px]">Ledger Flow</TabsTrigger>
          <TabsTrigger value="reconciliation" className="text-[10px]">Reconciliation</TabsTrigger>
        </TabsList>

        {/* PAY CHANNELS TAB */}
        <TabsContent value="channels" className="mt-3">
          <div className="bg-white border border-[#d1d9e0] rounded-[3px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between p-3 pb-2">
              <h3 className="text-[9px] font-bold text-[#5a6b7c] uppercase tracking-widest">Pay Channel Registry</h3>
              <Button size="sm" className="h-7 text-[10px] font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white rounded-[3px]">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Channel
              </Button>
            </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f5f8fb] border-b-[#d1d9e0]">
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Channel</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Bank</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Type</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Account</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Prefund Balance</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Min Prefund</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Service Fee</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Ledger</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Status</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Last Sync</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payChannels.map(ch => {
                    const lowBalance = ch.prefundBalance < ch.minPrefund;
                    return (
                      <TableRow key={ch.id} className="hover:bg-[#f5f8fb] border-b-[#e8ecf0] transition-colors">
                        <TableCell className="text-[11px] font-mono font-bold text-[#1e3a5f]">{ch.id}</TableCell>
                        <TableCell className="text-xs font-medium text-slate-700">{ch.bankName}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-[10px]">
                            {ch.channelType === "BANK_TRANSFER" && <Building2 className="w-3 h-3 text-blue-500" />}
                            {ch.channelType === "MOBILE_WALLET" && <Smartphone className="w-3 h-3 text-purple-500" />}
                            {ch.channelType === "INSTANT_PAYMENT" && <Banknote className="w-3 h-3 text-emerald-500" />}
                            {ch.channelType.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell className="text-[10px] font-mono text-slate-500">{ch.accountNumber}</TableCell>
                        <TableCell className={`text-xs font-mono font-bold ${lowBalance ? "text-red-600" : "text-emerald-600"}`}>
                          {formatMMK(ch.prefundBalance)}
                          {lowBalance && <AlertTriangle className="w-3 h-3 inline ml-1 text-red-500" />}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-slate-500">{formatMMK(ch.minPrefund)}</TableCell>
                        <TableCell className="text-xs font-mono text-amber-600">
                          {ch.serviceFeeType === "PERCENT" ? ch.serviceFee + "%" : formatMMK(ch.serviceFee)}
                        </TableCell>
                        <TableCell className="text-[10px] font-mono text-[#90a4ae]">{ch.ledgerAccount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[9px] font-bold uppercase ${
                            ch.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                            ch.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-200" :
                            "bg-red-50 text-red-600 border-red-200"
                          }`}>{ch.status}</Badge>
                        </TableCell>
                        <TableCell className="text-[10px] text-slate-500">{ch.lastSync}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-7 text-[10px] font-medium text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                            onClick={() => setSelectedChannel(ch)}>
                            <Eye className="w-3 h-3 mr-1" /> Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
          </div>
        </TabsContent>

        {/* CHANNEL DETAIL TAB */}
        <TabsContent value="detail" className="mt-4">
          {selectedChannel ? (
            <div className="space-y-4">
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-teal-500" />
                    {selectedChannel.id} — {selectedChannel.bankName}
                  </h3>
                  <Badge variant="outline" className={`text-[9px] font-bold uppercase ${
                    selectedChannel.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    "bg-amber-50 text-amber-600 border-amber-200"
                  }`}>{selectedChannel.status}</Badge>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Channel Type</p>
                    <p className="text-xs font-medium text-slate-700 mt-1">{selectedChannel.channelType.replace("_", " ")}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Account Number</p>
                    <p className="text-xs font-mono text-slate-700 mt-1">{selectedChannel.accountNumber}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Ledger Account</p>
                    <p className="text-xs font-mono text-slate-600 mt-1">{selectedChannel.ledgerAccount}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Service Fee</p>
                    <p className="text-xs font-mono text-amber-600 mt-1">
                      {selectedChannel.serviceFeeType === "PERCENT" ? selectedChannel.serviceFee + "%" : formatMMK(selectedChannel.serviceFee)}
                    </p>
                  </div>
                </div>

                {/* Prefund Balance Card */}
                <div className="p-4 bg-white rounded-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prefund Balance</p>
                    <Badge variant="outline" className={selectedChannel.prefundBalance < selectedChannel.minPrefund ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}>
                      {selectedChannel.prefundBalance < selectedChannel.minPrefund ? "BELOW MINIMUM" : "HEALTHY"}
                    </Badge>
                  </div>
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-2xl font-bold font-mono text-[#1e3a5f]">{formatMMK(selectedChannel.prefundBalance)}</p>
                      <p className="text-[9px] text-slate-400">Current Balance</p>
                    </div>
                    <div>
                      <p className="text-sm font-mono text-slate-500">{formatMMK(selectedChannel.minPrefund)}</p>
                      <p className="text-[9px] text-slate-400">Minimum Required</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>Utilization</span>
                      <span className="font-mono">{Math.round(((selectedChannel.minPrefund - Math.max(0, selectedChannel.prefundBalance - selectedChannel.minPrefund)) / selectedChannel.minPrefund) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-teal-500" style={{ width: `${Math.min(100, (selectedChannel.prefundBalance / (selectedChannel.minPrefund * 3)) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Banknote className="w-3 h-3 mr-1" /> Top-Up Prefund
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-slate-200 text-slate-600">
                      <ArrowRightLeft className="w-3 h-3 mr-1" /> Transfer Between Channels
                    </Button>
                  </div>
                </div>

                {/* Ledger Flow for this channel */}
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ledger Flow — Recent Activity</p>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Date</TableHead>
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Type</TableHead>
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold text-right">Amount</TableHead>
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold text-right">Balance</TableHead>
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Journal</TableHead>
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerFlows.filter(f => f.channelId === selectedChannel.id).map(f => (
                        <TableRow key={f.id} className="border-b-slate-100">
                          <TableCell className="text-[10px] text-slate-500">{f.date}</TableCell>
                          <TableCell><Badge variant="outline" className={`text-[8px] font-bold ${
                            f.type === "PREFUND_DEPOSIT" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                            f.type === "DISBURSEMENT_DEBIT" ? "bg-blue-50 text-blue-600 border-blue-200" :
                            f.type === "SERVICE_FEE" ? "bg-amber-50 text-amber-600 border-amber-200" :
                            f.type === "RECONCILIATION" ? "bg-purple-50 text-purple-600 border-purple-200" :
                            "bg-red-50 text-red-600 border-red-200"
                          }`}>{f.type.replace("_", " ")}</Badge></TableCell>
                          <TableCell className={`text-[10px] font-mono font-bold ${f.amount >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                            {f.amount >= 0 ? "+" : ""}{formatMMK(f.amount)}
                          </TableCell>
                          <TableCell className="text-[10px] font-mono text-slate-700">{formatMMK(f.balance)}</TableCell>
                          <TableCell className="text-[10px] font-mono text-slate-400">{f.journalRef}</TableCell>
                          <TableCell className="text-[10px] text-slate-500">{f.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Landmark className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Select a pay channel to view details and ledger flow</p>
            </div>
          )}
        </TabsContent>

        {/* LEDGER FLOW TAB */}
        <TabsContent value="ledger" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Bank Ledger Flow — All Channels</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">ID</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Date</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Channel</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Type</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Balance</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Journal</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerFlows.map(f => (
                    <TableRow key={f.id} className="border-b-slate-100">
                      <TableCell className="text-[10px] font-mono font-bold text-[#1e3a5f]">{f.id}</TableCell>
                      <TableCell className="text-[10px] text-slate-500">{f.date}</TableCell>
                      <TableCell className="text-xs text-slate-700">{f.channelName}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[8px] font-bold ${
                        f.type === "PREFUND_DEPOSIT" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        f.type === "DISBURSEMENT_DEBIT" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        f.type === "SERVICE_FEE" ? "bg-amber-50 text-amber-600 border-amber-200" :
                        f.type === "RECONCILIATION" ? "bg-purple-50 text-purple-600 border-purple-200" :
                        "bg-red-50 text-red-600 border-red-200"
                      }`}>{f.type.replace("_", " ")}</Badge></TableCell>
                      <TableCell className={`text-[10px] font-mono font-bold ${f.amount >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {f.amount >= 0 ? "+" : ""}{formatMMK(f.amount)}
                      </TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-700">{formatMMK(f.balance)}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-400">{f.journalRef}</TableCell>
                      <TableCell className="text-[10px] text-slate-500">{f.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RECONCILIATION TAB */}
        <TabsContent value="reconciliation" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Bank Reconciliation</CardTitle>
                <Button size="sm" className="h-7 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Run Reconciliation
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Channel</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">System Balance</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Bank Statement</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Difference</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Status</TableHead>
                    <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Last Reconciled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payChannels.map(ch => {
                    const diff = ch.prefundBalance * 0.98;
                    const variance = ch.prefundBalance - diff;
                    return (
                      <TableRow key={ch.id} className="border-b-slate-100">
                        <TableCell className="text-xs font-medium text-slate-700">{ch.bankName} ({ch.id})</TableCell>
                        <TableCell className="text-xs font-mono text-slate-700">{formatMMK(ch.prefundBalance)}</TableCell>
                        <TableCell className="text-xs font-mono text-slate-500">{formatMMK(diff)}</TableCell>
                        <TableCell className={`text-xs font-mono font-bold ${variance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                          {variance > 0 ? "+" : ""}{formatMMK(variance)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[9px] font-bold uppercase ${
                            Math.abs(variance) < 10000 ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                            "bg-amber-50 text-amber-600 border-amber-200"
                          }`}>{Math.abs(variance) < 10000 ? "MATCHED" : "VARIANCE"}</Badge>
                        </TableCell>
                        <TableCell className="text-[10px] text-slate-500">{ch.lastSync}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
