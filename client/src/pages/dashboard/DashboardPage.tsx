/**
 * DashboardPage — Role-Adaptive KPI Hub
 * Design: Institutional Fintech Command Center
 * Deep Navy (#1e3a5f) + Teal (#0ea5e9) + restrained semantic colors
 * Signature motif: ledger flow line, lock trust marker
 */
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, ArrowUpRight, Building2, AlertTriangle,
  Clock, CheckCircle2, AlertCircle, DollarSign, Repeat, ShieldAlert, Lock
} from "lucide-react";
import { formatMMK, companies, transactions, employees, repaymentRequests, riskAssessments } from "@/data/mockData";
import { useView } from "@/contexts/ViewContext";

const COLORS = ["#1e3a5f", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

function KPICard({ title, value, change, changeDir, icon: Icon, accent, subtitle }: {
  title: string; value: string; change?: string; changeDir?: "up" | "down";
  icon: React.ElementType; accent: string; subtitle?: string;
}) {
  return (
    <div className="relative bg-white border border-slate-200/60 overflow-hidden">
      {/* Signature teal top accent strip */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${accent}`} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
          <Icon className={`w-4 h-4 ${accent.replace("bg-", "text-")}`} />
        </div>
        <p className="text-3xl font-extrabold text-[#1e3a5f] tabular-nums tracking-tight">{value}</p>
        <div className="flex items-center gap-1.5 mt-2">
          {change && (
            <>
              {changeDir === "up" ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
              <span className={`text-xs font-semibold ${changeDir === "up" ? "text-emerald-600" : "text-red-600"}`}>{change}</span>
              <span className="text-[11px] text-slate-400">vs last month</span>
            </>
          )}
        </div>
        {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function AlertBanner({ icon: Icon, iconColor, bg, borderColor, title, description, badge, badgeClass }: {
  icon: React.ElementType; iconColor: string; bg: string; borderColor: string;
  title: string; description: string; badge: string; badgeClass: string;
}) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded border ${bg} ${borderColor}`}>
      <div className={`mt-0.5 ${iconColor}`}><Icon className="w-4 h-4" /></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1e3a5f]">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <Badge className={`${badgeClass} text-[10px] font-semibold uppercase tracking-wider shrink-0`}>{badge}</Badge>
    </div>
  );
}

