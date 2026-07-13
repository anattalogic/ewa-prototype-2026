/**
 * WorkflowPage — Enterprise Workflow & Case Management
 * SAP Fiori Pattern: 3-tab Object Page (Tasks / Requests / History)
 * Design: Enterprise Fintech — Navy (#1e3a5f) + Teal (#0ea5e9) | Sharp corners | Structured layout
 * Features: State machine visualization, SLA countdown, audit trail, action tracking
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  workflowCases, workItems, workflowActivities,
  type WorkflowCase, type WorkItem, type WorkflowActivity,
} from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock, CheckCircle2, AlertCircle, XCircle, ArrowRight, ArrowLeft,
  UserCheck, ChevronDown, ChevronRight, FileText, MessageSquare,
  Play, Pause, SkipForward, RotateCcw, Bell, Timer, Activity,
  ShieldCheck, ShieldX, FileDown, Search, Filter, UsersRound
} from "lucide-react";

/* ===== STATUS BADGE ===== */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    "Draft": { bg: "bg-[#f5f5f5]", text: "text-[#616161]", border: "border-[#bdbdbd]" },
    "Submitted": { bg: "bg-[#fff8e1]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "Checking": { bg: "bg-[#e3f2fd]", text: "text-[#0d47a1]", border: "border-[#90caf9]" },
    "HR_Review": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#a5d6a7]" },
    "Risk_Review": { bg: "bg-[#fff3e0]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "Finance_Review": { bg: "bg-[#e3f2fd]", text: "text-[#0d47a1]", border: "border-[#90caf9]" },
    "Approved": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#a5d6a7]" },
    "Completed": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#a5d6a7]" },
    "Rejected": { bg: "bg-[#fce4ec]", text: "text-[#b71c1c]", border: "border-[#ef9a9a]" },
    "Cancelled": { bg: "bg-[#f5f5f5]", text: "text-[#616161]", border: "border-[#bdbdbd]" },
    "Escalated": { bg: "bg-[#fce4ec]", text: "text-[#b71c1c]", border: "border-[#ef9a9a]" },
    "Returned": { bg: "bg-[#fff8e1]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "Maker_Submitted": { bg: "bg-[#fff3e0]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "Checker_Approved": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#a5d6a7]" },
    "Checker_Rejected": { bg: "bg-[#fce4ec]", text: "text-[#b71c1c]", border: "border-[#ef9a9a]" },
  };
  const c = map[status] || { bg: "bg-[#f5f5f5]", text: "text-[#616161]", border: "border-[#bdbdbd]" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    "Critical": { bg: "bg-[#fce4ec]", text: "text-[#b71c1c]", border: "border-[#ef9a9a]" },
    "High": { bg: "bg-[#fff3e0]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "Medium": { bg: "bg-[#e3f2fd]", text: "text-[#0d47a1]", border: "border-[#90caf9]" },
    "Low": { bg: "bg-[#f5f5f5]", text: "text-[#616161]", border: "border-[#bdbdbd]" },
  };
  const c = map[priority] || map["Low"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}>
      {priority}
    </span>
  );
}

function CaseTypeIcon({ type }: { type: string }) {
  const icons: Record<string, { icon: React.ElementType; color: string }> = {
    "employee_import": { icon: UsersRound, color: "text-teal-600" },
    "employee_verification": { icon: UserCheck, color: "text-blue-600" },
    "budget_request": { icon: AlertCircle, color: "text-amber-600" },
    "company_onboarding": { icon: ShieldCheck, color: "text-emerald-600" },
    "settlement": { icon: Clock, color: "text-indigo-600" },
    "writeoff": { icon: XCircle, color: "text-red-600" },
  };
  const { icon: Icon, color } = icons[type] || { icon: FileText, color: "text-slate-600" };
  return <Icon className={`w-4 h-4 ${color}`} />;
}

/* ===== STATE MACHINE VISUALIZATION ===== */
function StateMachine({ caseData }: { caseData: WorkflowCase }) {
  const budgetPath = ["Submitted", "HR_Review", "Risk_Review", "Finance_Review", "Approved"];
  const importPath = ["Submitted", "Checking", "Maker_Submitted", "Checker_Approved", "Completed"];
  const verificationPath = ["Submitted", "Checking", "Approved"];
  const settlementPath = ["Submitted", "Checking", "Approved"];
  const onboardingPath = ["Submitted", "HR_Review", "Risk_Review", "Finance_Review", "Approved"];

  let path: string[] = ["Submitted", "Checking", "Completed"];
  if (caseData.type === "budget_request") path = budgetPath;
  else if (caseData.type === "employee_import") path = importPath;
  else if (caseData.type === "employee_verification") path = verificationPath;
  else if (caseData.type === "settlement") path = settlementPath;
  else if (caseData.type === "company_onboarding") path = onboardingPath;

  const currentIndex = path.indexOf(caseData.status);

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">State Machine</p>
      <div className="flex items-center gap-0 overflow-x-auto py-2">
        {path.map((step, i) => {
          const isActive = i === currentIndex;
          const isComplete = i < currentIndex;
          const isRejected = caseData.status === "Rejected" && i >= currentIndex;
          return (
            <div key={step} className="flex items-center">
              <div className={`flex flex-col items-center px-3 py-1.5 rounded-[2px] ${
                isActive ? "bg-[#0ea5e9] text-white" :
                isComplete ? "bg-emerald-500 text-white" :
                isRejected ? "bg-red-100 text-red-600 border border-red-200" :
                "bg-slate-100 text-slate-400"
              }`}>
                <span className="text-[8px] font-bold uppercase tracking-wider whitespace-nowrap">{step.replace("_", " ")}</span>
              </div>
              {i < path.length - 1 && (
                <div className={`w-6 h-0.5 ${isComplete ? "bg-emerald-500" : isActive ? "bg-[#0ea5e9]" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== SLA TIMER ===== */
function SLATimer({ remaining }: { remaining: string }) {
  const isOverdue = remaining === "—" || remaining.includes("—");
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold ${isOverdue ? "text-red-600" : "text-amber-600"}`}>
      <Timer className="w-3 h-3" />
      {isOverdue ? "OVERDUE" : remaining}
    </span>
  );
}

/* ===== AUDIT TRAIL TIMELINE ===== */
function AuditTimeline({ activities }: { activities: WorkflowActivity[] }) {
  const typeIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    "created": { icon: Activity, color: "text-teal-600", bg: "bg-teal-100" },
    "submitted": { icon: Play, color: "text-blue-600", bg: "bg-blue-100" },
    "approved": { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    "rejected": { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
    "returned": { icon: RotateCcw, color: "text-amber-600", bg: "bg-amber-100" },
    "escalated": { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
    "assigned": { icon: UsersRound, color: "text-blue-600", bg: "bg-blue-100" },
    "claimed": { icon: UserCheck, color: "text-indigo-600", bg: "bg-indigo-100" },
    "completed": { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    "comment": { icon: MessageSquare, color: "text-slate-600", bg: "bg-slate-100" },
  };
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {activities.map((a, i) => {
        const ti = typeIcons[a.type] || typeIcons.comment;
        const Icon = ti.icon;
        return (
          <div key={a.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${ti.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${ti.color}`} />
              </div>
              {i < activities.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-0.5" />}
            </div>
            <div className="pb-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">{a.action}</span>
                <span className="text-[10px] text-slate-400 font-mono">{a.timestamp}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{a.actor} ({a.actorRole})</p>
              {a.details && <p className="text-[10px] text-slate-600 mt-0.5 bg-slate-50 rounded px-2 py-0.5">{a.details}</p>}
              {a.fromState && a.toState && (
                <div className="flex items-center gap-1 mt-0.5 text-[10px]">
                  <span className="text-amber-600 font-bold">{a.fromState.replace("_", " ")}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-emerald-600 font-bold">{a.toState.replace("_", " ")}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== WORKFLOW CASE DETAIL PANEL ===== */
function CaseDetailPanel({ caseData, onClose }: { caseData: WorkflowCase; onClose: () => void }) {
  const caseActivities = workflowActivities.filter(a => a.caseId === caseData.id);
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: "Audit Trail" },
    { id: "actions", label: "Actions" },
  ];

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right" className="w-[550px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-base font-bold text-[#1e3a5f] flex items-center gap-2">
            <CaseTypeIcon type={caseData.type} />
            {caseData.id} — {caseData.title}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          {/* Case Info */}
          <div className="bg-slate-50 rounded-md p-3 text-xs space-y-1">
            <div className="flex justify-between"><span className="text-slate-500">Type:</span><span className="font-medium">{caseData.type.replace("_", " ")}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Subject:</span><span className="font-medium">{caseData.subject}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Status:</span><StatusBadge status={caseData.status} /></div>
            <div className="flex justify-between"><span className="text-slate-500">Current Step:</span><span className="font-medium text-slate-700">{caseData.currentStep}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Current Owner:</span><span className="font-medium">{caseData.currentOwner} ({caseData.ownerRole})</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Priority:</span><PriorityBadge priority={caseData.priority} /></div>
            <div className="flex justify-between"><span className="text-slate-500">SLA Remaining:</span><SLATimer remaining={caseData.slaRemaining} /></div>
            <div className="flex justify-between"><span className="text-slate-500">Escalation Level:</span><span className="font-mono">{caseData.escalationLevel}</span></div>
            {caseData.relatedId && <div className="flex justify-between"><span className="text-slate-500">Related ID:</span><span className="font-mono text-teal-600">{caseData.relatedId}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Created:</span><span className="font-mono text-slate-600">{caseData.createdAt}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Updated:</span><span className="font-mono text-slate-600">{caseData.updatedAt}</span></div>
          </div>

          {/* State Machine */}
          <StateMachine caseData={caseData} />

          {/* Action Buttons */}
          {caseData.status !== "Completed" && caseData.status !== "Rejected" && caseData.status !== "Cancelled" && (
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-[10px] border-red-300 text-red-600 hover:bg-red-50">
                <XCircle className="w-3 h-3 mr-1" /> Reject
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-[10px]">
                <FileText className="w-3 h-3 mr-1" /> Comment
              </Button>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-slate-200">
            <div className="flex gap-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b-2 ${
                    activeTab === tab.id
                      ? "border-[#0ea5e9] text-[#0ea5e9] bg-[#0ea5e9]/5"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">{caseData.subject}</p>
              <p className="text-[10px] text-slate-500">This case is currently at the <strong>{caseData.currentStep}</strong> stage. The next action is required from <strong>{caseData.currentOwner}</strong> ({caseData.ownerRole}). SLA expires in <strong>{caseData.slaRemaining}</strong>.</p>
            </div>
          )}
          {activeTab === "timeline" && (
            <AuditTimeline activities={caseActivities} />
          )}
          {activeTab === "actions" && (
            <div className="space-y-3">
              {caseActivities.map(a => (
                <div key={a.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded">
                  <span className="text-slate-700">{a.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{a.actor}</span>
                </div>
              ))}
              {caseActivities.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No actions yet</p>}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function WorkflowPage() {
  const [selectedCase, setSelectedCase] = useState<WorkflowCase | null>(null);
  const [caseDetailOpen, setCaseDetailOpen] = useState(false);
  const [workItemAction, setWorkItemAction] = useState<WorkItem | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const pendingTasks = workItems.filter(w => w.status === "Pending" || w.status === "Assigned" || w.status === "Overdue");
  const inProgressTasks = workItems.filter(w => w.status === "InProgress");
  const completedTasks = workItems.filter(w => w.status === "Completed");

  const activeCases = workflowCases.filter(c => c.status !== "Completed" && c.status !== "Rejected" && c.status !== "Cancelled");
  const historyCases = workflowCases.filter(c => c.status === "Completed" || c.status === "Rejected" || c.status === "Cancelled");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-500" />
            Enterprise Workflow
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Unified workflow view · Request/Task tracking · State machine · Audit trail</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs border-[#1e3a5f]/20 text-[#1e3a5f]">
            <Bell className="w-3.5 h-3.5 mr-1" /> Notifications ({pendingTasks.length})
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        <Card className="border-l-2 border-l-red-400">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pending Tasks</p>
            <p className="text-lg font-bold text-red-600 mt-1">{pendingTasks.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-2 border-l-blue-400">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">In Progress</p>
            <p className="text-lg font-bold text-blue-600 mt-1">{inProgressTasks.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-2 border-l-emerald-400">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Completed</p>
            <p className="text-lg font-bold text-emerald-600 mt-1">{completedTasks.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-2 border-l-amber-400">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Active Cases</p>
            <p className="text-lg font-bold text-amber-600 mt-1">{activeCases.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-2 border-l-purple-400">
          <CardContent className="p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Escalated</p>
            <p className="text-lg font-bold text-purple-600 mt-1">{activeCases.filter(c => c.escalationLevel > 0).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-slate-100/50">
          <TabsTrigger value="tasks" className="text-[10px]">My Tasks</TabsTrigger>
          <TabsTrigger value="requests" className="text-[10px]">All Requests</TabsTrigger>
          <TabsTrigger value="history" className="text-[10px]">History</TabsTrigger>
        </TabsList>

        {/* ===== MY TASKS TAB ===== */}
        <TabsContent value="tasks" className="mt-4">
          <div className="space-y-4">
            {/* Task Filters */}
            <div className="flex items-center gap-2">
              <Input placeholder="Search tasks..." className="h-8 text-xs w-48" />
              <Button size="sm" variant="outline" className="h-8 text-xs border-slate-200">
                <Filter className="w-3.5 h-3.5 mr-1" /> Filter
              </Button>
              <div className="flex-1" />
              <span className="text-[10px] text-slate-400">{pendingTasks.length} tasks requiring action</span>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Action Required — Work Items</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b-slate-200">
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Work Item</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Case</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Type</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Step</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Owner</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Status</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Priority</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">SLA Due</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Escalation</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTasks.map(item => (
                      <TableRow key={item.id} className="border-b-slate-100">
                        <TableCell className="text-xs font-mono text-slate-700">{item.id}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                            onClick={() => {
                              const cs = workflowCases.find(c => c.id === item.caseId);
                              if (cs) { setSelectedCase(cs); setCaseDetailOpen(true); }
                            }}>
                            {item.caseTitle}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CaseTypeIcon type={item.caseType} />
                            <span className="text-[10px] text-slate-500">{item.caseType.replace("_", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-700">{item.stepName}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs text-slate-700">{item.ownerName}</p>
                            <p className="text-[10px] text-slate-400">{item.ownerRole}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status === "InProgress" ? "Checking" : item.status === "Overdue" ? "Escalated" : "Submitted"} />
                        </TableCell>
                        <TableCell><PriorityBadge priority={item.priority} /></TableCell>
                        <TableCell><SLATimer remaining={item.slaDueAt.replace("2026-07-12", "0h remaining").replace("2026-07-13", "1d remaining").replace("2026-07-14", "2d remaining")} /></TableCell>
                        <TableCell>
                          {item.escalationLevel > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                              <AlertCircle className="w-3 h-3" /> Level {item.escalationLevel}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {item.status === "Pending" && (
                              <Button size="sm" variant="ghost" className="h-6 text-[10px] text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                                onClick={() => setWorkItemAction(item)}>
                                <UserCheck className="w-3 h-3 mr-0.5" /> Claim
                              </Button>
                            )}
                            {item.status === "Assigned" && (
                              <Button size="sm" variant="ghost" className="h-6 text-[10px] text-emerald-600 hover:bg-emerald-50">
                                <CheckCircle2 className="w-3 h-3 mr-0.5" /> Approve
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] text-red-600 hover:bg-red-50">
                              <XCircle className="w-3 h-3 mr-0.5" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== ALL REQUESTS TAB ===== */}
        <TabsContent value="requests" className="mt-4">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">All Workflow Requests</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b-slate-200">
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Case ID</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Type</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Title</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Status</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Current Step</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Owner</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Priority</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">SLA</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Escalation</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCases.map(c => (
                      <TableRow key={c.id} className="border-b-slate-100">
                        <TableCell className="text-xs font-mono text-slate-700">{c.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CaseTypeIcon type={c.type} />
                            <span className="text-[10px] text-slate-500">{c.type.replace("_", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-medium text-slate-700">{c.title}</p>
                          <p className="text-[10px] text-slate-400">{c.subject}</p>
                        </TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                        <TableCell className="text-xs text-slate-700">{c.currentStep}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs text-slate-700">{c.currentOwner}</p>
                            <p className="text-[10px] text-slate-400">{c.ownerRole}</p>
                          </div>
                        </TableCell>
                        <TableCell><PriorityBadge priority={c.priority} /></TableCell>
                        <TableCell><SLATimer remaining={c.slaRemaining} /></TableCell>
                        <TableCell>
                          {c.escalationLevel > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                              <AlertCircle className="w-3 h-3" /> Level {c.escalationLevel}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                            onClick={() => { setSelectedCase(c); setCaseDetailOpen(true); }}>
                            <FileText className="w-3 h-3 mr-0.5" /> Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== HISTORY TAB ===== */}
        <TabsContent value="history" className="mt-4">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Workflow History & Audit</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b-slate-200">
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Case ID</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Type</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Title</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Final Status</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Duration</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Created</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Completed</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyCases.map(c => {
                      const caseActs = workflowActivities.filter(a => a.caseId === c.id);
                      const createdDate = new Date(c.createdAt);
                      const updatedDate = new Date(c.updatedAt);
                      const hours = Math.round((updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60));
                      return (
                        <TableRow key={c.id} className="border-b-slate-100">
                          <TableCell className="text-xs font-mono text-slate-700">{c.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CaseTypeIcon type={c.type} />
                              <span className="text-[10px] text-slate-500">{c.type.replace("_", " ")}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-700">{c.title}</TableCell>
                          <TableCell><StatusBadge status={c.status} /></TableCell>
                          <TableCell className="text-xs font-mono text-slate-500">{hours}h</TableCell>
                          <TableCell className="text-xs text-slate-500 font-mono">{c.createdAt}</TableCell>
                          <TableCell className="text-xs text-slate-500 font-mono">{c.updatedAt}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="h-6 text-[10px] text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                                onClick={() => { setSelectedCase(c); setCaseDetailOpen(true); }}>
                                <FileText className="w-3 h-3 mr-0.5" /> Detail
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 text-[10px] text-slate-500 hover:bg-slate-50">
                                <FileDown className="w-3 h-3 mr-0.5" /> Export
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {historyCases.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="text-xs text-slate-400 text-center py-8">No completed cases yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Recent Activities</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="p-3">
                  <AuditTimeline activities={workflowActivities.slice(-8).reverse()} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Case Detail Panel */}
      {caseDetailOpen && selectedCase && (
        <CaseDetailPanel caseData={selectedCase} onClose={() => setCaseDetailOpen(false)} />
      )}

      {/* Work Item Action Modal */}
      <Dialog open={!!workItemAction} onOpenChange={() => setWorkItemAction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#1e3a5f]">
              {workItemAction ? workItemAction.stepName : ""} — Action Required
            </DialogTitle>
          </DialogHeader>

          {workItemAction && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-md p-3 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Case:</span><span className="font-medium">{workItemAction.caseTitle}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Type:</span><span className="font-medium">{workItemAction.caseType.replace("_", " ")}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Priority:</span><PriorityBadge priority={workItemAction.priority} /></div>
                <div className="flex justify-between"><span className="text-slate-500">SLA Due:</span><SLATimer remaining={workItemAction.slaDueAt.replace("2026-07-12", "Urgent").replace("2026-07-13", "1d remaining")} /></div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Action</label>
                <div className="flex gap-2 mt-1">
                  <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs border-red-300 text-red-600 hover:bg-red-50 flex-1">
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs flex-1">
                    <FileText className="w-3.5 h-3.5 mr-1" /> Comment
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Comment / Reason</label>
                <Textarea placeholder="Optional comment..." className="mt-1 text-xs" rows={3} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setWorkItemAction(null)}>Cancel</Button>
            <Button size="sm" className="h-8 text-xs bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirm Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
