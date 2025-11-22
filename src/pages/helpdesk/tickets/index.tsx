import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { HelpdeskTicketList } from "@/components/helpdesk/HelpdeskTicketList";
import { CreateTicketDialog } from "@/components/helpdesk/CreateTicketDialog";
import { TicketStatsCards } from "@/components/helpdesk/TicketStatsCards";
import { useNavigate } from "react-router-dom";

export default function HelpdeskTickets() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tickets</h1>
            <p className="text-muted-foreground">View and manage all helpdesk tickets</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/helpdesk")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        <TicketStatsCards />

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
}
