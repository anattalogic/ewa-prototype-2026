/**
 * FormCreatorPage — Form Builder for EWA Requests
 * Design: Neobrutalist Fintech — Dynamic form fields, conditional logic, and template management
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Copy, Trash2, GripVertical } from "lucide-react";

const formTemplates = [
  { id: "FT-001", name: "Standard EWA Request", description: "Basic employee EWA request form with amount, reason, and payout method", status: "Active", fields: 6, version: "2.1" },
  { id: "FT-002", name: "Advanced EWA Request", description: "Detailed request with document upload, multi-level approval, and custom fields", status: "Active", fields: 12, version: "1.0" },
  { id: "FT-003", name: "Quick Advance", description: "Simplified form for trusted employees with auto-approval", status: "Draft", fields: 4, version: "1.0" },
];

const formFields = [
  { id: "F-01", name: "Request Amount", type: "Number", required: true, validation: "Min: 10,000 / Max: EWA Cap", order: 1 },
  { id: "F-02", name: "Reason for Advance", type: "Text", required: true, validation: "Min 10 chars", order: 2 },
  { id: "F-03", name: "Payout Method", type: "Dropdown", required: true, options: "Bank Transfer, Agent Cash-Out, E-Wallet", order: 3 },
  { id: "F-04", name: "Document Upload", type: "File", required: false, validation: "PDF, JPG (max 5MB)", order: 4 },
  { id: "F-05", name: "Emergency Flag", type: "Checkbox", required: false, validation: "—", order: 5 },
  { id: "F-06", name: "Approver Notes", type: "Textarea", required: false, validation: "Optional", order: 6 },
];

export function FormCreatorPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Form Builder</h1>
        <p className="text-sm text-slate-500 mt-0.5">Create and manage EWA request forms with dynamic fields, conditional logic, and templates</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700">Form Templates</CardTitle>
            <Button size="sm" className="text-xs bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Template Name</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Description</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Fields</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Version</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formTemplates.map(ft => (
                <TableRow key={ft.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-sm font-mono text-slate-600">{ft.id}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-800">{ft.name}</TableCell>
                  <TableCell className="text-sm text-slate-500 max-w-[250px] truncate">{ft.description}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{ft.fields}</TableCell>
                  <TableCell className="text-sm font-mono text-slate-500">v{ft.version}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${ft.status === "Active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>{ft.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5 text-slate-400" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="w-3.5 h-3.5 text-slate-400" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Form Fields — Standard EWA Request</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">#</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Field ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Field Name</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Type</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Required</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Validation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formFields.map(f => (
                <TableRow key={f.id} className="hover:bg-slate-50/80">
                  <TableCell className="text-sm text-slate-500">{f.order}</TableCell>
                  <TableCell className="text-sm font-mono text-slate-600">{f.id}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-800">{f.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{f.type}</Badge></TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${f.required ? "bg-red-100 text-red-700 border-red-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                      {f.required ? "Required" : "Optional"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{f.validation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
