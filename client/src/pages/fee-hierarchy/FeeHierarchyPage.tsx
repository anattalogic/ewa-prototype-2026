/**
 * FeeHierarchyPage — Fee Hierarchy Engine
 * Each tier: 2 types (percent / flat), attribute rules, logical conditions
 * Attributes: Late Day, Employee Tenure, Count per Circle, Day, Amount
 * Priority-based condition rule matching
 * Design: Enterprise Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pyramid, Plus, Eye, Settings, Hash, Percent, Calendar, Clock, Users, TrendingUp, ArrowUpDown } from "lucide-react";

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "MMK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

type FeeType = "PERCENT" | "FLAT";
type LogicalOp = "AND" | "OR" | "NOT";
type ConditionAttribute = "LATE_DAY" | "EMPLOYEE_TENURE" | "COUNT_PER_CIRCLE" | "DAY" | "AMOUNT" | "TENURE_MONTHS";
type ConditionOperator = "GT" | "GTE" | "LT" | "LTE" | "EQ" | "BETWEEN";

interface FeeCondition {
  id: string;
  attribute: ConditionAttribute;
  operator: ConditionOperator;
  value: string;
  logicalOp: LogicalOp;
}

interface FeeTier {
  id: string;
  name: string;
  tierLevel: number;
  feeType: FeeType;
  value: number;
  priority: number;
  conditions: FeeCondition[];
  applicableTo: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
}

const feeTiers: FeeTier[] = [
  { id: "FT-001", name: "Standard Disbursement Fee", tierLevel: 1, feeType: "PERCENT", value: 1.5, priority: 1, conditions: [
    { id: "FC-001", attribute: "AMOUNT", operator: "GTE", value: "0", logicalOp: "AND" },
    { id: "FC-002", attribute: "AMOUNT", operator: "LT", value: "50000", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-002", name: "Mid-Tier Disbursement Fee", tierLevel: 2, feeType: "PERCENT", value: 1.0, priority: 2, conditions: [
    { id: "FC-003", attribute: "AMOUNT", operator: "GTE", value: "50000", logicalOp: "AND" },
    { id: "FC-004", attribute: "AMOUNT", operator: "LT", value: "100000", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-003", name: "High-Tier Disbursement Fee", tierLevel: 3, feeType: "PERCENT", value: 0.75, priority: 3, conditions: [
    { id: "FC-005", attribute: "AMOUNT", operator: "GTE", value: "100000", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-004", name: "Late Repayment Penalty", tierLevel: 1, feeType: "PERCENT", value: 5.0, priority: 10, conditions: [
    { id: "FC-006", attribute: "LATE_DAY", operator: "GT", value: "0", logicalOp: "AND" },
    { id: "FC-007", attribute: "LATE_DAY", operator: "LT", value: "7", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-005", name: "Extended Late Penalty", tierLevel: 2, feeType: "PERCENT", value: 10.0, priority: 20, conditions: [
    { id: "FC-008", attribute: "LATE_DAY", operator: "GTE", value: "7", logicalOp: "AND" },
  ], applicableTo: "Employee", status: "ACTIVE" },
  { id: "FT-006", name: "Flat Service Fee — All Tiers", tierLevel: 0, feeType: "FLAT", value: 1500, priority: 0, conditions: [
    { id: "FC-009", attribute: "DAY", operator: "BETWEEN", value: "1,7", logicalOp: "AND" },
  ], applicableTo: "All", status: "ACTIVE" },
  { id: "FT-007", name: "New Employee Discount", tierLevel: 0, feeType: "PERCENT", value: -50, priority: 50, conditions: [
    { id: "FC-010", attribute: "EMPLOYEE_TENURE", operator: "LT", value: "3", logicalOp: "AND" },
    { id: "FC-011", attribute: "TENURE_MONTHS", operator: "LT", value: "6", logicalOp: "AND" },
  ], applicableTo: "New Employee (< 6 months)", status: "ACTIVE" },
  { id: "FT-008", name: "Loyal Employee Reduction", tierLevel: 0, feeType: "PERCENT", value: -25, priority: 40, conditions: [
    { id: "FC-012", attribute: "COUNT_PER_CIRCLE", operator: "GTE", value: "10", logicalOp: "AND" },
    { id: "FC-013", attribute: "TENURE_MONTHS", operator: "GTE", value: "12", logicalOp: "AND" },
  ], applicableTo: "Loyal Employee (12+ months, 10+ txns)", status: "ACTIVE" },
];

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export function FeeHierarchyPage() {
  const [selectedTier, setSelectedTier] = useState<FeeTier | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
          <Pyramid className="w-5 h-5 text-teal-500" />
          Fee Hierarchy Engine
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Tiered fee structure (Percent / Flat) · Attribute-based conditions · Priority rule matching · Logical operators</p>
      </div>

      <Tabs defaultValue="tiers" className="w-full">
        <TabsList className="bg-slate-100/50">
          <TabsTrigger value="tiers" className="text-[10px]">Fee Tiers</TabsTrigger>
          <TabsTrigger value="detail" className="text-[10px]">Tier Detail</TabsTrigger>
          <TabsTrigger value="conditions" className="text-[10px]">Condition Rules</TabsTrigger>
          <TabsTrigger value="simulator" className="text-[10px]">Fee Simulator</TabsTrigger>
        </TabsList>

        {/* TIERS TAB */}
        <TabsContent value="tiers" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Fee Tier Registry</CardTitle>
                <Button size="sm" className="h-7 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Tier
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Name</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Level</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Type</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Value</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Priority</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Conditions</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Applicable</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeTiers.map(ft => (
                    <TableRow key={ft.id} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                      <TableCell className="text-[10px] font-mono font-bold text-[#1e3a5f]">{ft.id}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-700">{ft.name}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="text-[8px] bg-slate-50 text-slate-600 border-slate-200">L{ft.tierLevel}</Badge></TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-[8px] font-bold ${ft.feeType === "PERCENT" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>{ft.feeType}</Badge>
                      </TableCell>
                      <TableCell className={`text-xs font-mono font-bold text-right ${ft.value < 0 ? "text-emerald-600" : "text-amber-600"}`}>
                        {ft.feeType === "PERCENT" ? (ft.value < 0 ? ft.value + "%" : "+" + ft.value + "%") : (ft.value < 0 ? formatMMK(ft.value) : formatMMK(ft.value))}
                      </TableCell>
                      <TableCell className="text-center text-[10px] font-mono text-slate-500">{ft.priority}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{ft.conditions.length} rules</TableCell>
                      <TableCell className="text-[10px] text-slate-600">{ft.applicableTo}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[9px] font-bold uppercase ${ft.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>{ft.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] font-medium text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                          onClick={() => setSelectedTier(ft)}>
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

        {/* DETAIL TAB */}
        <TabsContent value="detail" className="mt-4">
          {selectedTier ? (
            <div className="space-y-4">
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-2">
                    <Pyramid className="w-4 h-4 text-teal-500" />
                    {selectedTier.id} — {selectedTier.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[9px] font-bold uppercase ${selectedTier.feeType === "PERCENT" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>{selectedTier.feeType}</Badge>
                    <Badge variant="outline" className={`text-[9px] font-bold uppercase ${selectedTier.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>{selectedTier.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Tier Level</p>
                    <p className="text-lg font-bold text-[#1e3a5f]">Level {selectedTier.tierLevel}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Fee Value</p>
                    <p className={`text-lg font-bold font-mono ${selectedTier.feeType === "PERCENT" ? "text-blue-600" : "text-emerald-600"}`}>
                      {selectedTier.feeType === "PERCENT" ? selectedTier.value + "%" : formatMMK(selectedTier.value)}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Priority</p>
                    <p className="text-lg font-mono text-slate-700">{selectedTier.priority}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Applicable To</p>
                    <p className="text-sm font-medium text-slate-700">{selectedTier.applicableTo}</p>
                  </div>
                </div>

                {/* Condition Rules */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Condition Rules (Priority-based matching)</p>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold">ID</TableHead>
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Attribute</TableHead>
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Operator</TableHead>
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Value</TableHead>
                        <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Logical Op</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTier.conditions.map((c, i) => (
                        <TableRow key={c.id} className="border-b-slate-100">
                          <TableCell className="text-[10px] font-mono text-slate-500">{c.id}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-700">
                              {c.attribute === "LATE_DAY" && <Clock className="w-3 h-3 text-amber-500" />}
                              {c.attribute === "EMPLOYEE_TENURE" && <Calendar className="w-3 h-3 text-blue-500" />}
                              {c.attribute === "COUNT_PER_CIRCLE" && <Users className="w-3 h-3 text-emerald-500" />}
                              {c.attribute === "DAY" && <Calendar className="w-3 h-3 text-purple-500" />}
                              {c.attribute === "AMOUNT" && <TrendingUp className="w-3 h-3 text-teal-500" />}
                              {c.attribute === "TENURE_MONTHS" && <Calendar className="w-3 h-3 text-indigo-500" />}
                              {c.attribute.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-[8px] font-bold bg-slate-50 text-slate-600 border-slate-200">{c.operator}</Badge></TableCell>
                          <TableCell className="text-[10px] font-mono text-slate-700">{c.value}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[8px] font-bold ${c.logicalOp === "AND" ? "bg-blue-50 text-blue-600 border-blue-200" : c.logicalOp === "OR" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-600 border-red-200"}`}>{c.logicalOp}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {selectedTier.conditions.length > 1 && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-sm border border-slate-100">
                      <p className="text-[10px] text-slate-500">
                        <span className="font-bold">Logical chain:</span>{" "}
                        {selectedTier.conditions.map((c, i) => (
                          <span key={c.id}>
                            {i > 0 && <span className="font-bold text-blue-600 mx-1"> {c.logicalOp} </span>}
                            {c.attribute} {c.operator} {c.value}
                          </span>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Pyramid className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Select a fee tier to view conditions and logical rules</p>
            </div>
          )}
        </TabsContent>

        {/* CONDITIONS TAB */}
        <TabsContent value="conditions" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Condition Rule Engine — All Attributes</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Condition ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Attribute</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Operator</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Value</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Logical Op</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Parent Tier</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fee Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeTiers.flatMap(ft => ft.conditions.map(c => ({ ...c, tierId: ft.id, tierName: ft.name }))).map(c => (
                    <TableRow key={c.id} className="border-b-slate-100">
                      <TableCell className="text-[10px] font-mono text-slate-500">{c.id}</TableCell>
                      <TableCell className="text-[10px] font-medium text-slate-700">{c.attribute.replace("_", " ")}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[8px] font-bold bg-slate-50 text-slate-600 border-slate-200">{c.operator}</Badge></TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-700">{c.value}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[8px] font-bold ${c.logicalOp === "AND" ? "bg-blue-50 text-blue-600 border-blue-200" : c.logicalOp === "OR" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-600 border-red-200"}`}>{c.logicalOp}</Badge>
                      </TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{c.tierId}</TableCell>
                      <TableCell className="text-xs text-slate-600">{c.tierName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SIMULATOR TAB */}
        <TabsContent value="simulator" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Fee Calculation Simulator</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulate Scenario</p>
                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-100">
                    <p className="text-xs font-medium text-slate-700 mb-1">Scenario: Employee requests 75,000 MMK disbursement</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Amount</span>
                        <span className="font-mono font-bold text-slate-700">75,000 MMK</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Matches Tier</span>
                        <span className="font-mono text-blue-600">FT-002 (Mid-Tier)</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Fee Type</span>
                        <span className="font-mono">PERCENT</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Fee Rate</span>
                        <span className="font-mono font-bold text-amber-600">1.0%</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Flat Service Fee</span>
                        <span className="font-mono">1,500 MMK</span>
                      </div>
                      <div className="border-t border-slate-200 pt-1 mt-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-700">Total Fee</span>
                          <span className="font-mono text-[#1e3a5f]">{formatMMK(750 + 1500)} MMK</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold mt-1">
                          <span className="text-emerald-600">Net Disbursement</span>
                          <span className="font-mono text-emerald-600">{formatMMK(75000 - 750 - 1500)} MMK</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority Matching Order</p>
                  <div className="space-y-1.5">
                    {feeTiers.sort((a, b) => a.priority - b.priority).map((ft, i) => (
                      <div key={ft.id} className="flex items-center gap-2 p-2 bg-white rounded-sm border border-slate-100">
                        <span className="text-[9px] font-mono text-slate-400 w-5 text-center">#{i + 1}</span>
                        <span className="text-[10px] font-medium text-slate-700 flex-1">{ft.name}</span>
                        <Badge variant="outline" className={`text-[8px] font-bold ${ft.feeType === "PERCENT" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>{ft.feeType}</Badge>
                        <span className="text-[10px] font-mono font-bold text-amber-600 w-12 text-right">{ft.feeType === "PERCENT" ? ft.value + "%" : formatMMK(ft.value)}</span>
                        <span className="text-[9px] font-mono text-slate-400 w-8 text-right">P:{ft.priority}</span>
                      </div>
                    ))}
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
