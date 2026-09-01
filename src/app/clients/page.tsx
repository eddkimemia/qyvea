import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function ClientsPage(){
  return <div className="container mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold">Clients Portal</h1>
    <p className="text-zinc-500">Subscriptions, invoices & maintenance tickets. Login to view your service history.</p>
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      <Card><CardHeader><CardTitle>Active Subscriptions</CardTitle></CardHeader><CardContent className="text-sm text-zinc-500">No active subscriptions — contact support to activate estate/maintenance contract.</CardContent></Card>
      <Card><CardHeader><CardTitle>Invoices</CardTitle></CardHeader><CardContent className="text-sm text-zinc-500">M-Pesa & bank invoices appear here after order confirmation.</CardContent></Card>
      <Card><CardHeader><CardTitle>Support Chat</CardTitle></CardHeader><CardContent><Button>Open Chat</Button><p className="text-xs text-zinc-500 mt-2">30-min response SLA</p></CardContent></Card>
    </div>
  </div>
}
