/**
 * PortalLayout — Command Center Shell
 * Left Sidebar (collapsible) | Top Command Bar | Main Content Area
 * Design: Neobrutalist Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 */
import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useView, type ViewType, type ModuleId } from "@/contexts/ViewContext";
import { MODULE_REGISTRY } from "@/contexts/ViewContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Grid3X3, Building2, Users, ArrowRightLeft, Repeat, ShieldCheck,
  BookOpen, Settings, Wallet, ShieldAlert, BarChart3, FileSpreadsheet,
  Bell, SlidersHorizontal, Workflow, Trash2, LayoutTemplate, AlertCircle,
  Menu, X, ChevronLeft, ChevronRight, Languages, User, Lock, ChevronDown
} from "lucide-react";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";
import { EmployeesPage } from "@/pages/employees/EmployeesPage";
import { TransactionsPage } from "@/pages/transactions/TransactionsPage";
import { RepaymentPage } from "@/pages/repayment/RepaymentPage";
import { SettlementPage } from "@/pages/settlement/SettlementPage";
import { CircleLedgerPage } from "@/pages/circle-ledger/CircleLedgerPage";
import { FeeBuilderPage } from "@/pages/fee-builder/FeeBuilderPage";
import { BudgetPage } from "@/pages/budget/BudgetPage";
import { RiskPage } from "@/pages/risk/RiskPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { PayrollPage } from "@/pages/payroll/PayrollPage";
import { NotificationsPage } from "@/pages/notifications/NotificationsPage";
import { AdminPage } from "@/pages/admin/AdminPage";
import { WorkflowPage } from "@/pages/workflow/WorkflowPage";
import { WriteOffPage } from "@/pages/writeoff/WriteOffPage";
import { FormCreatorPage } from "@/pages/form-creator/FormCreatorPage";
import { ErrorsPage } from "@/pages/errors/ErrorsPage";

const ICON_MAP: Record<string, React.ElementType> = {
  "grid-3x3": Grid3X3, "building-2": Building2, "users": Users,
  "arrow-right-left": ArrowRightLeft, "repeat": Repeat, "shield-check": ShieldCheck,
  "book-open": BookOpen, "settings": Settings, "wallet": Wallet, "shield-alert": ShieldAlert,
  "bar-chart-3": BarChart3, "file-spreadsheet": FileSpreadsheet, "bell": Bell,
  "sliders-horizontal": SlidersHorizontal, "workflow": Workflow, "trash-2": Trash2,
  "layout-template": LayoutTemplate, "alert-circle": AlertCircle,
};

const MODULE_PAGES: Record<ModuleId, React.FC> = {
  "dashboard": DashboardPage, "onboarding": OnboardingPage, "employees": EmployeesPage,
  "transactions": TransactionsPage, "repayment": RepaymentPage, "settlement": SettlementPage,
  "circle-ledger": CircleLedgerPage, "fee-builder": FeeBuilderPage, "budget": BudgetPage,
  "risk": RiskPage, "reports": ReportsPage, "payroll": PayrollPage,
  "notifications": NotificationsPage, "admin": AdminPage, "workflow": WorkflowPage,
  "writeoff": WriteOffPage, "form-creator": FormCreatorPage, "errors": ErrorsPage,
};

const VIEW_COLORS: Record<ViewType, string> = {
  "HR": "bg-emerald-500", "Sales": "bg-blue-500", "Operations": "bg-amber-500",
  "Back Office": "bg-slate-500", "Finance": "bg-violet-500", "Risk": "bg-red-500",
  "Platform Admin": "bg-teal-500",
};

const VIEW_ICONS: Record<ViewType, React.ElementType> = {
  "HR": Users, "Sales": Wallet, "Operations": ShieldCheck,
  "Back Office": BookOpen, "Finance": FileSpreadsheet, "Risk": ShieldAlert,
  "Platform Admin": Settings,
};

export function PortalLayout() {
  const { view, setView, modules, hasPermission, lang, setLang } = useView();
  const [collapsed, setCollapsed] = useState(false);
  const [, setLocation] = useLocation();
  const [, matchParams] = useRoute<{ module: string }>("/module/:module");
  const currentModuleId = (matchParams?.module as ModuleId) || "dashboard";

  const activeModule = MODULE_REGISTRY.find(m => m.id === currentModuleId) || modules[0];

  const navigateTo = (moduleId: ModuleId) => {
    setLocation(`/module/${moduleId}`);
  };

  const PageComponent = MODULE_PAGES[currentModuleId] || DashboardPage;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-[#1e3a5f] text-white transition-all duration-300 shrink-0 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center px-0" : ""}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#0ea5e9] flex items-center justify-center shrink-0">
                <img src="/manus-storage/ewa-logo_4f36e433.png" alt="EWA" className="w-7 h-7 object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold tracking-tight leading-tight">EWA 3.0</h1>
                <p className="text-[10px] text-slate-300 leading-tight truncate">Enterprise Platform</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 rounded-lg bg-[#0ea5e9] flex items-center justify-center">
              <img src="/manus-storage/ewa-logo_4f36e433.png" alt="EWA" className="w-7 h-7 object-contain" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-3">
          <nav className="space-y-0.5">
            {modules.map((mod) => {
              const Icon = ICON_MAP[mod.icon] || Grid3X3;
              const isActive = currentModuleId === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => navigateTo(mod.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-[#0ea5e9]/20 text-[#0ea5e9] font-medium"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                  title={collapsed ? mod.label : undefined}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#0ea5e9]" : ""}`} />
                  {!collapsed && <span className="truncate">{mod.label}</span>}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Collapse Toggle */}
        <div className="border-t border-white/10 p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-slate-300 hover:bg-white/5 hover:text-white text-xs transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command Bar */}
        <header className="h-[52px] bg-white border-b-[3px] border-[#1e3a5f]/80 flex items-center justify-between px-5 shrink-0 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => setCollapsed(!collapsed)} className="lg:hidden text-slate-500">
              <Menu className="w-5 h-5" />
            </button>
            {/* Signature lock motif */}
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1e3a5f]/40" />
              <div>
                <h2 className="text-[13px] font-bold tracking-tight text-[#1e3a5f] uppercase">{activeModule.label}</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">View as: <span className="font-semibold text-[#1e3a5f]/70">{view}</span></p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* View Switcher */}
            <div className="relative group">
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold text-white shadow-sm ${VIEW_COLORS[view]}`}>
                {(() => {
                  const Icon = VIEW_ICONS[view];
                  return <Icon className="w-3.5 h-3.5" />;
                })()}
                <span>{view}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 p-1 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <p className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">Switch Command View</p>
                {(["HR", "Sales", "Operations", "Back Office", "Finance", "Risk", "Platform Admin"] as ViewType[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs transition-colors ${
                      view === v ? "bg-[#1e3a5f]/5 font-semibold text-[#1e3a5f]" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${VIEW_COLORS[v]}`} />
                    <span className="font-medium">{v}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Language Toggle */}
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 uppercase tracking-wider" onClick={() => setLang(lang === "en" ? "my" : "en")}>
              <Languages className="w-3.5 h-3.5 mr-1.5" />
              {lang === "en" ? "EN" : "MM"}
            </Button>
          </div>
        </header>

        {/* Signature ledger flow line */}
        <div className="h-[2px] bg-gradient-to-r from-[#1e3a5f]/0 via-[#0ea5e9]/40 to-[#1e3a5f]/0" />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-5">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}
