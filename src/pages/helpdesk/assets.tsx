import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Laptop, Monitor, HardDrive, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useITAMStats } from "@/hooks/useITAMStats";
import { AssetsList } from "@/components/ITAM/AssetsList";
import { CreateAssetDialog } from "@/components/ITAM/CreateAssetDialog";
import { AssetAssignmentsList } from "@/components/ITAM/AssetAssignmentsList";

export default function HelpdeskAssets() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: stats, isLoading: statsLoading } = useITAMStats();

  const handleAddAssetClick = () => {
    console.log("=== ADD ASSET BUTTON CLICKED ===");
    console.log("Current state:", createDialogOpen);
    setCreateDialogOpen(true);
    console.log("State set to true");
  };

  return (
    <div className="max-w-7xl">
      {/* Debug Test Button */}
      <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
        <p className="text-sm mb-2">Debug: Dialog state is {createDialogOpen ? "OPEN" : "CLOSED"}</p>
        <Button 
          onClick={handleAddAssetClick}
          variant="destructive"
          type="button"
        >
          🧪 TEST: Click Me to Open Dialog
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6 relative">
        <div>
          <h2 className="text-2xl font-bold mb-1">IT Asset Management</h2>
          <p className="text-muted-foreground">Track and manage IT assets, assignments, vendors, and licenses</p>
        </div>
        <Button 
          onClick={handleAddAssetClick}
          className="relative z-50"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.totalAssets || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laptops</CardTitle>
            <Laptop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.laptops || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.assigned || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">To employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licenses</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.licenses || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active licenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <AssetsList />
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          <AssetAssignmentsList />
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <AssetsList status="active" />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <AssetsList status="maintenance" />
        </TabsContent>
      </Tabs>

      <CreateAssetDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          console.log("Dialog onOpenChange called with:", open);
          setCreateDialogOpen(open);
        }}
      />
    </div>
  );
}
