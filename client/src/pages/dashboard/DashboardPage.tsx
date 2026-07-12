/**
 * DashboardPage — Analytical Command Dashboard
 * SAP Fiori Pattern: Analytical Page — KPI cards, charts, alerts
 * Design: Enterprise Fintech — Navy (#1e3a5f) + Teal (#0ea5e9) | Sharp corners | Structured
 */
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, ArrowUpRight, Building2, AlertTriangle,
  Clock, CheckCircle2, AlertCircle, DollarSign, Repeat, ShieldAlert, Lock,
  LayoutGrid, ArrowRight
} from "lucide-react";
import { formatMMK, companies, transactions, employees, riskAssessments } from "@/data/mockData";
import { useView } from "@/contexts/ViewContext";

const COLORS = ["#1e3a5f", "#0ea5e9", "#10b981", "#f59e0b", "#c62828"];

/* ===== SAP Fiori KPI Card — sharp, structured, prominent number ===== */
function FioriKPICard({ title, value, change, changeDir, icon: Icon, accentColor, subtitle }: {
  title: string; value: string; change?: string; changeDir?: "up" | "down";
  icon: React.ElementType; accentColor: string; subtitle?: string;
}) {
  return (
    <div className="bg-white border border-[#d1d9e0] rounded-[3px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]" style={{ borderTop: `3px solid ${accentColor}` }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest">{title}</p>
        <Icon className="w-4 h-4" style={{ color: accentColor }} />
      </div>
      <p className="text-[28px] font-bold text-[#1e3a5f] tabular-nums leading-tight">{value}</p>
      <div className="flex items-center gap-1.5 mt-1.5 min-h-[18px]">
        {change && (
          <>
            {changeDir === "up" ? (
              <TrendingUp className="w-3 h-3 text-[#2e7d32]" />
            ) : (
              <TrendingDown className="w-3 h-3 text-[#c62828]" />
            )}
            <span className={`text-[10px] font-semibold ${changeDir === "up" ? "text-[#2e7d32]" : "text-[#c62828]"}`}>{change}</span>
            <span className="text-[10px] text-[#90a4ae]">vs last month</span>
          </>
        )}
      </div>
      {subtitle && <p className="text-[10px] text-[#90a4ae] mt-0.5">{subtitle}</p>}
    </div>
  );
}

/* ===== SAP Fiori Message Strip ===== */
function MessageStrip({ variant, icon: Icon, title, description, badge }: {
  variant: "info" | "warning" | "error" | "success";
  icon: React.ElementType; title: string; description: string; badge: string;
}) {
  const bgMap = { info: "bg-[#e3f2fd]", warning: "bg-[#fff8e1]", error: "bg-[#fce4ec]", success: "bg-[#e8f5e9]" };
  const borderMap = { info: "border-[#1565c0]", warning: "border-[#f9a825]", error: "border-[#c62828]", success: "border-[#2e7d32]" };
  const textMap = { info: "text-[#0d47a1]", warning: "text-[#e65100]", error: "text-[#b71c1c]", success: "text-[#1b5e20]" };
  const iconMap = { info: "text-[#1565c0]", warning: "text-[#f9a825]", error: "text-[#c62828]", success: "text-[#2e7d32]" };

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-[3px] ${bgMap[variant]} border-l-4 ${borderMap[variant]}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconMap[variant]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[#1e3a5f]">{title}</p>
        <p className="text-[10px] text-[#5a6b7c] mt-0.5">{description}</p>
      </div>
      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${textMap[variant]} bg-white/60 border border-black/10`}>
        {badge}
      </span>
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
    <div className="space-y-4">
      {/* ===== Page Header — SAP Fiori Object Page Header ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-[#0ea5e9]" />
          <div>
            <h1 className="text-[15px] font-bold text-[#1e3a5f] uppercase tracking-wide">Command Dashboard</h1>
            <p className="text-[10px] text-[#90a4ae] uppercase tracking-wider">
              {view === "HR" && "Employee lifecycle, onboarding, and payroll oversight"}
              {view === "Sales" && "Corporate portfolio, revenue, and client health"}
              {view === "Operations" && "Daily operations, disbursements, and settlements"}
              {view === "Back Office" && "Transaction processing, verification, and reconciliation"}
              {view === "Finance" && "GL ledger, accounting entries, and financial health"}
              {view === "Risk" && "Credit risk, compliance, and fraud detection"}
              {view === "Platform Admin" && "System configuration, policies, and platform health"}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#90a4ae] border border-[#d1d9e0] rounded-[2px] px-2 py-1 bg-white">
          12 JUL 2026
        </span>
      </div>

      {/* ===== KPI Row 1 — Primary Metrics ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <FioriKPICard title="Active Companies" value={String(companies.filter(c => c.status === "Active").length)} change="+1" changeDir="up" icon={Building2} accentColor="#1e3a5f" subtitle={`${companies.length} total registered`} />
        <FioriKPICard title="Active Employees" value={String(activeEmployees)} change="+3" changeDir="up" icon={Users} accentColor="#0ea5e9" subtitle={`${employees.length} total onboarded`} />
        <FioriKPICard title="Total Budget" value={formatMMK(totalBudget)} change="+15%" changeDir="up" icon={DollarSign} accentColor="#2e7d32" subtitle={`${utilizationPct}% utilized`} />
        <FioriKPICard title="Total Disbursed" value={formatMMK(totalDisbursed)} change="+22%" changeDir="up" icon={ArrowUpRight} accentColor="#0ea5e9" subtitle="This month" />
      </div>

      {/* ===== KPI Row 2 — Risk & Operations ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <FioriKPICard title="Repayment Rate" value={`${Math.round((totalRepaid / totalDisbursed) * 100)}%`} change="+5%" changeDir="up" icon={Repeat} accentColor="#2e7d32" subtitle={`${formatMMK(totalRepaid)} repaid`} />
        <FioriKPICard title="Outstanding" value={formatMMK(totalOutstanding)} change="+12%" changeDir="down" icon={AlertTriangle} accentColor="#f59e0b" subtitle={`${overdueCount} overdue transactions`} />
        <FioriKPICard title="Pending Verification" value={String(pendingVerification)} change="+1" changeDir="down" icon={Clock} accentColor="#f59e0b" subtitle="Employees awaiting check" />
        <FioriKPICard title="Risk Score Avg" value={String(Math.round(riskAssessments.reduce((s, r) => s + r.totalScore, 0) / riskAssessments.length))} icon={ShieldAlert} accentColor="#1e3a5f" subtitle="Weighted average across portfolio" />
      </div>

      {/* ===== Charts Section ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Budget Utilization by Company */}
        <div className="bg-white border border-[#d1d9e0] rounded-[3px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h3 className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest mb-3">Budget Utilization by Company</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={companyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `${v}M`} />
              <Tooltip formatter={(v: number) => [formatMMK(v * 1000000), ""]} contentStyle={{ fontSize: 11, borderRadius: 3, border: "1px solid #d1d9e0" }} />
              <Bar dataKey="used" name="Utilized" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
              <Bar dataKey="budget" name="Total Budget" fill="#1e3a5f" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Status Distribution */}
        <div className="bg-white border border-[#d1d9e0] rounded-[3px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h3 className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest mb-3">Transaction Status Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [`${v} transactions`, n]} contentStyle={{ fontSize: 11, borderRadius: 3, border: "1px solid #d1d9e0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 justify-center mt-1">
            {statusData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] font-medium text-[#5a6b7c]">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Monthly Financial Trend ===== */}
      <div className="bg-white border border-[#d1d9e0] rounded-[3px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h3 className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest mb-3">Monthly Financial Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(v: number, n: string) => [formatMMK(v), n]} contentStyle={{ fontSize: 11, borderRadius: 3, border: "1px solid #d1d9e0" }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="disbursed" name="Disbursed" stroke="#1e3a5f" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="repaid" name="Repaid" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="feeRevenue" name="Fee Revenue" stroke="#2e7d32" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Pending Actions — SAP Fiori Message Strips ===== */}
      <div>
        <h3 className="text-[10px] font-bold text-[#5a6b7c] uppercase tracking-widest mb-2">Pending Actions & Alerts</h3>
        <div className="space-y-2">
          {pendingVerification > 0 && (
            <MessageStrip variant="warning" icon={Clock} title={`${pendingVerification} Employee(s) Pending Verification`} description="Employment verification and EWA auto-approval checks required" badge="Action Needed" />
          )}
          {overdueCount > 0 && (
            <MessageStrip variant="error" icon={AlertCircle} title={`${overdueCount} Overdue Transaction(s)`} description="Late fees accumulating — repayment collection required" badge="Urgent" />
          )}
          <MessageStrip variant="info" icon={CheckCircle2} title="1 Settlement Awaiting Verification" description="Skyline Trading — REP-2026-07-001 (Finance Review)" badge="In Progress" />
        </div>
      </div>
    </div>
  );
}
