/**
 * RiskPage — Risk & Backoffice Assessment
 * Design: Neobrutalist Fintech — Credit risk scoring, company assessment, and fraud detection
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { formatMMK, riskAssessments } from "@/data/mockData";
import { ShieldAlert, ShieldCheck, ShieldX, Radar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function RiskPage() {
  const riskData = riskAssessments.map(r => ({
    name: r.companyName.split(" ")[0],
    revenueStability: r.revenueStability,
    employeeStability: r.employeeStability,
    industryRisk: r.industryRisk,
    financialHealth: r.financialHealth,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Risk & Backoffice Assessment</h1>
        <p className="text-sm text-slate-500 mt-0.5">Credit scoring, company risk tiers, and portfolio risk monitoring</p>
      </div>

      {/* Risk Assessment Table */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Company Risk Assessment</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Risk Tier</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Total Score</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Revenue Stability</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Employee Stability</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Industry Risk</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Financial Health</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold text-right">Credit Pool</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskAssessments.map(ra => (
                <TableRow key={ra.id} className="hover:bg-slate-50/80">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{ra.companyName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{ra.companyId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs font-bold ${
                      ra.riskTier === "A" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                      ra.riskTier === "B" ? "bg-blue-100 text-blue-700 border-blue-200" :
                      ra.riskTier === "C" ? "bg-amber-100 text-amber-700 border-amber-200" :
                      ra.riskTier === "D" ? "bg-orange-100 text-orange-700 border-orange-200" :
                      "bg-red-100 text-red-700 border-red-200"
                    }`}>{ra.riskTier}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-bold ${ra.totalScore >= 80 ? "text-emerald-600" : ra.totalScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{ra.totalScore}/100</span>
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Progress value={ra.revenueStability} className="h-1.5 w-12" />
                      <span className="text-xs text-slate-600">{ra.revenueStability}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Progress value={ra.employeeStability} className="h-1.5 w-12" />
                      <span className="text-xs text-slate-600">{ra.employeeStability}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Progress value={ra.industryRisk} className="h-1.5 w-12" />
                      <span className="text-xs text-slate-600">{ra.industryRisk}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Progress value={ra.financialHealth} className="h-1.5 w-12" />
                      <span className="text-xs text-slate-600">{ra.financialHealth}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-right font-medium text-slate-800">{formatMMK(ra.creditPool)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Approved
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Risk Radar Chart */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Risk Dimensions Comparison</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="revenueStability" name="Revenue Stability" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="employeeStability" name="Employee Stability" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="industryRisk" name="Industry Risk" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="financialHealth" name="Financial Health" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Backoffice Controls */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Backoffice Controls</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: ShieldAlert, title: "Ghost Employee Detection", desc: "Auto-flag employees missing from latest payroll roster", status: "Active", color: "text-emerald-500" },
              { icon: ShieldCheck, title: "Duplicate Detection", desc: "National ID and employee ID uniqueness validation", status: "Active", color: "text-emerald-500" },
              { icon: Radar, title: "Fraud Pattern Monitor", desc: "Anomaly detection on withdrawal frequency and amounts", status: "Active", color: "text-emerald-500" },
              { icon: ShieldX, title: "Account Freeze Queue", desc: "Review and approve company freeze actions", status: "1 Pending", color: "text-amber-500" },
              { icon: ShieldAlert, title: "Overdraft Protection", desc: "Auto-block requests exceeding company budget", status: "Active", color: "text-emerald-500" },
              { icon: ShieldCheck, title: "Compliance Audit", desc: "KYC/AML compliance verification for all onboarded entities", status: "In Progress", color: "text-blue-500" },
            ].map((ctrl, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <ctrl.icon className={`w-4 h-4 ${ctrl.color}`} />
                  <span className="text-sm font-medium text-slate-800">{ctrl.title}</span>
                </div>
                <p className="text-xs text-slate-500">{ctrl.desc}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-400">{ctrl.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
