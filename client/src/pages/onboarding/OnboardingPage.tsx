/**
 * OnboardingPage — Employee Onboarding & Import Wizard
 * SAP Fiori Pattern: 3-tab Object Page (Tasks / Requests / History) + 6-step Import Wizard
 * Design: Enterprise Fintech — Navy (#1e3a5f) + Teal (#0ea5e9) | Sharp corners | Structured layout
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  employeeImportTasks, importBatches, onboardingPipeline, employees, companies,
  formatMMK, type EmployeeImportTask, type ImportBatch, type ImportRow,
} from "@/data/mockData";
import {
  Search, Upload, Plus, Eye, FileDown, Download, CheckCircle2, Clock, XCircle,
  AlertCircle, ArrowRight, ArrowLeft, UserCheck, UsersRound, Building2,
  FileText, CheckSquare, X, Trash2, MapPin, ChevronDown, ChevronRight,
  ArrowRightLeft, FileSpreadsheet, RotateCcw, ShieldCheck, ShieldX
} from "lucide-react";

/* ===== STATUS BADGE ===== */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    "Pending": { bg: "bg-[#fff8e1]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "Approved": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#a5d6a7]" },
    "Rejected": { bg: "bg-[#fce4ec]", text: "text-[#b71c1c]", border: "border-[#ef9a9a]" },
    "Checking": { bg: "bg-[#e3f2fd]", text: "text-[#0d47a1]", border: "border-[#90caf9]" },
    "Maker_Submitted": { bg: "bg-[#fff3e0]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "Column_Mapping": { bg: "bg-[#e3f2fd]", text: "text-[#0d47a1]", border: "border-[#90caf9]" },
    "Completed": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#a5d6a7]" },
    "Checker_Rejected": { bg: "bg-[#fce4ec]", text: "text-[#b71c1c]", border: "border-[#ef9a9a]" },
    "Active": { bg: "bg-[#e8f5e9]", text: "text-[#1b5e20]", border: "border-[#a5d6a7]" },
    "KYC_REVIEW": { bg: "bg-[#e3f2fd]", text: "text-[#0d47a1]", border: "border-[#90caf9]" },
    "Configuration": { bg: "bg-[#fff8e1]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "Integration": { bg: "bg-[#fff8e1]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
    "SUBMITTED": { bg: "bg-[#fff8e1]", text: "text-[#e65100]", border: "border-[#ffcc80]" },
  };
  const c = map[status] || { bg: "bg-[#f5f5f5]", text: "text-[#616161]", border: "border-[#bdbdbd]" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}>
      {status.replace("_", " ")}
    </span>
  );
}

/* ===== CATEGORY BADGE ===== */
function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    new: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    modified: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    missing: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    unchanged: { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200" },
  };
  const c = map[category] || map.unchanged;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}>
      {category.toUpperCase()}
    </span>
  );
}

function ValidationBadge({ validation }: { validation: string }) {
  const map: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
    correct: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
    incorrect: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle },
    warning: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: AlertCircle },
  };
  const c = map[validation] || map.correct;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}>
      <Icon className="w-3 h-3" /> {validation.toUpperCase()}
    </span>
  );
}

