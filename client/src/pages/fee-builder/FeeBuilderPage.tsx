/**
 * FeeBuilderPage — Fee Builder & Policy Configuration
 * Design: Neobrutalist Fintech — Configurable fee policies per company
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { feePolicies } from "@/data/mockData";
import { Settings, Tag, Receipt, DollarSign } from "lucide-react";

export function FeeBuilderPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Fee Builder & Policy Configuration</h1>
        <p className="text-sm text-slate-500 mt-0.5">Service fees, late fees, WHT, VAT, and bank charges — configurable per company</p>
      </div>

      {feePolicies.map(fp => (
        <Card key={fp.companyId}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#0ea5e9]" />
                {fp.companyName}
              </CardTitle>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">{fp.feeBearer}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Fee Type</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Rate / Value</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Min / Max</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Bearer</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Cap / Extra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="flex items-center gap-2 text-sm"><Tag className="w-3.5 h-3.5 text-[#0ea5e9]" /><span className="font-medium text-slate-800">Service Fee</span></TableCell>
                  <TableCell className="text-sm font-medium">{fp.serviceFeeRate}%</TableCell>
                  <TableCell className="text-sm text-slate-600">{fp.serviceFeeMin.toLocaleString()} / {fp.serviceFeeMax.toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{fp.feeBearer}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-500">—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2 text-sm"><Receipt className="w-3.5 h-3.5 text-amber-500" /><span className="font-medium text-slate-800">Late Fee</span></TableCell>
                  <TableCell className="text-sm font-medium">{fp.lateFeeRate}%/day</TableCell>
                  <TableCell className="text-sm text-slate-600">Grace: {fp.lateFeeGraceDays} days</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">Employee</Badge></TableCell>
                  <TableCell className="text-sm text-slate-500">Cap: {fp.lateFeeCap.toLocaleString()} MMK</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2 text-sm"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /><span className="font-medium text-slate-800">WHT (Withholding Tax)</span></TableCell>
                  <TableCell className="text-sm font-medium">{fp.whtRate}%</TableCell>
                  <TableCell className="text-sm text-slate-500">—</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">Employee</Badge></TableCell>
                  <TableCell className="text-sm text-slate-500">—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2 text-sm"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /><span className="font-medium text-slate-800">VAT</span></TableCell>
                  <TableCell className="text-sm font-medium">{fp.vatRate}%</TableCell>
                  <TableCell className="text-sm text-slate-500">—</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">Employee</Badge></TableCell>
                  <TableCell className="text-sm text-slate-500">—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2 text-sm"><DollarSign className="w-3.5 h-3.5 text-slate-500" /><span className="font-medium text-slate-800">Bank Charge</span></TableCell>
                  <TableCell className="text-sm font-medium">{fp.bankCharge.toLocaleString()} MMK</TableCell>
                  <TableCell className="text-sm text-slate-500">—</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{fp.bankChargeBearer}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-500">—</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Late Fee Slab */}
            <div className="px-4 pb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Late Fee Slab Structure</p>
              <div className="flex gap-2">
                {fp.lateFeeSlab.map((slab, i) => (
                  <div key={i} className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                    <span className="text-slate-600">Day {slab.from}-{slab.to === 999 ? "999+" : slab.to}: </span>
                    <span className="font-medium text-amber-700">{slab.rate}%/day</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
