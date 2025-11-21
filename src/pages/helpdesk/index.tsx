import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Ticket, AlertCircle, Clock, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HelpdeskDashboard() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["helpdesk-dashboard-stats"],
    queryFn: async () => {
      const { data: tickets } = await supabase
        .from("helpdesk_tickets")
        .select("status, priority, created_at");

      const open = tickets?.filter(t => t.status === "open").length || 0;
      const inProgress = tickets?.filter(t => t.status === "in_progress").length || 0;
      const resolved = tickets?.filter(t => t.status === "resolved").length || 0;
      const urgent = tickets?.filter(t => t.priority === "urgent").length || 0;
      
      // Calculate tickets created today
      const today = new Date().toISOString().split('T')[0];
      const todayTickets = tickets?.filter(t => 
        t.created_at.startsWith(today)
      ).length || 0;

      return { open, inProgress, resolved, urgent, total: tickets?.length || 0, todayTickets };
    },
  });

  const { data: recentTickets } = useQuery({
    queryKey: ["helpdesk-recent-tickets"],
    queryFn: async () => {
      const { data } = await supabase
        .from("helpdesk_tickets")
        .select(`
          *,
          requester:users!helpdesk_tickets_requester_id_fkey(name),
          category:helpdesk_categories(name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">Manage support tickets and requests</p>
        </div>
        <Button onClick={() => navigate("/helpdesk/new")} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/helpdesk/tickets")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.todayTickets || 0} created today
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/helpdesk/tickets?status=open")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.open || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/helpdesk/tickets?status=in_progress")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Being worked on</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/helpdesk/tickets?priority=urgent")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.urgent || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">High priority</p>
            </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {recentTickets && recentTickets.length > 0 ? (
                  <div className="space-y-4">
                    {recentTickets.map((ticket: any) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => navigate(`/helpdesk/tickets/${ticket.id}`)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-muted-foreground">{ticket.ticket_number}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              ticket.priority === "urgent" ? "bg-red-100 text-red-700" :
                              ticket.priority === "high" ? "bg-orange-100 text-orange-700" :
                              ticket.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <h4 className="font-medium">{ticket.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {ticket.requester?.name || "Unknown"} • {ticket.category?.name || "Uncategorized"}
                          </p>
                        </div>
                        <div className={`px-3 py-1 text-xs rounded-full ${
                          ticket.status === "open" ? "bg-orange-100 text-orange-700" :
                          ticket.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                          ticket.status === "resolved" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {ticket.status.replace("_", " ")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No tickets yet</p>
                )}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/helpdesk/tickets")}
                >
                  View All Tickets
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/helpdesk/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/helpdesk/tickets")}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  My Tickets
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/helpdesk/tickets?assigned=me")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Assigned to Me
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Resolved Today</span>
                  <span className="font-bold">{stats?.resolved || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Response Time</span>
                  <span className="font-bold">2.3h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Resolution Rate</span>
                  <span className="font-bold">
                    {stats?.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </span>
                </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