export function DashboardPage() {
  const { view } = useView();

  const totalDisbursed = transactions.reduce((s, t) => s + t.amount, 0);
  const totalRepaid = transactions.filter(t => t.status === "Repaid").reduce((s, t) => s + t.amount, 0);
  const totalOutstanding = transactions.filter(t => t.status === "Overdue").reduce((s, t) => s + t.amount, 0);
  const activeEmployees = employees.filter(e => e.status === "Active").length;
  const pendingVerification = employees.filter(e => e.status === "Pending Verification").length;
  const overdueCount = transactions.filter(t => t.status === "Overdue").length;
  const totalBudget = companies.reduce((s, c) => s + c.totalBudget, 0);
  const totalUtilized = companies.reduce((s, c) => s + c.utilized, 0);
  const utilizationPct = Math.round((totalUtilized / totalBudget) * 100);

  const companyData = companies.map(c => ({
    name: c.name.split(" ")[0],
    budget: c.totalBudget / 1000000,
    used: c.utilized / 1000000,
  }));

  const statusData = [
    { name: "Repaid", value: transactions.filter(t => t.status === "Repaid").length },
    { name: "Active", value: transactions.filter(t => t.status === "Approved" || t.status === "Disbursing").length },
    { name: "Overdue", value: overdueCount },
    { name: "Pending", value: transactions.filter(t => t.status === "Pending").length },
  ];

  // Monthly trend data for financial health
  const monthlyTrend = [
    { month: "Jan", disbursed: 420000, repaid: 310000, feeRevenue: 12000 },
    { month: "Feb", disbursed: 680000, repaid: 520000, feeRevenue: 18000 },
    { month: "Mar", disbursed: 920000, repaid: 780000, feeRevenue: 24000 },
    { month: "Apr", disbursed: 1100000, repaid: 950000, feeRevenue: 28000 },
    { month: "May", disbursed: 1350000, repaid: 1120000, feeRevenue: 32000 },
    { month: "Jun", disbursed: 1580000, repaid: 1280000, feeRevenue: 35000 },
    { month: "Jul", disbursed: totalDisbursed, repaid: totalRepaid, feeRevenue: 43295 },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1e3a5f] uppercase tracking-tight">Command Dashboard</h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            {view === "HR" && "Employee lifecycle, onboarding, and payroll oversight"}
            {view === "Sales" && "Corporate portfolio, revenue, and client health"}
            {view === "Operations" && "Daily operations, disbursements, and settlements"}
            {view === "Back Office" && "Transaction processing, verification, and reconciliation"}
            {view === "Finance" && "GL ledger, accounting entries, and financial health"}
            {view === "Risk" && "Credit risk, compliance, and fraud detection"}
            {view === "Platform Admin" && "System configuration, policies, and platform health"}
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono text-slate-400 border-slate-200 uppercase tracking-wider">12 JUL 2026</Badge>
      </div>

      {/* Signature ledger flow divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#0ea5e9]/30 to-transparent" />

      {/* KPI Row 1 — Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Companies" value={String(companies.filter(c => c.status === "Active").length)} change="+1" changeDir="up" icon={Building2} accent="bg-[#1e3a5f]" subtitle={`${companies.length} total registered`} />
        <KPICard title="Active Employees" value={String(activeEmployees)} change="+3" changeDir="up" icon={Users} accent="bg-[#0ea5e9]" subtitle={`${employees.length} total onboarded`} />
        <KPICard title="Total Budget" value={formatMMK(totalBudget)} change="+15%" changeDir="up" icon={DollarSign} accent="bg-emerald-500" subtitle={`${utilizationPct}% utilized`} />
        <KPICard title="Total Disbursed" value={formatMMK(totalDisbursed)} change="+22%" changeDir="up" icon={ArrowUpRight} accent="bg-[#0ea5e9]" subtitle={`This month`} />
      </div>

      {/* KPI Row 2 — Risk & Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Repayment Rate" value={`${Math.round((totalRepaid / totalDisbursed) * 100)}%`} change="+5%" changeDir="up" icon={Repeat} accent="bg-emerald-500" subtitle={`${formatMMK(totalRepaid)} repaid`} />
        <KPICard title="Outstanding" value={formatMMK(totalOutstanding)} change="+12%" changeDir="down" icon={AlertTriangle} accent="bg-amber-500" subtitle={`${overdueCount} overdue transactions`} />
        <KPICard title="Pending Verification" value={String(pendingVerification)} change="+1" changeDir="down" icon={Clock} accent="bg-amber-500" subtitle="Employees awaiting check" />
        <KPICard title="Risk Score Avg" value={String(Math.round(riskAssessments.reduce((s, r) => s + r.totalScore, 0) / riskAssessments.length))} icon={ShieldAlert} accent="bg-[#1e3a5f]" subtitle="Weighted average across portfolio" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Budget Utilization by Company */}
        <div className="bg-white border border-slate-200/60 p-4">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Budget Utilization by Company</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={companyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `${v}M`} />
              <Tooltip formatter={(v: number) => [`${formatMMK(v * 1000000)}`, ""]} />
              <Bar dataKey="used" name="Utilized" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
              <Bar dataKey="budget" name="Total Budget" fill="#1e3a5f" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Status Distribution */}
        <div className="bg-white border border-slate-200/60 p-4">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Transaction Status Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [`${v} transactions`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 justify-center mt-1">
            {statusData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[11px] font-medium text-slate-500">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Financial Trend */}
      <div className="bg-white border border-slate-200/60 p-4">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Monthly Financial Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(v: number, n: string) => [formatMMK(v), n]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="disbursed" name="Disbursed" stroke="#1e3a5f" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="repaid" name="Repaid" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="feeRevenue" name="Fee Revenue" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pending Actions & Alerts */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Pending Actions & Alerts</h3>
        <div className="space-y-3">
          {pendingVerification > 0 && (
            <AlertBanner
              icon={Clock}
              iconColor="text-amber-500"
              bg="bg-amber-50/60"
              borderColor="border-amber-200/60"
              title={`${pendingVerification} Employee(s) Pending Verification`}
              description="Employment verification and EWA auto-approval checks required"
              badge="Action Needed"
              badgeClass="bg-amber-100 text-amber-700"
            />
          )}
          {overdueCount > 0 && (
            <AlertBanner
              icon={AlertCircle}
              iconColor="text-red-500"
              bg="bg-red-50/60"
              borderColor="border-red-200/60"
              title={`${overdueCount} Overdue Transaction(s)`}
              description="Late fees accumulating — repayment collection required"
              badge="Urgent"
              badgeClass="bg-red-100 text-red-700"
            />
          )}
          <AlertBanner
            icon={CheckCircle2}
            iconColor="text-blue-500"
            bg="bg-blue-50/60"
            borderColor="border-blue-200/60"
            title="1 Settlement Awaiting Verification"
            description="Skyline Trading — REP-2026-07-001 (Finance Review)"
            badge="In Progress"
            badgeClass="bg-blue-100 text-blue-700"
          />
        </div>
      </div>
    </div>
  );
}
