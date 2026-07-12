/**
 * NotificationsPage — Notification Center
 * Design: Neobrutalist Fintech — Role-based notifications with channels and read status
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Bell, MessageSquare, Check, Clock } from "lucide-react";

const notifications = [
  { id: "N-001", type: "Settlement Approved", message: "SET-2026-07-001 settlement approved by Checker", channel: "Email", recipients: "Finance, Operations", read: true, timestamp: "10:30 AM" },
  { id: "N-002", type: "Employee Verified", message: "Htet Oo Kyaw — Employment verification completed successfully", channel: "SMS", recipients: "HR, Employee", read: false, timestamp: "09:45 AM" },
  { id: "N-003", type: "Budget Alert", message: "Skyline Trading budget utilization reached 78% threshold", channel: "Email", recipients: "Finance, Risk", read: false, timestamp: "09:00 AM" },
  { id: "N-004", type: "Repayment Due", message: "REP-2026-07-003 payment due within 48 hours", channel: "SMS", recipients: "Operations, Company", read: true, timestamp: "08:30 AM" },
  { id: "N-005", type: "Risk Escalation", message: "Golden Harvest Foods credit score dropped below 60 threshold", channel: "Email", recipients: "Risk, Finance", read: false, timestamp: "08:00 AM" },
  { id: "N-006", type: "Transaction Completed", message: "TXN-2026-07-005 disbursed successfully to Aung Thu", channel: "SMS", recipients: "Employee, Operations", read: true, timestamp: "07:30 AM" },
  { id: "N-007", type: "Onboarding Complete", message: "Golden Harvest Foods onboarding completed — company now active", channel: "Email", recipients: "Sales, Operations", read: true, timestamp: "Yesterday" },
  { id: "N-008", type: "System Alert", message: "Late fee calculation engine updated — new slab rates effective", channel: "Email", recipients: "All Roles", read: false, timestamp: "Yesterday" },
];

function ChannelBadge({ channel }: { channel: string }) {
  const c: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    "Email": { bg: "bg-blue-100", text: "text-blue-700", icon: Mail },
    "SMS": { bg: "bg-emerald-100", text: "text-emerald-700", icon: MessageSquare },
    "Push": { bg: "bg-amber-100", text: "text-amber-700", icon: Bell },
  };
  const s = c[channel] || c["Email"];
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <s.icon className="w-3 h-3" />
      {channel}
    </div>
  );
}

export function NotificationsPage() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">Role-based notifications across Email, SMS, and Push channels</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-xs">
            {unreadCount} Unread
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700">Notification Log</CardTitle>
            <Button size="sm" className="text-xs bg-[#1e3a5f] hover:bg-[#1a3250] text-white">
              <Check className="w-3.5 h-3.5 mr-1.5" /> Mark All Read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Type</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Message</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Channel</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Recipients</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Read</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map(n => (
                <TableRow key={n.id} className={`hover:bg-slate-50/80 ${!n.read ? "bg-blue-50/30" : ""}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />}
                      <span className="text-sm font-medium text-slate-800">{n.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 max-w-[300px]">{n.message}</TableCell>
                  <TableCell><ChannelBadge channel={n.channel} /></TableCell>
                  <TableCell className="text-xs text-slate-500">{n.recipients}</TableCell>
                  <TableCell>
                    {n.read ? (
                      <Badge variant="outline" className="text-xs bg-slate-100 text-slate-500 border-slate-200">Read</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20">Unread</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{n.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
