/**
 * LimitationsPage — Transaction & Amount Limits
 * Per day, per week, per month, per cycle, per txn, per count per cycle
 * Design: Enterprise Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Shield, Plus, Eye, Settings, Hash, Calendar, Clock, TrendingUp, Repeat, Users, BarChart3 } from "lucide-react";

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "MMK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

type LimitScope = "COMPANY" | "GROUP" | "EMPLOYEE" | "GLOBAL";
type LimitPeriod = "PER_TXN" | "PER_DAY" | "PER_WEEK" | "PER_MONTH" | "PER_CYCLE" | "PER_COUNT_CYCLE";

interface LimitRule {
  id: string;
  name: string;
  code: string;
  scope: LimitScope;
  targetId: string;
  targetName: string;
  period: LimitPeriod;
  limitType: "AMOUNT" | "COUNT";
  value: number;
  currency: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  overridden: boolean;
}

const limitRules: LimitRule[] = [
  { id: "LIM-001", name: "Per Transaction Max", code: "TXN-MAX", scope: "GLOBAL", targetId: "ALL", targetName: "All Companies", period: "PER_TXN", limitType: "AMOUNT", value: 200000, currency: "MMK", status: "ACTIVE", overridden: false },
  { id: "LIM-002", name: "Per Transaction Min", code: "TXN-MIN", scope: "GLOBAL", targetId: "ALL", targetName: "All Companies", period: "PER_TXN", limitType: "AMOUNT", value: 5000, currency: "MMK", status: "ACTIVE", overridden: false },
  { id: "LIM-003", name: "Daily Disbursement Cap", code: "DAILY-CAP", scope: "COMPANY", targetId: "CMP-001", targetName: "Tech Solutions Ltd", period: "PER_DAY", limitType: "AMOUNT", value: 5000000, currency: "MMK", status: "ACTIVE", overridden: false },
  { id: "LIM-004", name: "Daily Transaction Count", code: "DAILY-COUNT", scope: "COMPANY", targetId: "CMP-001", targetName: "Tech Solutions Ltd", period: "PER_DAY", limitType: "COUNT", value: 50, currency: "TXN", status: "ACTIVE", overridden: false },
  { id: "LIM-005", name: "Weekly Disbursement Cap", code: "WEEKLY-CAP", scope: "COMPANY", targetId: "CMP-001", targetName: "Tech Solutions Ltd", period: "PER_WEEK", limitType: "AMOUNT", value: 25000000, currency: "MMK", status: "ACTIVE", overridden: false },
  { id: "LIM-006", name: "Monthly Budget Cap", code: "MONTHLY-CAP", scope: "COMPANY", targetId: "CMP-001", targetName: "Tech Solutions Ltd", period: "PER_MONTH", limitType: "AMOUNT", value: 100000000, currency: "MMK", status: "ACTIVE", overridden: false },
  { id: "LIM-007", name: "Per Cycle Max", code: "CYCLE-MAX", scope: "COMPANY", targetId: "CMP-001", targetName: "Tech Solutions Ltd", period: "PER_CYCLE", limitType: "AMOUNT", value: 120000000, currency: "MMK", status: "ACTIVE", overridden: false },
  { id: "LIM-008", name: "Per Employee Daily Cap", code: "EMP-DAILY-CAP", scope: "EMPLOYEE", targetId: "EMP-001", targetName: "Kyaw Kyaw (ENG)", period: "PER_DAY", limitType: "AMOUNT", value: 200000, currency: "MMK", status: "ACTIVE", overridden: true },
  { id: "LIM-009", name: "Per Employee Monthly Cap", code: "EMP-MONTH-CAP", scope: "EMPLOYEE", targetId: "EMP-001", targetName: "Kyaw Kyaw (ENG)", period: "PER_MONTH", limitType: "AMOUNT", value: 500000, currency: "MMK", status: "ACTIVE", overridden: true },
  { id: "LIM-010", name: "Count Per Cycle Limit", code: "CYCLE-COUNT", scope: "EMPLOYEE", targetId: "EMP-001", targetName: "Kyaw Kyaw (ENG)", period: "PER_COUNT_CYCLE", limitType: "COUNT", value: 15, currency: "TXN", status: "ACTIVE", overridden: false },
  { id: "LIM-011", name: "Group Daily Cap", code: "GRP-DAILY", scope: "GROUP", targetId: "EG-002", targetName: "Engineering Staff", period: "PER_DAY", limitType: "AMOUNT", value: 3000000, currency: "MMK", status: "ACTIVE", overridden: false },
  { id: "LIM-012", name: "Group Monthly Cap", code: "GRP-MONTH", scope: "GROUP", targetId: "EG-002", targetName: "Engineering Staff", period: "PER_MONTH", limitType: "AMOUNT", value: 12000000, currency: "MMK", status: "ACTIVE", overridden: false },
  { id: "LIM-013", name: "Per Employee Weekly Count", code: "EMP-WEEK-COUNT", scope: "EMPLOYEE", targetId: "ALL", targetName: "All Employees", period: "PER_WEEK", limitType: "COUNT", value: 5, currency: "TXN", status: "ACTIVE", overridden: false },
  { id: "LIM-014", name: "Weekly Transaction Count", code: "WEEKLY-COUNT", scope: "COMPANY", targetId: "CMP-001", targetName: "Tech Solutions Ltd", period: "PER_WEEK", limitType: "COUNT", value: 200, currency: "TXN", status: "ACTIVE", overridden: false },
  { id: "LIM-015", name: "Company Trial Limit", code: "TRIAL-LIMIT", scope: "COMPANY", targetId: "CMP-005", targetName: "Startup Inc", period: "PER_TXN", limitType: "AMOUNT", value: 50000, currency: "MMK", status: "DRAFT", overridden: false },
];

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export function LimitationsPage() {
  const [selectedRule, setSelectedRule] = useState<LimitRule | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-500" />
          Limitation Management
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Amount & count limits · Per TXN/Day/Week/Month/Cycle · Scope-based hierarchy (Global → Company → Group → Employee)</p>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="bg-slate-100/50">
          <TabsTrigger value="rules" className="text-[10px]">Limit Rules</TabsTrigger>
          <TabsTrigger value="detail" className="text-[10px]">Rule Detail</TabsTrigger>
          <TabsTrigger value="matrix" className="text-[10px]">Limit Matrix</TabsTrigger>
          <TabsTrigger value="utilization" className="text-[10px]">Utilization</TabsTrigger>
        </TabsList>

        {/* RULES TAB */}
        <TabsContent value="rules" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Limit Rule Registry</CardTitle>
                <Button size="sm" className="h-7 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Name</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Code</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Scope</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Target</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Period</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Type</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Value</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Override</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {limitRules.map(l => (
                    <TableRow key={l.id} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                      <TableCell className="text-[10px] font-mono font-bold text-[#1e3a5f]">{l.id}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-700">{l.name}</TableCell>
                      <TableCell className="text-[10px] font-mono font-semibold text-slate-500">{l.code}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[8px] font-bold uppercase ${
                          l.scope === "GLOBAL" ? "bg-purple-50 text-purple-600 border-purple-200" :
                          l.scope === "COMPANY" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          l.scope === "GROUP" ? "bg-amber-50 text-amber-600 border-amber-200" :
                          "bg-emerald-50 text-emerald-600 border-emerald-200"
                        }`}>{l.scope}</Badge>
                      </TableCell>
                      <TableCell className="text-[10px] text-slate-600">{l.targetName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[8px] font-bold ${
                          l.period === "PER_TXN" ? "bg-slate-50 text-slate-600 border-slate-200" :
                          l.period === "PER_DAY" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          l.period === "PER_WEEK" ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
                          l.period === "PER_MONTH" ? "bg-teal-50 text-teal-600 border-teal-200" :
                          l.period === "PER_CYCLE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          "bg-amber-50 text-amber-600 border-amber-200"
                        }`}>
                          {l.period.replace("PER_", "")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[8px] font-bold ${l.limitType === "AMOUNT" ? "bg-teal-50 text-teal-600 border-teal-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>{l.limitType}</Badge>
                      </TableCell>
                      <TableCell className={`text-xs font-mono font-bold text-right ${l.limitType === "AMOUNT" ? "text-amber-600" : "text-slate-700"}`}>
                        {l.limitType === "AMOUNT" ? formatMMK(l.value) : l.value}
                      </TableCell>
                      <TableCell className="text-center">
                        {l.overridden ? (
                          <Badge variant="outline" className="text-[8px] bg-amber-50 text-amber-600 border-amber-200">YES</Badge>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[9px] font-bold uppercase ${l.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : l.status === "DRAFT" ? "bg-slate-50 text-slate-400 border-slate-200" : "bg-red-50 text-red-600 border-red-200"}`}>{l.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] font-medium text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                          onClick={() => setSelectedRule(l)}>
                            <Eye className="w-3 h-3 mr-1" /> Detail
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RULE DETAIL TAB */}
        <TabsContent value="detail" className="mt-4">
          {selectedRule ? (
            <div className="space-y-4">
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-500" />
                    {selectedRule.code} — {selectedRule.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[9px] font-bold uppercase ${
                      selectedRule.scope === "GLOBAL" ? "bg-purple-50 text-purple-600 border-purple-200" :
                      selectedRule.scope === "COMPANY" ? "bg-blue-50 text-blue-600 border-blue-200" :
                      selectedRule.scope === "GROUP" ? "bg-amber-50 text-amber-600 border-amber-200" :
                      "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}>{selectedRule.scope}</Badge>
                    <Badge variant="outline" className={`text-[9px] font-bold uppercase ${selectedRule.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>{selectedRule.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Period</p>
                    <p className="text-sm font-bold text-slate-700">{selectedRule.period.replace("PER_", "")}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Limit Type</p>
                    <p className="text-sm font-bold text-slate-700">{selectedRule.limitType}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Limit Value</p>
                    <p className={`text-lg font-mono font-bold ${selectedRule.limitType === "AMOUNT" ? "text-amber-600" : "text-slate-700"}`}>
                      {selectedRule.limitType === "AMOUNT" ? formatMMK(selectedRule.value) : selectedRule.value}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Target</p>
                    <p className="text-sm font-medium text-slate-700">{selectedRule.targetName}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-sm border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Limit Hierarchy Chain</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[8px] bg-purple-50 text-purple-600 border-purple-200">Global</Badge>
                    <ArrowDownIcon />
                    <Badge variant="outline" className="text-[8px] bg-blue-50 text-blue-600 border-blue-200">Company</Badge>
                    <ArrowDownIcon />
                    <Badge variant="outline" className="text-[8px] bg-amber-50 text-amber-600 border-amber-200">Group</Badge>
                    <ArrowDownIcon />
                    <Badge variant="outline" className="text-[8px] bg-emerald-50 text-emerald-600 border-emerald-200">Employee</Badge>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-2">Lower scope limits override higher scope limits. Employee-level overrides take precedence over Group → Company → Global.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Shield className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Select a limit rule to view hierarchy details</p>
            </div>
          )}
        </TabsContent>

        {/* LIMIT MATRIX TAB */}
        <TabsContent value="matrix" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Limit Matrix — All Periods × Scopes</CardTitle>
                <Button size="sm" className="h-7 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Scope</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Per TXN</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Per Day</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Per Week</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Per Month</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Per Cycle</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Per Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b-slate-100">
                    <TableCell className="text-[10px] font-bold text-purple-600">GLOBAL</TableCell>
                    <TableCell className="text-center text-[10px] font-mono">5K–200K</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-[10px] font-mono">No count limit</TableCell>
                  </TableRow>
                  <TableRow className="border-b-slate-100">
                    <TableCell className="text-[10px] font-bold text-blue-600">COMPANY</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">5M MMK / 50 txn</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">25M MMK / 200 txn</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">100M MMK</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">120M MMK</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                  </TableRow>
                  <TableRow className="border-b-slate-100">
                    <TableCell className="text-[10px] font-bold text-amber-600">GROUP</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">3M MMK</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">12M MMK</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                  </TableRow>
                  <TableRow className="border-b-slate-100">
                    <TableCell className="text-[10px] font-bold text-emerald-600">EMPLOYEE</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">Max 200K</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">200K MMK</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">500K MMK</TableCell>
                    <TableCell className="text-center text-slate-300">—</TableCell>
                    <TableCell className="text-center text-[10px] font-mono text-amber-600">15 txn/cycle</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UTILIZATION TAB */}
        <TabsContent value="utilization" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Limit Utilization Monitor</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Scope</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Target</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Period</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Used</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Limit</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">%</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { scope: "COMPANY", target: "Tech Solutions Ltd", period: "Per Day", used: 3200000, limit: 5000000 },
                    { scope: "COMPANY", target: "Tech Solutions Ltd", period: "Per Week", used: 18000000, limit: 25000000 },
                    { scope: "COMPANY", target: "Tech Solutions Ltd", period: "Per Month", used: 65000000, limit: 100000000 },
                    { scope: "GROUP", target: "Engineering Staff", period: "Per Day", used: 2100000, limit: 3000000 },
                    { scope: "GROUP", target: "Engineering Staff", period: "Per Month", used: 8500000, limit: 12000000 },
                    { scope: "EMPLOYEE", target: "Kyaw Kyaw", period: "Per Day", used: 150000, limit: 200000 },
                    { scope: "EMPLOYEE", target: "Kyaw Kyaw", period: "Per Month", used: 320000, limit: 500000 },
                    { scope: "EMPLOYEE", target: "Kyaw Kyaw", period: "Per Count/Cycle", used: 8, limit: 15 },
                  ].map((u, i) => {
                    const pct = Math.round((u.used / u.limit) * 100);
                    return (
                      <TableRow key={i} className="border-b-slate-100">
                        <TableCell>
                          <Badge variant="outline" className={`text-[8px] font-bold uppercase ${
                            u.scope === "COMPANY" ? "bg-blue-50 text-blue-600 border-blue-200" :
                            u.scope === "GROUP" ? "bg-amber-50 text-amber-600 border-amber-200" :
                            "bg-emerald-50 text-emerald-600 border-emerald-200"
                          }`}>{u.scope}</Badge>
                        </TableCell>
                        <TableCell className="text-[10px] text-slate-600">{u.target}</TableCell>
                        <TableCell className="text-[10px] text-slate-500">{u.period}</TableCell>
                        <TableCell className="text-[10px] font-mono text-right text-slate-600">{formatMMK(u.used)}</TableCell>
                        <TableCell className="text-[10px] font-mono text-right text-slate-500">{formatMMK(u.limit)}</TableCell>
                        <TableCell className="text-center">
                          <span className={`text-xs font-mono font-bold ${pct > 80 ? "text-red-600" : pct > 50 ? "text-amber-600" : "text-emerald-600"}`}>{pct}%</span>
                          <div className="w-12 bg-slate-100 rounded-full h-1 mx-auto mt-0.5">
                            <div className={`h-1 rounded-full ${pct > 80 ? "bg-red-400" : pct > 50 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${pct}%` }} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[8px] font-bold ${pct > 80 ? "bg-red-50 text-red-600 border-red-200" : pct > 50 ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
                            {pct > 80 ? "WARNING" : pct > 50 ? "OK" : "HEALTHY"}
                          </Badge>
                        </TableCell>
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

function ArrowDownIcon() {
  return (
    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}
