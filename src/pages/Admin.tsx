import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  Power,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  Server,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simple password protection - in production use proper auth
const ADMIN_PASSWORD = "brain2026";
const API_BASE = "/api";

interface App {
  name: string;
  port: number;
  category: string;
  container: string | null;
  status?: "up" | "down" | "external";
  commits_behind?: number;
  latest_commit?: string;
}

interface UpdateInfo {
  name: string;
  commits_behind: number;
  latest_commit: string;
  branch: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [apps, setApps] = useState<App[]>([]);
  const [updates, setUpdates] = useState<UpdateInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updatingApp, setUpdatingApp] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  // Check session storage for auth
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast({ title: "Authenticated", description: "Welcome to the admin dashboard" });
    } else {
      toast({ title: "Error", description: "Invalid password", variant: "destructive" });
    }
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const fetchAppsHealth = async () => {
    setLoading(true);
    addLog("Fetching app health status...");
    try {
      const response = await fetch(`${API_BASE}/apps/health`);
      const data = await response.json();

      const allApps = [
        ...data.up.map((app: App) => ({ ...app, status: "up" as const })),
        ...data.down.map((app: App) => ({ ...app, status: "down" as const })),
      ].sort((a, b) => a.name.localeCompare(b.name));

      setApps(allApps);
      addLog(`Found ${data.up_count} apps up, ${data.down_count} down`);
      toast({ title: "Health Check Complete", description: `${data.up_count} up, ${data.down_count} down` });
    } catch (error) {
      addLog(`Error fetching health: ${error}`);
      toast({ title: "Error", description: "Failed to fetch app health", variant: "destructive" });
    }
    setLoading(false);
  };

  const checkForUpdates = async () => {
    setCheckingUpdates(true);
    addLog("Checking all apps for updates...");
    try {
      const response = await fetch(`${API_BASE}/apps/updates/check`);
      const data = await response.json();

      setUpdates(data.apps_with_updates || []);
      addLog(`Found ${data.total_updates} apps with pending updates`);

      if (data.total_updates > 0) {
        toast({
          title: "Updates Available",
          description: `${data.total_updates} app(s) have pending updates`
        });
      } else {
        toast({ title: "All Up to Date", description: "No pending updates found" });
      }
    } catch (error) {
      addLog(`Error checking updates: ${error}`);
      toast({ title: "Error", description: "Failed to check for updates", variant: "destructive" });
    }
    setCheckingUpdates(false);
  };

  const updateApp = async (appName: string) => {
    setUpdatingApp(appName);
    addLog(`Starting update for ${appName}...`);
    try {
      const response = await fetch(`${API_BASE}/apps/${appName}/update`, { method: "POST" });
      const data = await response.json();

      if (data.success) {
        addLog(`Update complete for ${appName}`);
        toast({ title: "Update Complete", description: `${appName} has been updated` });
        // Refresh updates list
        checkForUpdates();
        fetchAppsHealth();
      } else {
        addLog(`Update failed for ${appName}: ${data.output?.slice(-200)}`);
        toast({ title: "Update Failed", description: `Check logs for details`, variant: "destructive" });
      }
    } catch (error) {
      addLog(`Error updating ${appName}: ${error}`);
      toast({ title: "Error", description: `Failed to update ${appName}`, variant: "destructive" });
    }
    setUpdatingApp(null);
  };

  const restartApp = async (appName: string) => {
    addLog(`Restarting ${appName}...`);
    try {
      const response = await fetch(`${API_BASE}/apps/${appName}/restart`, { method: "POST" });
      const data = await response.json();

      if (data.status === "restarted") {
        addLog(`Restarted ${appName} successfully`);
        toast({ title: "Restarted", description: `${appName} has been restarted` });
        setTimeout(fetchAppsHealth, 3000); // Refresh after 3s
      }
    } catch (error) {
      addLog(`Error restarting ${appName}: ${error}`);
      toast({ title: "Error", description: `Failed to restart ${appName}`, variant: "destructive" });
    }
  };

  const getUpdateInfo = (appName: string) => {
    return updates.find(u => u.name === appName);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center"
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Server className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your portfolio apps</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchAppsHealth} disabled={loading}>
              <Activity className="w-4 h-4 mr-2" />
              {loading ? "Checking..." : "Health Check"}
            </Button>
            <Button onClick={checkForUpdates} disabled={checkingUpdates} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${checkingUpdates ? "animate-spin" : ""}`} />
              {checkingUpdates ? "Checking..." : "Check Updates"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">
                {apps.filter(a => a.status === "up").length}
              </div>
              <p className="text-sm text-muted-foreground">Apps Online</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">
                {apps.filter(a => a.status === "down").length}
              </div>
              <p className="text-sm text-muted-foreground">Apps Offline</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-500">
                {updates.length}
              </div>
              <p className="text-sm text-muted-foreground">Updates Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{apps.length}</div>
              <p className="text-sm text-muted-foreground">Total Apps</p>
            </CardContent>
          </Card>
        </div>

        {/* Updates Section */}
        {updates.length > 0 && (
          <Card className="border-yellow-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <AlertCircle className="w-5 h-5" />
                Pending Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {updates.map((update) => (
                  <div key={update.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="font-medium">{update.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {update.commits_behind} commit{update.commits_behind > 1 ? "s" : ""} behind
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Latest: {update.latest_commit}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => updateApp(update.name)}
                      disabled={updatingApp === update.name}
                    >
                      <Download className={`w-4 h-4 mr-1 ${updatingApp === update.name ? "animate-bounce" : ""}`} />
                      {updatingApp === update.name ? "Updating..." : "Update"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => {
            const updateInfo = getUpdateInfo(app.name);
            return (
              <Card key={app.name} className={app.status === "down" ? "border-red-500/50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    {app.status === "up" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Port</span>
                      <Badge variant="outline">:{app.port}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant={app.category === "finished" ? "default" : "secondary"}>
                        {app.category}
                      </Badge>
                    </div>
                    {updateInfo && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Updates</span>
                        <Badge variant="destructive">{updateInfo.commits_behind} pending</Badge>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      {app.container && (
                        <Button size="sm" variant="outline" onClick={() => restartApp(app.name)}>
                          <Power className="w-4 h-4 mr-1" />
                          Restart
                        </Button>
                      )}
                      {updateInfo && (
                        <Button
                          size="sm"
                          onClick={() => updateApp(app.name)}
                          disabled={updatingApp === app.name}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Update
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/90 text-green-400 font-mono text-sm p-4 rounded-lg h-48 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">No activity yet. Click "Health Check" to start.</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
