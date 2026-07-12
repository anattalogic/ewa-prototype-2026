/**
 * AdminPage — Platform Admin Configuration
 * Design: Neobrutalist Fintech — System configuration, role management, policies, and audit log
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMMK } from "@/data/mockData";
import { Settings, Users, Lock, FileText, ShieldCheck, Key, Globe } from "lucide-react";
import { useState } from "react";

const viewTypes = [
  { id: "HR", label: "HR", description: "Employee lifecycle, onboarding, payroll oversight", modules: ["Dashboard", "Employees", "Onboarding", "Payroll", "Reports"] },
  { id: "Sales", label: "Sales", description: "Corporate portfolio, revenue, client health", modules: ["Dashboard", "Onboarding", "Companies", "Budget", "Reports"] },
  { id: "Operations", label: "Operations", description: "Daily operations, disbursements, settlements", modules: ["Dashboard", "Employees", "Transactions", "Repayment", "Settlement", "Reports"] },
  { id: "Back Office", label: "Back Office", description: "Transaction processing, verification, reconciliation", modules: ["Dashboard", "Transactions", "Repayment", "Settlement", "Errors", "Workflow"] },
  { id: "Finance", label: "Finance", description: "GL ledger, accounting entries, financial health", modules: ["Dashboard", "Circle Ledger", "Fee Builder", "Reports", "Repayment"] },
  { id: "Risk", label: "Risk", description: "Credit risk, compliance, fraud detection", modules: ["Dashboard", "Risk", "Write-Off", "Reports"] },
  { id: "Platform Admin", label: "Platform Admin", description: "System configuration, policies, platform health", modules: ["All Modules"] },
];

const auditLog = [
  { id: "AUD-001", action: "Policy Updated", user: "Finance Manager", module: "Fee Builder", timestamp: "2026-07-12 10:30", details: "Late fee rate changed from 0.1% to 0.15% for Skyline Trading" },
  { id: "AUD-002", action: "Employee Verified", user: "Operations Lead", module: "Employees", timestamp: "2026-07-12 09:45", details: "Htet Oo Kyaw — Employment verified and EWA auto-approved" },
  { id: "AUD-003", action: "Budget Allocated", user: "Sales Manager", module: "Budget", timestamp: "2026-07-12 08:00", details: "Golden Harvest Foods budget increased to 15,000,000 MMK" },
  { id: "AUD-004", action: "Company Onboarded", user: "Back Office", module: "Onboarding", timestamp: "2026-07-11 16:00", details: "Golden Harvest Foods moved to ACTIVE status" },
  { id: "AUD-005", action: "Risk Assessment", user: "Risk Analyst", module: "Risk", timestamp: "2026-07-11 14:00", details: "Skyline Trading credit score recalculated to 78" },
];

export function AdminPage() {
  const [enabledModules, setEnabledModules] = useState<string[]>([
    "dashboard", "employees", "onboarding", "transactions", "repayment",
    "circle-ledger", "fee-builder", "budget", "risk", "reports",
    "settlement", "payroll", "workflow", "writeoff", "form-creator", "notifications",
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Platform Admin Configuration</h1>
        <p className="text-sm text-slate-500 mt-0.5">System configuration, role management, module toggles, and audit log</p>
      </div>

      <Tabs defaultValue="modules">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="modules" className="text-sm"><Settings className="w-3.5 h-3.5 mr-1" /> Modules</TabsTrigger>
          <TabsTrigger value="roles" className="text-sm"><Users className="w-3.5 h-3.5 mr-1" /> View Types</TabsTrigger>
          <TabsTrigger value="audit" className="text-sm"><FileText className="w-3.5 h-3.5 mr-1" /> Audit Log</TabsTrigger>
          <TabsTrigger value="system" className="text-sm"><Globe className="w-3.5 h-3.5 mr-1" /> System</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <Card className="mt-3">
            <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Module Toggle</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: "dashboard", label: "Dashboard", desc: "KPI hub with role-adaptive metrics" },
                  { key: "employees", label: "Employee Management", desc: "Employee lifecycle and verification" },
                  { key: "onboarding", label: "Company Onboarding", desc: "Pipeline from submitted to active" },
                  { key: "transactions", label: "Transaction Monitor", desc: "Full transaction lifecycle" },
                  { key: "repayment", label: "Repayment & Settlement", desc: "Workflow and maker-checker" },
                  { key: "circle-ledger", label: "Circle Ledger (GL)", desc: "Double-entry accounting" },
                  { key: "fee-builder", label: "Fee Builder", desc: "Policy configuration per company" },
                  { key: "budget", label: "Budget Management", desc: "Allocation and utilization" },
                  { key: "risk", label: "Risk & Backoffice", desc: "Credit scoring and fraud detection" },
                  { key: "reports", label: "Reports Center", desc: "Financial statements and audit trail" },
                  { key: "settlement", label: "Settlement Verification", desc: "Maker-checker protocol" },
                  { key: "payroll", label: "Payroll & Deduction", desc: "Deduction tracking and reconciliation" },
                  { key: "workflow", label: "Workflow Engine", desc: "Case management and SLA" },
                  { key: "writeoff", label: "Write-Off", desc: "Loss provision management" },
                  { key: "form-creator", label: "Form Builder", desc: "EWA request form templates" },
                  { key: "notifications", label: "Notifications", desc: "Multi-channel notifications" },
                ].map(mod => (
                  <div key={mod.key} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <Switch checked={enabledModules.includes(mod.key)} onCheckedChange={(checked) => {
                      if (checked) setEnabledModules([...enabledModules, mod.key]);
                      else setEnabledModules(enabledModules.filter(k => k !== mod.key));
                    }} className="mt-1" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{mod.label}</p>
                      <p className="text-xs text-slate-400">{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="mt-3">
            <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">View Type Configuration</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">View Type</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Description</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Accessible Modules</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewTypes.map(vt => (
                    <TableRow key={vt.id} className="hover:bg-slate-50/80">
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-bold bg-[#1e3a5f] text-white border-[#1e3a5f]">{vt.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{vt.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {vt.modules.map(m => (
                            <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{m}</span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="mt-3">
            <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Audit Trail</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Log ID</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Action</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">User</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Module</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Details</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog.map(a => (
                    <TableRow key={a.id} className="hover:bg-slate-50/80">
                      <TableCell className="text-sm font-mono text-slate-600">{a.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">{a.action}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-700">{a.user}</TableCell>
                      <TableCell className="text-sm text-slate-600">{a.module}</TableCell>
                      <TableCell className="text-sm text-slate-500 max-w-[250px] truncate">{a.details}</TableCell>
                      <TableCell className="text-xs text-slate-400 font-mono">{a.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="mt-3">
            <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">System Configuration</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-[#0ea5e9]" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Maker-Checker Enforcement</p>
                      <p className="text-xs text-slate-400">Require two-person approval for settlements and write-offs</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Auto Approval for Trusted Employees</p>
                      <p className="text-xs text-slate-400">Skip manual review for employees with both verifications passed</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Key className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Late Fee Auto-Calculation</p>
                      <p className="text-xs text-slate-400">Automatically calculate late fees based on configured slab rates</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Currency: MMK (Myanmar Kyat)</p>
                      <p className="text-xs text-slate-400">Platform default currency for all transactions</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Locked</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
