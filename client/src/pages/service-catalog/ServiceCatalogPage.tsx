/**
 * ServiceCatalogPage — Transaction Types, Service Classification (txn/non-txn/cos), Fee/Discount Mapping
 * Design: Enterprise Fintech — Deep Navy (#1e3a5f) + Teal (#0ea5e9)
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Layers, ArrowRightLeft, Percent, Tag, Users, Link, Plus, Eye, Filter } from "lucide-react";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

type ServiceType = "TXN" | "NON_TXN" | "COS";
type FeeMappingType = "PERCENT" | "FLAT" | "TIERED";
type EntityRole = "SENDER" | "RECEIVER" | "AGGREGATOR" | "DEPOSITOR" | "BENEFICIARY";

interface Service {
  id: string;
  code: string;
  name: string;
  description: string;
  serviceType: ServiceType;
  glPosting: boolean;
  category: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  feeMappings: FeeMapping[];
  applicableTo: EntityRole[];
}

interface FeeMapping {
  id: string;
  feeName: string;
  feeCode: string;
  feeType: FeeMappingType;
  value: number;
  discountId: string | null;
  aggregator: string | null;
}

const services: Service[] = [
  { id: "SVC-001", code: "EWA_DISBURSE", name: "EWA Disbursement", description: "Employee wage advance disbursement to bank/wallet", serviceType: "TXN", glPosting: true, category: "Disbursement", status: "ACTIVE", feeMappings: [
    { id: "FM-001", feeName: "Service Fee", feeCode: "FEE-SVC-001", feeType: "PERCENT", value: 1.5, discountId: "DISC-001", aggregator: "AGG-KBZ" },
    { id: "FM-002", feeName: "Bank Charge", feeCode: "FEE-BANK-001", feeType: "FLAT", value: 1500, discountId: null, aggregator: null },
  ], applicableTo: ["SENDER", "RECEIVER", "DEPOSITOR", "BENEFICIARY"] },
  { id: "SVC-002", code: "EWA_REPAYMENT", name: "EWA Repayment", description: "Payroll deduction repayment processing", serviceType: "TXN", glPosting: true, category: "Repayment", status: "ACTIVE", feeMappings: [
    { id: "FM-003", feeName: "Processing Fee", feeCode: "FEE-SVC-002", feeType: "PERCENT", value: 0.5, discountId: null, aggregator: null },
  ], applicableTo: ["SENDER", "RECEIVER"] },
  { id: "SVC-003", code: "CORP_ONBOARD", name: "Corporate Onboarding", description: "Company registration and KYC process", serviceType: "NON_TXN", glPosting: false, category: "Onboarding", status: "ACTIVE", feeMappings: [
    { id: "FM-004", feeName: "Setup Fee", feeCode: "FEE-SETUP-001", feeType: "FLAT", value: 50000, discountId: "DISC-002", aggregator: null },
  ], applicableTo: ["SENDER"] },
  { id: "SVC-004", code: "EMP_ONBOARD", name: "Employee Onboarding", description: "Employee registration, verification, and budget allocation", serviceType: "NON_TXN", glPosting: false, category: "Onboarding", status: "ACTIVE", feeMappings: [], applicableTo: ["RECEIVER"] },
  { id: "SVC-005", code: "CASHOUT_OTC", name: "OTC Cash Out", description: "Agent-based cash withdrawal at authorized locations", serviceType: "TXN", glPosting: true, category: "Cash Out", status: "ACTIVE", feeMappings: [
    { id: "FM-005", feeName: "Agent Commission", feeCode: "FEE-AGT-001", feeType: "PERCENT", value: 2.0, discountId: null, aggregator: "AGG-OTC" },
  ], applicableTo: ["SENDER", "RECEIVER", "AGGREGATOR"] },
  { id: "SVC-006", code: "BUDGET_ALLOC", name: "Budget Allocation", description: "Company budget creation and allocation to departments/groups", serviceType: "COS", glPosting: false, category: "Budget", status: "ACTIVE", feeMappings: [], applicableTo: ["SENDER"] },
  { id: "SVC-007", code: "SETTLEMENT_VERIFY", name: "Settlement Verification", description: "Maker-checker verification of settlement batches", serviceType: "TXN", glPosting: true, category: "Settlement", status: "ACTIVE", feeMappings: [
    { id: "FM-006", feeName: "Verification Fee", feeCode: "FEE-VER-001", feeType: "FLAT", value: 500, discountId: null, aggregator: null },
  ], applicableTo: ["SENDER", "RECEIVER"] },
  { id: "SVC-008", code: "WRITE_OFF", name: "Write-Off Processing", description: "Loss provisioning and write-off approval workflow", serviceType: "TXN", glPosting: true, category: "Write-Off", status: "ACTIVE", feeMappings: [], applicableTo: ["SENDER"] },
];

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export function ServiceCatalogPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-500" />
          Service Catalog
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Service classification (TXN/NON-TXN/COS) · Fee & discount mapping · Entity role assignment · Aggregator sharing</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-2">
        <KpiCard label="Total Services" value={String(services.length)} color="border-t-[#1e3a5f]" />
        <KpiCard label="Transaction (TXN)" value={String(services.filter(s => s.serviceType === "TXN").length)} color="border-t-blue-500" />
        <KpiCard label="Non-Transaction" value={String(services.filter(s => s.serviceType === "NON_TXN").length)} color="border-t-amber-500" />
        <KpiCard label="Configuration (COS)" value={String(services.filter(s => s.serviceType === "COS").length)} color="border-t-purple-500" />
        <KpiCard label="Active" value={String(services.filter(s => s.status === "ACTIVE").length)} color="border-t-emerald-500" />
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="bg-slate-100/50">
          <TabsTrigger value="catalog" className="text-[10px]">Service Registry</TabsTrigger>
          <TabsTrigger value="detail" className="text-[10px]">Service Detail</TabsTrigger>
          <TabsTrigger value="fee-map" className="text-[10px]">Fee Mapping</TabsTrigger>
          <TabsTrigger value="roles" className="text-[10px]">Entity Roles</TabsTrigger>
        </TabsList>

        {/* CATALOG TAB */}
        <TabsContent value="catalog" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Service Registry</CardTitle>
                <Button size="sm" className="h-7 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Service
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
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Type</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">GL Post</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Category</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fee Mappings</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map(s => (
                    <TableRow key={s.id} className="hover:bg-slate-50/80 border-b-slate-100 transition-colors">
                      <TableCell className="text-[10px] font-mono font-bold text-[#1e3a5f]">{s.id}</TableCell>
                      <TableCell className="text-xs font-mono font-semibold text-slate-700">{s.code}</TableCell>
                      <TableCell>
                        <p className="text-xs font-medium text-slate-900">{s.name}</p>
                        <p className="text-[9px] text-slate-400">{s.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[9px] font-bold uppercase ${
                          s.serviceType === "TXN" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          s.serviceType === "NON_TXN" ? "bg-amber-50 text-amber-600 border-amber-200" :
                          "bg-purple-50 text-purple-600 border-purple-200"
                        }`}>{s.serviceType}</Badge>
                      </TableCell>
                      <TableCell>
                        {s.glPosting ? (
                          <Badge variant="outline" className="text-[8px] bg-emerald-50 text-emerald-600 border-emerald-200">YES</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[8px] bg-slate-50 text-slate-400 border-slate-200">NO</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-[10px] text-slate-600">{s.category}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{s.feeMappings.length}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[9px] font-bold uppercase ${
                          s.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          s.status === "DRAFT" ? "bg-slate-50 text-slate-500 border-slate-200" :
                          "bg-red-50 text-red-600 border-red-200"
                        }`}>{s.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] font-medium text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                          onClick={() => setSelectedService(s)}>
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

        {/* SERVICE DETAIL TAB */}
        <TabsContent value="detail" className="mt-4">
          {selectedService ? (
            <div className="space-y-4">
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1e3a5f] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-500" />
                    {selectedService.code} — {selectedService.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[9px] font-bold uppercase ${
                      selectedService.serviceType === "TXN" ? "bg-blue-50 text-blue-600 border-blue-200" :
                      selectedService.serviceType === "NON_TXN" ? "bg-amber-50 text-amber-600 border-amber-200" :
                      "bg-purple-50 text-purple-600 border-purple-200"
                    }`}>{selectedService.serviceType}</Badge>
                    <Badge variant="outline" className={`text-[9px] font-bold uppercase ${selectedService.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>{selectedService.status}</Badge>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4">{selectedService.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">GL Posting</p>
                    <p className="text-sm font-bold text-slate-700">{selectedService.glPosting ? "Yes — Hits Circle Ledger" : "No — Configuration Only"}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Category</p>
                    <p className="text-sm font-medium text-slate-700">{selectedService.category}</p>
                  </div>
                  <div className="p-3 bg-white rounded-sm border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Fee Mappings</p>
                    <p className="text-sm font-mono font-bold text-[#1e3a5f]">{selectedService.feeMappings.length}</p>
                  </div>
                </div>

                {/* Fee Mappings */}
                {selectedService.feeMappings.length > 0 ? (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fee & Discount Mappings</p>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/50">
                          <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Fee Code</TableHead>
                          <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Fee Name</TableHead>
                          <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Type</TableHead>
                          <TableHead className="text-[9px] uppercase text-slate-500 font-bold text-right">Value</TableHead>
                          <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Discount</TableHead>
                          <TableHead className="text-[9px] uppercase text-slate-500 font-bold">Aggregator</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedService.feeMappings.map(fm => (
                          <TableRow key={fm.id} className="border-b-slate-100">
                            <TableCell className="text-[10px] font-mono text-slate-700">{fm.feeCode}</TableCell>
                            <TableCell className="text-[10px] font-medium text-slate-700">{fm.feeName}</TableCell>
                            <TableCell><Badge variant="outline" className={`text-[8px] font-bold ${fm.feeType === "PERCENT" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>{fm.feeType}</Badge></TableCell>
                            <TableCell className="text-[10px] font-mono text-right font-bold text-amber-600">{fm.feeType === "PERCENT" ? fm.value + "%" : formatMMK(fm.value)}</TableCell>
                            <TableCell className="text-[10px] font-mono text-slate-500">{fm.discountId || "—"}</TableCell>
                            <TableCell className="text-[10px] font-mono text-slate-500">{fm.aggregator || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 text-center">
                    <p className="text-xs text-slate-400">No fee mappings configured for this service</p>
                  </div>
                )}

                {/* Entity Roles */}
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Applicable Entity Roles</p>
                  <div className="flex items-center gap-2">
                    {selectedService.applicableTo.map(role => (
                      <Badge key={role} variant="outline" className={`text-[9px] font-bold uppercase ${
                        role === "SENDER" ? "bg-blue-50 text-blue-600 border-blue-200" :
                        role === "RECEIVER" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        role === "AGGREGATOR" ? "bg-purple-50 text-purple-600 border-purple-200" :
                        role === "DEPOSITOR" ? "bg-amber-50 text-amber-600 border-amber-200" :
                        "bg-teal-50 text-teal-600 border-teal-200"
                      }`}>{role}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Layers className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Select a service to view fee mappings and entity roles</p>
            </div>
          )}
        </TabsContent>

        {/* FEE MAPPING TAB */}
        <TabsContent value="fee-map" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Global Fee Mapping Matrix</CardTitle>
                <Button size="sm" className="h-7 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Mapping
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fee Code</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fee Name</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Service</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Type</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-right">Value</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Discount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Aggregator</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Sender/Receiver</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.flatMap(s => s.feeMappings.map(fm => ({ ...fm, serviceName: s.name, serviceCode: s.code }))).map(fm => (
                    <TableRow key={fm.id} className="border-b-slate-100">
                      <TableCell className="text-[10px] font-mono text-slate-700">{fm.feeCode}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-700">{fm.feeName}</TableCell>
                      <TableCell className="text-[10px] text-slate-500">{fm.serviceName} ({fm.serviceCode})</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[8px] font-bold ${fm.feeType === "PERCENT" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>{fm.feeType}</Badge></TableCell>
                      <TableCell className="text-[10px] font-mono text-right font-bold text-amber-600">{fm.feeType === "PERCENT" ? fm.value + "%" : formatMMK(fm.value)}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{fm.discountId || "—"}</TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">{fm.aggregator || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-[8px] bg-blue-50 text-blue-600 border-blue-200">SENDER</Badge>
                          <Badge variant="outline" className="text-[8px] bg-emerald-50 text-emerald-600 border-emerald-200">RECEIVER</Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ENTITY ROLES TAB */}
        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Entity Role Assignment Matrix</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-b-slate-200">
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Service</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">SENDER</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">RECEIVER</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">AGGREGATOR</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">DEPOSITOR</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center">BENEFICIARY</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fee Sharing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map(s => (
                    <TableRow key={s.id} className="border-b-slate-100">
                      <TableCell>
                        <p className="text-xs font-medium text-slate-700">{s.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{s.code}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        {s.applicableTo.includes("SENDER") ? <Badge variant="outline" className="text-[8px] bg-blue-50 text-blue-600 border-blue-200">YES</Badge> : <span className="text-slate-300 text-[10px]">—</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {s.applicableTo.includes("RECEIVER") ? <Badge variant="outline" className="text-[8px] bg-emerald-50 text-emerald-600 border-emerald-200">YES</Badge> : <span className="text-slate-300 text-[10px]">—</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {s.applicableTo.includes("AGGREGATOR") ? <Badge variant="outline" className="text-[8px] bg-purple-50 text-purple-600 border-purple-200">YES</Badge> : <span className="text-slate-300 text-[10px]">—</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {s.applicableTo.includes("DEPOSITOR") ? <Badge variant="outline" className="text-[8px] bg-amber-50 text-amber-600 border-amber-200">YES</Badge> : <span className="text-slate-300 text-[10px]">—</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {s.applicableTo.includes("BENEFICIARY") ? <Badge variant="outline" className="text-[8px] bg-teal-50 text-teal-600 border-teal-200">YES</Badge> : <span className="text-slate-300 text-[10px]">—</span>}
                      </TableCell>
                      <TableCell className="text-[10px] font-mono text-slate-500">
                        {s.feeMappings.filter(fm => fm.aggregator).length > 0 ? "Aggregator split" : "Direct"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={"p-3 bg-white rounded-sm border border-slate-100 " + color + " border-t-2"}>
      <p className="text-lg font-bold text-[#1e3a5f] font-mono">{value}</p>
      <p className="text-[8px] text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "MMK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}
