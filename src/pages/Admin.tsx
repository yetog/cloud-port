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
  Activity,
  PieChart as PieChartIcon,
  BarChart3,
  Briefcase,
  StickyNote,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

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

interface StatsData {
  total_apps: number;
  category_distribution: Array<{ name: string; value: number; color: string }>;
  status_distribution: { up: number; down: number; external: number };
  category_status: Array<{ category: string; up: number; down: number; total: number }>;
}

interface Job {
  id: number;
  company: string;
  role: string;
  url?: string;
  description?: string;
  requirements?: string[];
  status: string;
  notes?: string;
  matching_projects?: string[];
  skill_gaps?: string[];
  created_at: string;
  updated_at: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [apps, setApps] = useState<App[]>([]);
  const [updates, setUpdates] = useState<UpdateInfo[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updatingApp, setUpdatingApp] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  // Jobs & Notes state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newJob, setNewJob] = useState({ company: "", role: "", url: "", description: "", status: "saved" });
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "claude-review" });

  // Check session storage for auth
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAppsHealth();
      checkForUpdates();
    }
  }, [isAuthenticated]);

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

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/apps/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
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

      // Also fetch stats for charts
      await fetchStats();
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

  // Jobs functions
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/jobs`);
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const createJob = async () => {
    if (!newJob.company || !newJob.role) {
      toast({ title: "Error", description: "Company and role are required", variant: "destructive" });
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      if (response.ok) {
        toast({ title: "Job Saved", description: `${newJob.role} at ${newJob.company}` });
        setNewJob({ company: "", role: "", url: "", description: "", status: "saved" });
        setShowJobForm(false);
        fetchJobs();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save job", variant: "destructive" });
    }
  };

  const updateJobStatus = async (jobId: number, status: string) => {
    try {
      await fetch(`${API_BASE}/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchJobs();
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  const deleteJob = async (jobId: number) => {
    try {
      await fetch(`${API_BASE}/jobs/${jobId}`, { method: "DELETE" });
      toast({ title: "Deleted", description: "Job removed" });
      fetchJobs();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete job", variant: "destructive" });
    }
  };

  // Notes functions
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE}/notes`);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const createNote = async () => {
    if (!newNote.title || !newNote.content) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      if (response.ok) {
        toast({ title: "Note Saved", description: newNote.title });
        setNewNote({ title: "", content: "", category: "claude-review" });
        setShowNoteForm(false);
        fetchNotes();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save note", variant: "destructive" });
    }
  };

  const toggleNoteResolved = async (noteId: number, resolved: boolean) => {
    try {
      await fetch(`${API_BASE}/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved: !resolved }),
      });
      fetchNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const deleteNote = async (noteId: number) => {
    try {
      await fetch(`${API_BASE}/notes/${noteId}`, { method: "DELETE" });
      toast({ title: "Deleted", description: "Note removed" });
      fetchNotes();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete note", variant: "destructive" });
    }
  };

  // Fetch jobs and notes on auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
      fetchNotes();
    }
  }, [isAuthenticated]);

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

        {/* Charts Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Apps by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.category_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.category_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {stats.category_distribution.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {cat.name}: {cat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Status by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.category_status}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="up" stackId="a" fill="#10b981" name="Online" />
                    <Bar dataKey="down" stackId="a" fill="#ef4444" name="Offline" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

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

        {/* Jobs & Notes Tabs */}
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Jobs ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Notes ({notes.filter(n => !n.resolved).length})
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Job Tracker
                  </CardTitle>
                  <Button size="sm" onClick={() => setShowJobForm(!showJobForm)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add Job Form */}
                {showJobForm && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Company"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      />
                      <Input
                        placeholder="Role"
                        value={newJob.role}
                        onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                      />
                    </div>
                    <Input
                      placeholder="Job URL (optional)"
                      value={newJob.url}
                      onChange={(e) => setNewJob({ ...newJob, url: e.target.value })}
                    />
                    <Textarea
                      placeholder="Paste job description here..."
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button onClick={createJob}>Save Job</Button>
                      <Button variant="outline" onClick={() => setShowJobForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {/* Jobs List */}
                <div className="space-y-3">
                  {jobs.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No jobs saved yet. Click "Add Job" to start tracking.
                    </p>
                  ) : (
                    jobs.map((job) => (
                      <div key={job.id} className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{job.role}</span>
                            <span className="text-muted-foreground">at</span>
                            <span className="font-medium">{job.company}</span>
                            {job.url && (
                              <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Select value={job.status} onValueChange={(v) => updateJobStatus(job.id, v)}>
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="saved">Saved</SelectItem>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="interview">Interview</SelectItem>
                                <SelectItem value="offer">Offer</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-xs text-muted-foreground">
                              Added {new Date(job.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {job.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteJob(job.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Notes for Claude
                  </CardTitle>
                  <Button size="sm" onClick={() => setShowNoteForm(!showNoteForm)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Note
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Save ideas, questions, or things you want Claude to review
                </p>
              </CardHeader>
              <CardContent>
                {/* Add Note Form */}
                {showNoteForm && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-3">
                    <Input
                      placeholder="Note title"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="What's on your mind? Questions for Claude, ideas to explore, things to remember..."
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      rows={4}
                    />
                    <div className="flex gap-2 items-center">
                      <Select value={newNote.category} onValueChange={(v) => setNewNote({ ...newNote, category: v })}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="claude-review">For Claude</SelectItem>
                          <SelectItem value="idea">Idea</SelectItem>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={createNote}>Save Note</Button>
                      <Button variant="outline" onClick={() => setShowNoteForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {/* Notes List */}
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No notes yet. Add thoughts, ideas, or questions for your next Claude session.
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-4 rounded-lg ${note.resolved ? 'bg-muted/20 opacity-60' : 'bg-muted/30'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${note.resolved ? 'line-through' : ''}`}>
                                {note.title}
                              </span>
                              <Badge variant={note.category === "claude-review" ? "default" : "secondary"}>
                                {note.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                              {note.content}
                            </p>
                            <span className="text-xs text-muted-foreground mt-2 block">
                              {new Date(note.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleNoteResolved(note.id, note.resolved)}
                            >
                              <CheckCircle2 className={`w-4 h-4 ${note.resolved ? 'text-green-500' : 'text-muted-foreground'}`} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
