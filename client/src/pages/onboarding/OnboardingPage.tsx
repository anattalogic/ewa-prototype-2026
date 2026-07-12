/**
 * OnboardingPage — Company Onboarding Pipeline
 * Design: Neobrutalist Fintech — Pipeline stages with workflow progress
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { onboardingPipeline } from "@/data/mockData";
import { CheckCircle2, Clock, Building2, FileCheck, Plug, ShieldCheck } from "lucide-react";

const STAGES = [
  { num: 1, label: "Submitted", icon: FileCheck },
  { num: 2, label: "KYC Review", icon: ShieldCheck },
  { num: 3, label: "Configuration", icon: Building2 },
  { num: 4, label: "Integration", icon: Plug },
  { num: 5, label: "Active", icon: CheckCircle2 },
];

function PipelineProgress({ currentStage }: { currentStage: number }) {
  return (
    <div className="flex items-center gap-1">
      {STAGES.map((stage) => {
        const Icon = stage.icon;
        const isComplete = currentStage >= stage.num;
        const isCurrent = currentStage === stage.num;
        return (
          <div key={stage.num} className="flex items-center gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isComplete ? "bg-emerald-500 text-white" : isCurrent ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
            }`}>
              <Icon className="w-3 h-3" />
            </div>
            {stage.num < 5 && (
              <div className={`w-8 h-0.5 ${currentStage > stage.num ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function OnboardingPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Company Onboarding</h1>
        <p className="text-sm text-slate-500 mt-0.5">{onboardingPipeline.length} companies in pipeline · Submitted → KYC → Configuration → Integration → Active</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-700">Onboarding Pipeline</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Company</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Type</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Stage</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Progress</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Submitted</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {onboardingPipeline.map(ob => (
                <TableRow key={ob.id} className="hover:bg-slate-50/80">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{ob.companyName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{ob.id}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{ob.companyType}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-700">{ob.stageName}</TableCell>
                  <TableCell><PipelineProgress currentStage={ob.stage} /></TableCell>
                  <TableCell className="text-sm text-slate-500">{ob.submittedAt}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${ob.currentStage === "ACTIVE" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                      {ob.currentStage === "ACTIVE" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {ob.currentStage.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
