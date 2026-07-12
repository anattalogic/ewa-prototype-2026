/**
 * EmployeeGroupsPage — Employee Group & Category Management
 * Group-level policies, category-based fee rules, budget allocation by group
 * Design: Enterprise Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Eye, Settings, Tag, Building2, FileSpreadsheet, ShieldCheck } from "lucide-react";

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "MMK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

interface EmployeeGroup {
  id: string;
  code: string;
  name: string;
  description: string;
  companyId: string;
  companyName: string;
  category: string;
  employeeCount: number;
  ewaPercentage: number;
  budgetAllocation: number;
  budgetUtilized: number;
  feeTierOverride: string | null;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
}

const employeeGroups: EmployeeGroup[] = [
  { id: "EG-001", code: "MGMT", name: "Management Tier", description: "Senior management and directors", companyId: "CMP-001", companyName: "Tech Solutions Ltd", category: "Senior Management", employeeCount: 12, ewaPercentage: 50, budgetAllocation: 5000000, budgetUtilized: 2100000, feeTierOverride: "FT-002", status: "ACTIVE" },
  { id: "EG-002", code: "ENG", name: "Engineering Staff", description: "Software engineers and technical staff", companyId: "CMP-001", companyName: "Tech Solutions Ltd", category: "Engineering", employeeCount: 45, ewaPercentage: 40, budgetAllocation: 12000000, budgetUtilized: 5800000, feeTierOverride: "FT-001", status: "ACTIVE" },
  { id: "EG-003", code: "OPS", name: "Operations Staff", description: "Daily operations and support personnel", companyId: "CMP-001", companyName: "Tech Solutions Ltd", category: "Operations", employeeCount: 30, ewaPercentage: 35, budgetAllocation: 6000000, budgetUtilized: 2400000, feeTierOverride: "FT-001", status: "ACTIVE" },
  { id: "EG-004", code: "MFG-SR", name: "Manufacturing Senior", description: "Production supervisors and line leads", companyId: "CMP-002", companyName: "Manufacturing Co", category: "Manufacturing", employeeCount: 20, ewaPercentage: 35, budgetAllocation: 4000000, budgetUtilized: 1800000, feeTierOverride: "FT-001", status: "ACTIVE" },
  { id: "EG-005", code: "MFG-OP", name: "Manufacturing Operators", description: "Production line operators and workers", companyId: "CMP-002", companyName: "Manufacturing Co", category: "Manufacturing", employeeCount: 85, ewaPercentage: 30, budgetAllocation: 10000000, budgetUtilized: 4200000, feeTierOverride: "FT-001", status: "ACTIVE" },
  { id: "EG-006", code: "LOG-DRV", name: "Logistics Drivers", description: "Fleet drivers and delivery personnel", companyId: "CMP-003", companyName: "Logistics Myanmar", category: "Logistics", employeeCount: 50, ewaPercentage: 30, budgetAllocation: 7500000, budgetUtilized: 3100000, feeTierOverride: "FT-001", status: "ACTIVE" },
  { id: "EG-007", code: "RTL-STAFF", name: "Retail Staff", description: "Store employees and cashiers", companyId: "CMP-004", companyName: "Retail Chain", category: "Retail", employeeCount: 120, ewaPercentage: 25, budgetAllocation: 15000000, budgetUtilized: 6200000, feeTierOverride: "FT-001", status: "ACTIVE" },
  { id: "EG-008", code: "TRY", name: "Trial Group", description: "New company trial period group", companyId: "CMP-005", companyName: "Startup Inc", category: "Trial", employeeCount: 5, ewaPercentage: 20, budgetAllocation: 500000, budgetUtilized: 0,     feeTierOverride: "NONE", status: "DRAFT" },
];

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export function EmployeeGroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<EmployeeGroup | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-500" />
          Employee Groups & Categories
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Group-level EWA policies · Category-based fee rules · Budget allocation by group · Fee tier overrides</p>
      </div>

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="bg-slate-100/50">
          <TabsTrigger value="groups" className="text-[10px]">Group Registry</TabsTrigger>
          <TabsTrigger value="detail" className="text-[10px]">Group Detail</TabsTrigger>
          <TabsTrigger value="policies" className="text-[10px]">Group Policies</TabsTrigger>
          <TabsTrigger value="categories" className="text-[10px]">Categories</TabsTrigger>
        </TabsList>

        {/* GROUP REGISTRY TAB */}
        <TabsContent value="groups" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Employee Group Registry</CardTitle>
                <Button size="sm" className="h-7 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Group
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Code</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Name</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Company</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Employees</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Category</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">EWA %</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Budget</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fee Override</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeGroups.map(g => {
                    const utilization = Math.round((g.budgetUtilized / g.budgetAllocation) * 100);
                    return (
                      <TableRow key={g.id} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                        <TableCell className="text-[10px] font-mono font-bold text-[#1e3a5f]">{g.id}</TableCell>
                        <TableCell className="text-xs font-mono font-semibold text-slate-700">{g.code}</TableCell>
                        <TableCell>
                          <p className="text-xs font-medium text-slate-900">{g.name}</p>
                          <p className="text-[9px] text-slate-400">{g.description}</p>
                        </TableCell>
                        <TableCell className="text-[10px] text-slate-600">{g.companyName}</TableCell>
                        <TableCell className="text-center text-xs font-mono font-bold text-slate-700">{g.employeeCount}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[8px] bg-slate-50 text-slate-600 border-slate-200">{g.category}</Badge></TableCell>
                        <TableCell className="text-xs font-mono font-bold text-blue-600 text-right">{g.ewaPercentage}%</TableCell>
                        <TableCell>
                          <div className="text-right">
                            <p className="text-xs font-mono font-bold text-slate-700">{formatMMK(g.budgetAllocation)}</p>
                            <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                              <div className={`h-1 rounded-full ${utilization > 80 ? "bg-red-400" : utilization > 50 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${utilization}%` }} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[10px] font-mono text-slate-500">{g.feeTierOverride || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[9px] font-bold uppercase ${g.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>{g.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-7 text-[10px] font-medium text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                            onClick={() => setSelectedGroup(g)}>
                            <Eye className="w-3 h-3 mr-1" /> Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GROUP DETAIL TAB */}
        <TabsContent value="detail" className="mt-4">
          {selectedGroup ? (
            <div className="space-y-4">
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-500" />
                    {selectedGroup.code} — {selectedGroup.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] bg-slate-50 text-slate-600 border-slate-200">{selectedGroup.category}</Badge>
                    <Badge variant="outline" className={`text-[9px] font-bold uppercase ${selectedGroup.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>{selectedGroup.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Employee Count</p>
                    <p className="text-lg font-bold text-[#1e3a5f]">{selectedGroup.employeeCount}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">EWA Percentage</p>
                    <p className="text-lg font-bold text-blue-600">{selectedGroup.ewaPercentage}%</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Budget Allocation</p>
                    <p className="text-lg font-mono font-bold text-[#1e3a5f]">{formatMMK(selectedGroup.budgetAllocation)}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Budget Utilized</p>
                    <p className="text-lg font-mono font-bold text-emerald-600">{formatMMK(selectedGroup.budgetUtilized)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Budget Utilization</p>
                    <div className="p-3 bg-white rounded-sm border border-slate-100">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-500">Utilized</span>
                        <span className="font-mono text-slate-700">{Math.round((selectedGroup.budgetUtilized / selectedGroup.budgetAllocation) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div className="h-3 rounded-full bg-teal-500" style={{ width: `${Math.round((selectedGroup.budgetUtilized / selectedGroup.budgetAllocation) * 100)}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[9px] mt-1">
                        <span className="text-slate-400">Remaining: {formatMMK(selectedGroup.budgetAllocation - selectedGroup.budgetUtilized)}</span>
                        <span className="text-slate-400">Total: {formatMMK(selectedGroup.budgetAllocation)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fee Tier Override</p>
                    <div className="p-3 bg-white rounded-sm border border-slate-100">
                      <p className="text-sm font-mono font-bold text-slate-700">{selectedGroup.feeTierOverride || "Default (inherited from Company)"}</p>
                      <p className="text-[10px] text-slate-400 mt-1">All employees in this group will use this fee tier for disbursement calculations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Select an employee group to view details</p>
            </div>
          )}
        </TabsContent>

        {/* POLICIES TAB */}
        <TabsContent value="policies" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Group Policy Configuration</CardTitle>
                <Button size="sm" className="h-7 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                  <Settings className="w-3.5 h-3.5 mr-1" /> Configure
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Group</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">EWA Cap %</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Daily Limit</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Cycle Limit</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fee Tier</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Repayment</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeGroups.filter(g => g.status === "ACTIVE").map(g => (
                    <TableRow key={g.id} className="border-b-slate-100">
                      <TableCell>
                        <p className="text-xs font-medium text-slate-700">{g.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{g.code}</p>
                      </TableCell>
                      <TableCell className="text-center text-xs font-mono font-bold text-blue-600">{g.ewaPercentage}%</TableCell>
                      <TableCell className="text-center text-xs font-mono text-slate-600">{formatMMK(Math.round(g.budgetAllocation / g.employeeCount * 0.1))}</TableCell>
                      <TableCell className="text-center text-xs font-mono text-slate-600">{formatMMK(Math.round(g.budgetAllocation / g.employeeCount))}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{g.feeTierOverride || "Default"}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="text-[8px] bg-emerald-50 text-emerald-600 border-emerald-200">Auto</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-600 border-emerald-200">Active</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CATEGORIES TAB */}
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Employee Categories</CardTitle>
                <Button size="sm" className="h-7 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                  <Tag className="w-3.5 h-3.5 mr-1" /> Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Category</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Groups</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Total Employees</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Total Budget</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">Utilized</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Avg EWA %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["Senior Management", "Engineering", "Operations", "Manufacturing", "Logistics", "Retail", "Trial"].map(cat => {
                    const groups = employeeGroups.filter(g => g.category === cat);
                    const totalEmp = groups.reduce((s, g) => s + g.employeeCount, 0);
                    const totalBudget = groups.reduce((s, g) => s + g.budgetAllocation, 0);
                    const totalUtilized = groups.reduce((s, g) => s + g.budgetUtilized, 0);
                    const avgEwa = Math.round(groups.reduce((s, g) => s + g.ewaPercentage, 0) / (groups.length || 1));
                    return (
                      <TableRow key={cat} className="border-b-slate-100">
                        <TableCell className="text-xs font-medium text-slate-700">{cat}</TableCell>
                        <TableCell className="text-center text-xs font-mono text-slate-500">{groups.length}</TableCell>
                        <TableCell className="text-center text-xs font-mono font-bold text-slate-700">{totalEmp}</TableCell>
                        <TableCell className="text-center text-xs font-mono text-slate-600">{formatMMK(totalBudget)}</TableCell>
                        <TableCell className="text-center text-xs font-mono text-slate-600">{formatMMK(totalUtilized)}</TableCell>
                        <TableCell className="text-right text-xs font-mono font-bold text-blue-600">{avgEwa}%</TableCell>
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