/* ===== WIZARD STEP INDICATOR ===== */
function WizardStepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${
            i < current ? "bg-emerald-500 text-white" :
            i === current ? "bg-[#0ea5e9] text-white" :
            "bg-slate-100 text-slate-400"
          }`}>
            <span className="font-mono">{i + 1}</span>
            <span className="hidden sm:inline">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-6 h-0.5 ${i < current ? "bg-emerald-500" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ===== SAMPLE IMPORT ROWS ===== */
const sampleImportRows: ImportRow[] = [
  { id: 1, category: "new", validation: "correct", data: { employee_code: "GH-004", name: "Aung Aung", phone: "09-771234567", salary: "450000", department: "Sales", branch: "Head Office" }, errors: [], warnings: [] },
  { id: 2, category: "new", validation: "correct", data: { employee_code: "GH-005", name: "Thiri Thuriya", phone: "09-971234567", salary: "500000", department: "Operations", branch: "Bago Branch" }, errors: [], warnings: [] },
  { id: 3, category: "new", validation: "incorrect", data: { employee_code: "GH-006", name: "", phone: "09-871234567", salary: "380000", department: "HR", branch: "Head Office" }, errors: ["Name is required"], warnings: [] },
  { id: 4, category: "modified", validation: "correct", data: { employee_code: "GH-001", name: "Thant Zin (Updated)", phone: "09-771234567", salary: "500000", department: "Sales", branch: "Head Office" }, errors: [], warnings: ["Salary changed from 450,000 to 500,000"] },
  { id: 5, category: "new", validation: "incorrect", data: { employee_code: "GH-007", name: "Mya Mya", phone: "09-671234567", salary: "0", department: "", branch: "" }, errors: ["Salary must be > 0", "Department is required"], warnings: [] },
  { id: 6, category: "missing", validation: "warning", data: { employee_code: "GH-003", name: "Zaw Win Htet", phone: "09-571234567", salary: "400000", department: "Operations", branch: "Bago Branch" }, errors: [], warnings: ["Employee in DB but not in file — action required"] },
  { id: 7, category: "unchanged", validation: "correct", data: { employee_code: "GH-002", name: "Myint Myint Aye", phone: "09-471234567", salary: "500000", department: "Operations", branch: "Head Office" }, errors: [], warnings: [] },
];

const SAMPLE_COLUMNS = [
  { fileColumn: "Employee ID", systemField: "employee_code", required: true },
  { fileColumn: "Full Name", systemField: "name", required: true },
  { fileColumn: "Phone", systemField: "phone", required: true },
  { fileColumn: "Salary (MMK)", systemField: "salary", required: true },
  { fileColumn: "Department", systemField: "department", required: false },
  { fileColumn: "Branch", systemField: "branch_code", required: false },
  { fileColumn: "Join Date", systemField: "join_date", required: false },
  { fileColumn: "NRC", systemField: "nrc", required: false },
];

export function OnboardingPage() {
  const [importWizardOpen, setImportWizardOpen] = useState(false);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState<ImportBatch | null>(null);
  const [detailBatchOpen, setDetailBatchOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<string>("detail");

  /* Single Employee Form State */
  const [employeeForm, setEmployeeForm] = useState({
    employee_code: "", name: "", phone: "", nrc: "",
    salary: "", department: "", branch_code: "", join_date: "",
    company_id: "cmp-001",
  });

  const wizardSteps = ["Upload File", "Column Mapping", "Data Preview", "Validation", "Maker Submit", "Checker Approve"];

  const activeBatches = importBatches.filter(b => b.status !== "Completed" && b.status !== "Checker_Rejected");
  const historyBatches = importBatches.filter(b => b.status === "Completed" || b.status === "Checker_Rejected");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
            <UsersRound className="w-5 h-5 text-teal-500" />
            Employee Onboarding
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Employee verification · Bulk import wizard · Budget eligibility integration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs border-[#1e3a5f]/20 text-[#1e3a5f]"
            onClick={() => setAddEmployeeOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Employee
          </Button>
          <Button size="sm" className="h-8 text-xs bg-[#0ea5e9] hover:bg-[#0284c7] text-white"
            onClick={() => { setImportWizardOpen(true); setWizardStep(0); }}>
            <Upload className="w-3.5 h-3.5 mr-1" /> Bulk Import
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-slate-100/50">
          <TabsTrigger value="tasks" className="text-[10px]">Tasks</TabsTrigger>
          <TabsTrigger value="requests" className="text-[10px]">Requests</TabsTrigger>
          <TabsTrigger value="history" className="text-[10px]">History</TabsTrigger>
        </TabsList>

        {/* ===== TASKS TAB ===== */}
        <TabsContent value="tasks" className="mt-4">
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3">
              <Card className="border-l-2 border-l-amber-400">
                <CardContent className="p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pending Approvals</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{employeeImportTasks.filter(t => t.status === "Pending").length}</p>
                </CardContent>
              </Card>
              <Card className="border-l-2 border-l-red-400">
                <CardContent className="p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Budget Overflow</p>
                  <p className="text-lg font-bold text-red-600 mt-1">{employeeImportTasks.filter(t => t.budgetOverflow && t.status === "Pending").length}</p>
                </CardContent>
              </Card>
              <Card className="border-l-2 border-l-blue-400">
                <CardContent className="p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Verification Queue</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">{employees.filter(e => e.status === "Pending Verification" || e.status === "KYC Pending").length}</p>
                </CardContent>
              </Card>
              <Card className="border-l-2 border-l-emerald-400">
                <CardContent className="p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Approved Today</p>
                  <p className="text-lg font-bold text-emerald-600 mt-1">3</p>
                </CardContent>
              </Card>
            </div>

            {/* Employee Import Tasks */}
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Employee Import Tasks</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b-slate-200">
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">ID</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Employee</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Company</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Type</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Budget Overflow</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Status</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Submitted</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeImportTasks.map(task => (
                      <TableRow key={task.id} className="border-b-slate-100">
                        <TableCell className="text-xs font-mono text-slate-700">{task.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs font-medium text-slate-900">{task.employeeName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{task.employeeCode}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-700">{task.companyName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[9px] font-bold uppercase ${task.type === "add" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-blue-50 text-blue-600 border-blue-200"}`}>
                            {task.type === "add" ? "ADD" : "UPDATE"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.budgetOverflow ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                              <AlertCircle className="w-3 h-3" /> Overflow ({task.budgetRequest})
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell><StatusBadge status={task.status} /></TableCell>
                        <TableCell className="text-xs text-slate-500">{task.submittedAt}</TableCell>
                        <TableCell>
                          {task.status === "Pending" && (
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="h-6 text-[10px] text-emerald-600 hover:bg-emerald-50">
                                <CheckSquare className="w-3 h-3 mr-0.5" /> Approve
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 text-[10px] text-red-600 hover:bg-red-50">
                                <X className="w-3 h-3 mr-0.5" /> Reject
                              </Button>
                            </div>
                          )}
                          {task.status === "Approved" && <span className="text-[10px] text-emerald-600">Reviewed by {task.reviewer}</span>}
                          {task.status === "Rejected" && <span className="text-[10px] text-red-600">Rejected by {task.reviewer}</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== REQUESTS TAB ===== */}
        <TabsContent value="requests" className="mt-4">
          <div className="space-y-4">
            {/* Active Import Batches */}
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Active Import Batches</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b-slate-200">
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Batch ID</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">File</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Total Rows</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Status</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">New</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Modified</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Missing</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Correct</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Incorrect</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeBatches.map(batch => (
                      <TableRow key={batch.id} className="border-b-slate-100">
                        <TableCell className="text-xs font-mono text-slate-700">{batch.id}</TableCell>
                        <TableCell className="text-xs text-slate-700">{batch.fileName}</TableCell>
                        <TableCell className="text-xs font-mono text-slate-700">{batch.totalRows}</TableCell>
                        <TableCell><StatusBadge status={batch.status} /></TableCell>
                        <TableCell className="text-xs font-mono text-emerald-600">{batch.newCount}</TableCell>
                        <TableCell className="text-xs font-mono text-amber-600">{batch.modifiedCount}</TableCell>
                        <TableCell className="text-xs font-mono text-red-600">{batch.missingCount}</TableCell>
                        <TableCell className="text-xs font-mono text-emerald-600">{batch.correctCount}</TableCell>
                        <TableCell className="text-xs font-mono text-red-600">{batch.incorrectCount}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-7 text-[10px] text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                            onClick={() => { setSelectedBatch(batch); setDetailTab("preview"); setDetailBatchOpen(true); }}>
                            <Eye className="w-3 h-3 mr-1" /> Detail
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
            {/* Company Onboarding Pipeline */}
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Company Onboarding Pipeline</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b-slate-200">
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Company</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Type</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Stage</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Progress</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Submitted</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {onboardingPipeline.map(ob => (
                      <TableRow key={ob.id} className="border-b-slate-100">
                        <TableCell>
                          <div>
                            <p className="text-xs font-medium text-slate-900">{ob.companyName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{ob.id}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{ob.companyType}</Badge></TableCell>
                        <TableCell className="text-xs text-slate-700">{ob.stageName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <div key={s} className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                s <= ob.stage ? "bg-emerald-500 text-white" : s === ob.stage ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                              }`}>{s <= ob.stage ? <CheckCircle2 className="w-3 h-3" /> : s}</div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">{ob.submittedAt}</TableCell>
                        <TableCell><StatusBadge status={ob.currentStage} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Completed Import Batches */}
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Completed Import Batches</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b-slate-200">
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Batch ID</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">File</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Rows</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Result</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Checked By</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Checked At</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyBatches.map(batch => (
                      <TableRow key={batch.id} className="border-b-slate-100">
                        <TableCell className="text-xs font-mono text-slate-700">{batch.id}</TableCell>
                        <TableCell className="text-xs text-slate-700">{batch.fileName}</TableCell>
                        <TableCell className="text-xs font-mono text-slate-700">{batch.totalRows}</TableCell>
                        <TableCell>
                          {batch.status === "Completed" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <CheckCircle2 className="w-3 h-3" /> {batch.newCount} new, {batch.modifiedCount} updated
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">{batch.checkerName}</TableCell>
                        <TableCell className="text-xs text-slate-500">{batch.checkedAt}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-7 text-[10px] text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                            onClick={() => { setSelectedBatch(batch); setDetailTab("preview"); setDetailBatchOpen(true); }}>
                            <Eye className="w-3 h-3 mr-1" /> Detail
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
      </Tabs>

      {/* ===== IMPORT WIZARD DIALOG ===== */}
      <Dialog open={importWizardOpen} onOpenChange={setImportWizardOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#1e3a5f] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-500" />
              Bulk Employee Import Wizard
            </DialogTitle>
          </DialogHeader>

          <WizardStepper steps={wizardSteps} current={wizardStep} />

          {/* Step 0: Upload File */}
          {wizardStep === 0 && (
            <div className="space-y-4">
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-md p-8 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">Drag & drop your employee file here</p>
                <p className="text-xs text-slate-400 mt-1">Supported: .xlsx, .xls, .csv (max 10,000 rows, 10MB)</p>
                <Button size="sm" className="mt-3 h-8 text-xs bg-[#0ea5e9] hover:bg-[#0284c7] text-white"
                  onClick={() => setWizardStep(1)}>
                  Simulate Upload (golden_harvest_batch_2026-07-12.xlsx)
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Required Columns</p>
                    <p className="text-xs text-slate-700 mt-1">employee_code, name, phone, salary</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Optional Columns</p>
                    <p className="text-xs text-slate-700 mt-1">nrc, department, branch_code, join_date</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">File Limit</p>
                    <p className="text-xs text-slate-700 mt-1">10,000 rows / 10MB</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 1: Column Mapping */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Auto-Detected Column Mapping</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">File Column</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">System Field</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Required</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Confidence</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {SAMPLE_COLUMNS.map((col, i) => (
                        <TableRow key={i} className="border-b-slate-100">
                          <TableCell className="text-xs font-medium text-slate-700">{col.fileColumn}</TableCell>
                          <TableCell>
                            <Select defaultValue={col.systemField}>
                              <SelectTrigger className="h-7 text-xs border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={col.systemField}>{col.systemField}</SelectItem>
                                <SelectItem value="employee_code">employee_code</SelectItem>
                                <SelectItem value="name">name</SelectItem>
                                <SelectItem value="phone">phone</SelectItem>
                                <SelectItem value="salary">salary</SelectItem>
                                <SelectItem value="department">department</SelectItem>
                                <SelectItem value="branch_code">branch_code</SelectItem>
                                <SelectItem value="join_date">join_date</SelectItem>
                                <SelectItem value="nrc">nrc</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[9px] font-bold uppercase ${col.required ? "bg-red-50 text-red-600 border-red-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                              {col.required ? "Required" : "Optional"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${85 + i * 2}%` }} />
                              </div>
                              <span className="text-[10px] text-emerald-600 font-bold">{85 + i * 2}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] text-[#0ea5e9]">Remap</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Data Preview */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Input placeholder="Search preview..." className="h-8 text-xs" />
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 text-xs w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rows</SelectItem>
                    <SelectItem value="new">New Only</SelectItem>
                    <SelectItem value="modified">Modified Only</SelectItem>
                    <SelectItem value="missing">Missing Only</SelectItem>
                    <SelectItem value="incorrect">Errors Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto max-h-[400px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-slate-50">
                        <TableRow className="bg-slate-50/50 border-b-slate-200">
                          <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">#</TableHead>
                          <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Category</TableHead>
                          <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Validation</TableHead>
                          <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Code</TableHead>
                          <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Name</TableHead>
                          <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Phone</TableHead>
                          <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Salary</TableHead>
                          <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Dept</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleImportRows.map(row => (
                          <TableRow key={row.id} className="border-b-slate-100">
                            <TableCell className="text-xs font-mono text-slate-500">{row.id}</TableCell>
                            <TableCell><CategoryBadge category={row.category} /></TableCell>
                            <TableCell><ValidationBadge validation={row.validation} /></TableCell>
                            <TableCell className="text-xs font-mono text-slate-700">{row.data.employee_code}</TableCell>
                            <TableCell className="text-xs text-slate-700">{row.data.name || <span className="text-red-400 italic">empty</span>}</TableCell>
                            <TableCell className="text-xs text-slate-500">{row.data.phone}</TableCell>
                            <TableCell className={`text-xs font-mono ${row.data.salary === "0" ? "text-red-600" : "text-slate-700"}`}>
                              {row.data.salary === "0" ? "0 (invalid)" : formatMMK(Number(row.data.salary))}
                            </TableCell>
                            <TableCell className="text-xs text-slate-500">{row.data.department || <span className="text-red-400 italic">empty</span>}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Validation Results */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-5 gap-3">
                <Card className="border-l-2 border-l-emerald-400">
                  <CardContent className="p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Correct</p>
                    <p className="text-lg font-bold text-emerald-600 mt-1">40</p>
                  </CardContent>
                </Card>
                <Card className="border-l-2 border-l-red-400">
                  <CardContent className="p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Incorrect</p>
                    <p className="text-lg font-bold text-red-600 mt-1">5</p>
                  </CardContent>
                </Card>
                <Card className="border-l-2 border-l-amber-400">
                  <CardContent className="p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Warnings</p>
                    <p className="text-lg font-bold text-amber-600 mt-1">3</p>
                  </CardContent>
                </Card>
                <Card className="border-l-2 border-l-emerald-400">
                  <CardContent className="p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">New</p>
                    <p className="text-lg font-bold text-emerald-600 mt-1">30</p>
                  </CardContent>
                </Card>
                <Card className="border-l-2 border-l-blue-400">
                  <CardContent className="p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Modified</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">8</p>
                  </CardContent>
                </Card>
              </div>

              {/* Error Details */}
              <Card>
                <CardHeader><CardTitle className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Incorrect Rows (5)</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-red-50/50 border-b-red-200">
                        <TableHead className="text-[8px] uppercase tracking-wider text-red-500 font-bold">Row</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-red-500 font-bold">Employee Code</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-red-500 font-bold">Name</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-red-500 font-bold">Errors</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-red-500 font-bold">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleImportRows.filter(r => r.validation === "incorrect").map(row => (
                        <TableRow key={row.id} className="border-b-red-100 bg-red-50/20">
                          <TableCell className="text-xs font-mono text-red-600">{row.id}</TableCell>
                          <TableCell className="text-xs font-mono text-slate-700">{row.data.employee_code}</TableCell>
                          <TableCell className="text-xs text-slate-700">{row.data.name || <span className="text-red-400 italic">empty</span>}</TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              {row.errors.map((e, i) => (
                                <div key={i} className="flex items-center gap-1 text-[10px] text-red-600">
                                  <XCircle className="w-3 h-3" /> {e}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] text-red-600 hover:bg-red-50">
                              <RotateCcw className="w-3 h-3 mr-0.5" /> Fix
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Warning Details */}
              <Card>
                <CardHeader><CardTitle className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">Warnings (3)</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-amber-50/50 border-b-amber-200">
                        <TableHead className="text-[8px] uppercase tracking-wider text-amber-500 font-bold">Row</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-amber-500 font-bold">Employee Code</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-amber-500 font-bold">Warnings</TableHead>
                        <TableHead className="text-[8px] uppercase tracking-wider text-amber-500 font-bold">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleImportRows.filter(r => r.warnings.length > 0).map(row => (
                        <TableRow key={row.id} className="border-b-amber-100 bg-amber-50/20">
                          <TableCell className="text-xs font-mono text-amber-600">{row.id}</TableCell>
                          <TableCell className="text-xs font-mono text-slate-700">{row.data.employee_code}</TableCell>
                          <TableCell>
                            {row.warnings.map((w, i) => (
                              <div key={i} className="flex items-center gap-1 text-[10px] text-amber-600">
                                <AlertCircle className="w-3 h-3" /> {w}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>
                            {row.category === "missing" && (
                              <Select defaultValue="freeze">
                                <SelectTrigger className="h-6 text-[10px] border-amber-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="freeze">Freeze</SelectItem>
                                  <SelectItem value="suspend">Suspend</SelectItem>
                                  <SelectItem value="ignore">Ignore</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Error Report Download */}
              <div className="flex justify-end">
                <Button size="sm" variant="outline" className="h-8 text-xs border-slate-300">
                  <FileDown className="w-3.5 h-3.5 mr-1" /> Download Error Report (.xlsx)
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Maker Submit */}
          {wizardStep === 4 && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Import Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">File:</span>
                      <span className="font-medium text-slate-900">golden_harvest_batch_2026-07-12.xlsx</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Total Rows:</span>
                      <span className="font-medium text-slate-900">45</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">New Employees:</span>
                      <span className="font-medium text-emerald-600">30</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Modified:</span>
                      <span className="font-medium text-blue-600">8</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Correct:</span>
                      <span className="font-medium text-emerald-600">40</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Incorrect:</span>
                      <span className="font-medium text-red-600">5</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <label className="text-xs font-medium text-slate-700">Maker Notes (optional)</label>
                    <Textarea placeholder="Add any notes for the checker reviewer..." className="mt-1 text-xs" rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Checker Approve */}
          {wizardStep === 5 && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Checker Review — Pending Approval</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-50 rounded-md p-3 text-xs text-slate-600">
                    <p><strong>Batch:</strong> IMP-2026-001</p>
                    <p><strong>Maker:</strong> Admin HR</p>
                    <p><strong>Submitted:</strong> 2026-07-12 10:30</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Correct rows:</span>
                      <span className="font-medium text-emerald-600">40</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Incorrect rows:</span>
                      <span className="font-medium text-red-600">5</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Missing employees:</span>
                      <span className="font-medium text-amber-600">5 (action needed)</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <label className="text-xs font-medium text-slate-700">Checker Decision</label>
                    <Select defaultValue="approve">
                      <SelectTrigger className="mt-1 h-8 text-xs border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approve">Approve</SelectItem>
                        <SelectItem value="reject">Reject</SelectItem>
                        <SelectItem value="return">Return to Maker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Comment / Rejection Reason</label>
                    <Textarea placeholder={wizardStep === 5 ? "Required if rejecting..." : "Optional comment..."} className="mt-1 text-xs" rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div>
              {wizardStep > 0 && (
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setWizardStep(wizardStep - 1)}>
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setImportWizardOpen(false)}>
                Cancel
              </Button>
              {wizardStep < 5 ? (
                <Button size="sm" className="h-8 text-xs bg-[#0ea5e9] hover:bg-[#0284c7] text-white"
                  onClick={() => setWizardStep(wizardStep + 1)}>
                  Next <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="outline" className="h-8 text-xs border-red-300 text-red-600 hover:bg-red-50">
                    <X className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                  <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setImportWizardOpen(false)}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== ADD SINGLE EMPLOYEE DIALOG ===== */}
      <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#1e3a5f] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-500" />
              Add Employee — Single Onboarding
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Personal Information */}
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Employee Code <span className="text-red-500">*</span></label>
                    <Input value={employeeForm.employee_code} onChange={e => setEmployeeForm({ ...employeeForm, employee_code: e.target.value })} placeholder="e.g., MTS-007" className="h-8 text-xs mt-0.5" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Full Name <span className="text-red-500">*</span></label>
                    <Input value={employeeForm.name} onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })} placeholder="Full name" className="h-8 text-xs mt-0.5" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Phone Number <span className="text-red-500">*</span></label>
                    <Input value={employeeForm.phone} onChange={e => setEmployeeForm({ ...employeeForm, phone: e.target.value })} placeholder="09-XXXXXXXXX" className="h-8 text-xs mt-0.5" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">NRC Number</label>
                    <Input value={employeeForm.nrc} onChange={e => setEmployeeForm({ ...employeeForm, nrc: e.target.value })} placeholder="12/NaKaTa(N)123456" className="h-8 text-xs mt-0.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Employment Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Company <span className="text-red-500">*</span></label>
                    <Select value={employeeForm.company_id} onValueChange={v => setEmployeeForm({ ...employeeForm, company_id: v })}>
                      <SelectTrigger className="h-8 text-xs mt-0.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Department</label>
                    <Input value={employeeForm.department} onChange={e => setEmployeeForm({ ...employeeForm, department: e.target.value })} placeholder="Department" className="h-8 text-xs mt-0.5" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Branch</label>
                    <Input value={employeeForm.branch_code} onChange={e => setEmployeeForm({ ...employeeForm, branch_code: e.target.value })} placeholder="Branch" className="h-8 text-xs mt-0.5" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Join Date</label>
                    <Input value={employeeForm.join_date} onChange={e => setEmployeeForm({ ...employeeForm, join_date: e.target.value })} placeholder="YYYY-MM-DD" className="h-8 text-xs mt-0.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payroll & Budget */}
            <Card>
              <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Payroll & Budget</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-slate-600">Monthly Salary (MMK) <span className="text-red-500">*</span></label>
                    <Input value={employeeForm.salary} onChange={e => setEmployeeForm({ ...employeeForm, salary: e.target.value })} placeholder="e.g., 500000" className="h-8 text-xs mt-0.5" />
                  </div>
                </div>
                {employeeForm.salary && Number(employeeForm.salary) > 0 && (
                  <div className="bg-teal-50 border border-teal-200 rounded-md p-3">
                    <p className="text-xs font-medium text-teal-700">Auto-Calculated EWA Cap</p>
                    <p className="text-sm font-bold text-teal-800 mt-0.5">{formatMMK(Math.round(Number(employeeForm.salary) * 0.5))}</p>
                    <p className="text-[10px] text-teal-500 mt-0.5">50% of monthly salary</p>
                  </div>
                )}
                {employeeForm.salary && Number(employeeForm.salary) > 800000 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <p className="text-xs text-amber-700">Budget overflow detected — this will trigger an automatic Budget Request for approval</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setAddEmployeeOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="h-8 text-xs bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
              <UserCheck className="w-3.5 h-3.5 mr-1" /> Submit for Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== BATCH DETAIL SHEET ===== */}
      <Sheet open={detailBatchOpen} onOpenChange={setDetailBatchOpen}>
        <SheetContent side="right" className="w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base font-bold text-[#1e3a5f] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-500" />
              Import Batch: {selectedBatch?.id}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-4">
            {/* Batch Info */}
            <div className="bg-slate-50 rounded-md p-3 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">File:</span><span className="font-medium">{selectedBatch?.fileName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Uploaded by:</span><span className="font-medium">{selectedBatch?.uploadedBy}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Uploaded at:</span><span className="font-medium">{selectedBatch?.uploadedAt}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status:</span><StatusBadge status={selectedBatch?.status || ""} /></div>
              {selectedBatch?.checkerName && <div className="flex justify-between"><span className="text-slate-500">Checked by:</span><span className="font-medium">{selectedBatch.checkerName}</span></div>}
              {selectedBatch?.checkedAt && <div className="flex justify-between"><span className="text-slate-500">Checked at:</span><span className="font-medium">{selectedBatch.checkedAt}</span></div>}
              {selectedBatch?.rejectReason && <div className="mt-2 p-2 bg-red-50 rounded text-red-700"><span className="font-bold">Rejection:</span> {selectedBatch.rejectReason}</div>}
            </div>

            {/* Row Summary */}
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-center">
                <p className="text-[9px] text-emerald-600 font-bold uppercase">New</p>
                <p className="text-sm font-bold text-emerald-700">{selectedBatch?.newCount}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
                <p className="text-[9px] text-blue-600 font-bold uppercase">Modified</p>
                <p className="text-sm font-bold text-blue-700">{selectedBatch?.modifiedCount}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-center">
                <p className="text-[9px] text-amber-600 font-bold uppercase">Missing</p>
                <p className="text-sm font-bold text-amber-700">{selectedBatch?.missingCount}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-center">
                <p className="text-[9px] text-emerald-600 font-bold uppercase">Correct</p>
                <p className="text-sm font-bold text-emerald-700">{selectedBatch?.correctCount}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
                <p className="text-[9px] text-red-600 font-bold uppercase">Incorrect</p>
                <p className="text-sm font-bold text-red-700">{selectedBatch?.incorrectCount}</p>
              </div>
            </div>

            {/* Column Mapping */}
            <Card>
              <CardHeader><CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Column Mapping</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">File Column</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">System Field</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Required</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBatch?.columnMapping.map((col, i) => (
                      <TableRow key={i} className="border-b-slate-100">
                        <TableCell className="text-xs text-slate-700">{col.fileColumn}</TableCell>
                        <TableCell className="text-xs font-mono text-teal-600">{col.systemField}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[9px] ${col.required ? "bg-red-50 text-red-600 border-red-200" : "bg-slate-50 text-slate-400"}`}>
                            {col.required ? "Y" : "N"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Sample Rows */}
            <Card>
              <CardHeader><CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sample Rows (Preview)</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">#</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Category</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Validation</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Code</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Name</TableHead>
                      <TableHead className="text-[8px] uppercase tracking-wider text-[#5a6b7c] font-bold">Salary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleImportRows.map(row => (
                      <TableRow key={row.id} className="border-b-slate-100">
                        <TableCell className="text-xs font-mono text-slate-500">{row.id}</TableCell>
                        <TableCell><CategoryBadge category={row.category} /></TableCell>
                        <TableCell><ValidationBadge validation={row.validation} /></TableCell>
                        <TableCell className="text-xs font-mono text-slate-700">{row.data.employee_code}</TableCell>
                        <TableCell className="text-xs text-slate-700">{row.data.name || <span className="text-red-400">—</span>}</TableCell>
                        <TableCell className="text-xs font-mono text-slate-700">{formatMMK(Number(row.data.salary) || 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
