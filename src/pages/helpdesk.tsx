import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Ticket, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { HelpdeskTicketList } from "@/components/Helpdesk/HelpdeskTicketList";
import { CreateTicketDialog } from "@/components/Helpdesk/CreateTicketDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HelpDesk = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch ticket stats
  const { data: stats } = useQuery({
    queryKey: ["helpdesk-stats"],
    queryFn: async () => {
      const { data: tickets } = await supabase
        .from("helpdesk_tickets")
        .select("status, priority");

      const open = tickets?.filter(t => t.status === "open").length || 0;
      const inProgress = tickets?.filter(t => t.status === "in_progress").length || 0;
      const resolved = tickets?.filter(t => t.status === "resolved").length || 0;
      const urgent = tickets?.filter(t => t.priority === "urgent").length || 0;

      return { open, inProgress, resolved, urgent, total: tickets?.length || 0 };
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <BackButton />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Help Desk</h1>
            <p className="text-muted-foreground">Manage support tickets and customer requests</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.open || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.resolved || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.urgent || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <HelpdeskTicketList />
          </TabsContent>

          <TabsContent value="open" className="mt-6">
            <HelpdeskTicketList status="open" />
          </TabsContent>

          <TabsContent value="in_progress" className="mt-6">
            <HelpdeskTicketList status="in_progress" />
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <HelpdeskTicketList status="resolved" />
          </TabsContent>

          <TabsContent value="closed" className="mt-6">
            <HelpdeskTicketList status="closed" />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTicketDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
};

export default HelpDesk;
