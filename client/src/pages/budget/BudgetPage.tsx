/**
 * BudgetPage — Budget Management
 * Design: Neobrutalist Fintech — Company budget allocation, utilization, and overflow tracking
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMMK, companies, employees } from "@/data/mockData";
import { Wallet, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function BudgetPage() {
  const totalBudget = companies.reduce((s, c) => s + c.totalBudget, 0);
  const totalUtilized = companies.reduce((s, c) => s + c.utilized, 0);
  const totalRemaining = totalBudget - totalUtilized;
  const utilizationPct = Math.round((totalUtilized / totalBudget) * 100);

  const budgetData = companies.map(c => ({
    name: c.name.split(" ").slice(0, 2).join(" "),
    utilized: c.utilized / 1000000,
    remaining: c.remaining / 1000000,
    total: c.totalBudget / 1000000,
    pct: Math.round((c.utilized / c.totalBudget) * 100),
  }));

  const budgetByCompany = companies.map(c => ({
    name: c.name.split(" ")[0],
    value: c.totalBudget / 1000000,
    fill: c.utilized / c.totalBudget > 0.8 ? "#ef4444" : c.utilized / c.totalBudget > 0.6 ? "#f59e0b" : "#10b981",
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Budget Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Allocation, utilization tracking, overflow detection, and budget requests</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#0ea5e9]" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Total Budget</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatMMK(totalBudget)}</p>
            <p className="text-xs text-slate-400 mt-0.5">{companies.length} companies allocated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Utilized</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatMMK(totalUtilized)}</p>
            <Progress value={utilizationPct} className="h-1.5 mt-2" />
            <p className="text-xs text-slate-400 mt-1">{utilizationPct}% overall utilization</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Remaining</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatMMK(totalRemaining)}</p>
            <p className="text-xs text-slate-400 mt-0.5">Available for new allocations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Overflow Risk</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{companies.filter(c => c.utilized / c.totalBudget > 0.7).length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Companies above 70% threshold</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget by Company */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Budget Allocation by Company</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Type</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Risk Tier</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Budget</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Utilized</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Remaining</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Utilization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map(c => {
                const pct = Math.round((c.utilized / c.totalBudget) * 100);
                return (
                  <TableRow key={c.id} className="hover:bg-slate-50/80">
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{c.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{c.id}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{c.type}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={`text-xs ${c.riskTier === "A" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : c.riskTier === "B" ? "bg-blue-100 text-blue-700 border-blue-200" : c.riskTier === "C" ? "bg-amber-100 text-amber-700 border-amber-200" : c.riskTier === "D" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-red-100 text-red-700 border-red-200"}`}>{c.riskTier}</Badge></TableCell>
                    <TableCell className="text-sm text-right text-slate-600">{formatMMK(c.totalBudget)}</TableCell>
                    <TableCell className="text-sm text-right font-medium text-slate-800">{formatMMK(c.utilized)}</TableCell>
                    <TableCell className={`text-sm text-right font-medium ${c.remaining > 0 ? "text-emerald-600" : "text-red-600"}`}>{formatMMK(c.remaining)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-2 w-20" />
                        <span className={`text-xs font-medium ${pct > 80 ? "text-red-600" : pct > 60 ? "text-amber-600" : "text-emerald-600"}`}>{pct}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Per Employee Cap */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Per-Employee EWA Limits</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Per Employee Cap</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Max Advance</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Credit Score</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map(c => (
                <TableRow key={c.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-sm font-medium text-slate-800">{c.name}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{formatMMK(c.perEmployeeCap)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{formatMMK(c.maxAdvance)}</TableCell>
                  <TableCell>
                    <span className={`text-sm font-bold ${c.creditScore >= 80 ? "text-emerald-600" : c.creditScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{c.creditScore}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${c.status === "Active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}>{c.status}</Badge>
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
