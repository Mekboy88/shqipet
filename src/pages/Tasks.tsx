import React, { useMemo, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Plus,
  Share2,
  Link as LinkIcon,
  Filter,
  Search,
  MoreHorizontal,
  CalendarDays,
  ListChecks,
  LayoutDashboard,
  Globe,
  Copy,
  Check,
  UserPlus,
  ExternalLink,
  MessageSquareText,
  Paperclip,
  Bell,
  Settings as SettingsIcon,
} from "lucide-react";

/**
 * Shqipet – Task Center (Desktop, Light Theme)
 * Single-file React component for Lovable (shadcn/ui + Tailwind)
 * - White/light theme, rounded, soft borders/shadows
 * - Non-destructive (adds a page; does not remove existing elements)
 * - Local mock data so it previews instantly
 */

// ---------------- Types ----------------
interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "backlog" | "todo" | "inprogress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  assignees: string[]; // user ids
  due?: string; // ISO date
  linked?: { type: string; ref: string }[]; // connections to other modules
  comments?: number;
  attachments?: number;
}

type ViewTab = "board" | "list" | "calendar" | "activity";

interface SettingsState {
  defaultTab: ViewTab;
  alertsEnabled: boolean;
  // Card content
  showTags: boolean;
  showDue: boolean;
  showComments: boolean;
  showAttachments: boolean;
  showAssignees: boolean;
  // Board
  statusVisible: Record<Task["status"], boolean>;
  // Appearance
  titleClamp: 1 | 2 | 3 | 4;
  descClamp: 1 | 2 | 3 | 4 | 5;
  cardDensity: "compact" | "cozy" | "comfortable";
  // Sharing & permissions
  allowPublicLink: boolean;
  allowCommentsByAnyone: boolean;
  allowAssigneeEdits: boolean;
  // Calendar
  weekStartsOn: "monday" | "sunday";
  showWeekNumbers: boolean;
  // Integrations
  connectFeed: boolean;
  connectUsersMarket: boolean;
  connectPlatformStore: boolean;
  connectLuna: boolean;
}

// ---------------- Mock Data ----------------
const USERS: Record<string, User> = {
  u1: { id: "u1", name: "Andi", avatar: "/avatars/andi.png" },
  u2: { id: "u2", name: "Luna", avatar: "/avatars/luna.png" },
  u3: { id: "u3", name: "Arber", avatar: "/avatars/arber.png" },
};

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Design Task Center header + status dot",
    description: "Sticky header with subtle system status and quick actions.",
    status: "inprogress",
    priority: "high",
    tags: ["ui", "desktop"],
    assignees: ["u1", "u2"],
    due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    linked: [
      { type: "Module", ref: "Admin Settings" },
      { type: "AI", ref: "Luna Assistant" },
    ],
    comments: 3,
    attachments: 1,
  },
  {
    id: "t2",
    title: "Add sharable links + invites",
    description: "Copy link, invite users, permission presets.",
    status: "todo",
    priority: "medium",
    tags: ["sharing"],
    assignees: ["u2"],
    due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    comments: 0,
    attachments: 0,
  },
  {
    id: "t3",
    title: "Connect to Posts & Marketplace",
    description: "Link tasks to posts, listings, orders.",
    status: "review",
    priority: "urgent",
    tags: ["integration", "market"],
    assignees: ["u1", "u3"],
    due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    linked: [
      { type: "Marketplace", ref: "Users Market" },
      { type: "Posts", ref: "Feed/News" },
    ],
    comments: 5,
    attachments: 2,
  },
  {
    id: "t4",
    title: "Calendar view + due-date heatmap",
    status: "backlog",
    priority: "low",
    tags: ["calendar"],
    assignees: ["u3"],
    comments: 1,
    attachments: 0,
  },
  {
    id: "t5",
    title: "Activity log + notifications",
    status: "done",
    priority: "medium",
    tags: ["audit", "notifications"],
    assignees: ["u1"],
    comments: 2,
    attachments: 1,
  },
];

// ---------------- Constants ----------------
const STATUS_ORDER: Task["status"][] = [
  "backlog",
  "todo",
  "inprogress",
  "review",
  "done",
];

const STATUS_LABEL: Record<Task["status"], string> = {
  backlog: "Backlog",
  todo: "To‑Do",
  inprogress: "In Progress",
  review: "Review",
  done: "Done",
};

export const PRIORITY_LABEL: Record<Task["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const PRIORITY_TONE: Record<Task["priority"], string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-sky-50 text-sky-700 border-sky-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  urgent: "bg-rose-50 text-rose-700 border-rose-200",
};

const INITIAL_SETTINGS: SettingsState = {
  defaultTab: "board",
  alertsEnabled: true,
  showTags: true,
  showDue: true,
  showComments: true,
  showAttachments: true,
  showAssignees: true,
  statusVisible: { backlog: true, todo: true, inprogress: true, review: true, done: true },
  titleClamp: 2,
  descClamp: 3,
  cardDensity: "cozy",
  allowPublicLink: true,
  allowCommentsByAnyone: true,
  allowAssigneeEdits: true,
  weekStartsOn: "monday",
  showWeekNumbers: false,
  connectFeed: true,
  connectUsersMarket: true,
  connectPlatformStore: true,
  connectLuna: true,
};

// Lightweight runtime checks (dev only) – tiny test cases
if (typeof window !== "undefined") {
  console.assert(PRIORITY_LABEL.low === "Low", "PRIORITY_LABEL.low should be 'Low'");
  console.assert(Object.keys(PRIORITY_TONE).length === 4, "PRIORITY_TONE must have 4 keys");
  console.assert(STATUS_ORDER.every((s) => STATUS_LABEL[s]), "All statuses must have labels");
  console.assert(STATUS_ORDER.length === 5, "Expected 5 status columns");
}

// ---------------- UI bits ----------------
function StatusDot({ online = true }: { online?: boolean }) {
  return (
    <div className="relative">
      <span
        className={cn(
          "inline-block h-2.5 w-2.5 rounded-full",
          online ? "bg-emerald-500" : "bg-rose-500"
        )}
      />
      <span className="absolute -inset-1 animate-ping rounded-full bg-emerald-500/30" />
    </div>
  );
}

function Assignees({ ids }: { ids: string[] }) {
  return (
    <div className="flex -space-x-2">
      {ids.map((id) => (
        <Avatar key={id} className="h-7 w-7 ring-2 ring-white">
          <AvatarImage src={USERS[id]?.avatar} alt={USERS[id]?.name} />
          <AvatarFallback>{USERS[id]?.name?.slice(0, 2) || "U"}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}

function clampClassTitle(n: SettingsState["titleClamp"]) {
  return n === 1 ? "line-clamp-1" : n === 2 ? "line-clamp-2" : n === 3 ? "line-clamp-3" : "line-clamp-4";
}
function clampClassDesc(n: SettingsState["descClamp"]) {
  return n === 1 ? "line-clamp-1" : n === 2 ? "line-clamp-2" : n === 3 ? "line-clamp-3" : n === 4 ? "line-clamp-4" : "line-clamp-5";
}
function densityPadding(d: SettingsState["cardDensity"]) {
  switch (d) {
    case "compact":
      return { header: "p-3 pb-1.5", content: "p-3 pt-0" };
    case "comfortable":
      return { header: "p-5 pb-3", content: "p-5 pt-0" };
    default:
      return { header: "p-4 pb-2", content: "p-4 pt-0" };
  }
}

// Extra dev assertions (more tests)
if (typeof window !== "undefined") {
  console.assert(clampClassTitle(2) === "line-clamp-2", "Title clamp mapping failed");
  console.assert(clampClassDesc(5) === "line-clamp-5", "Desc clamp mapping failed");
  const dp = densityPadding("compact");
  console.assert(!!dp.header && !!dp.content, "Density padding must return header/content");
}

function TaskCard({ task, onSelect, settings }: { task: Task; onSelect: (t: Task) => void; settings: SettingsState; }) {
  const pad = densityPadding(settings.cardDensity);
  return (
    <Card
      className="group cursor-pointer border border-neutral-200 hover:shadow-md transition-all bg-white overflow-hidden rounded-xl h-full flex flex-col"
      onClick={() => onSelect(task)}
    >
      <CardHeader className={cn(pad.header, "break-words")}>
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <CardTitle className={cn("text-base font-semibold leading-tight text-neutral-900 break-words", clampClassTitle(settings.titleClamp))}>
              {task.title}
            </CardTitle>
            {task.description && (
              <CardDescription className={cn("mt-1 text-neutral-500 break-words", clampClassDesc(settings.descClamp))}>
                {task.description}
              </CardDescription>
            )}
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 border px-2 py-0.5 text-xs whitespace-nowrap",
              PRIORITY_TONE[task.priority]
            )}
          >
            {PRIORITY_LABEL[task.priority]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={cn(pad.content, "mt-auto break-words") }>
        {settings.showTags && (
          <div className="flex flex-wrap items-center gap-2">
            {task.tags.map((t) => (
              <Badge key={t} variant="secondary" className="bg-neutral-100 text-neutral-700 max-w-full break-words">
                #{t}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 min-w-0">
            {settings.showDue && task.due && (
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span className="truncate">{new Date(task.due).toLocaleDateString()}</span>
              </div>
            )}
            {settings.showComments && typeof task.comments === "number" && (
              <div className="flex items-center gap-1">
                <MessageSquareText className="h-4 w-4 shrink-0" />
                <span>{task.comments}</span>
              </div>
            )}
            {settings.showAttachments && typeof task.attachments === "number" && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-4 w-4 shrink-0" />
                <span>{task.attachments}</span>
              </div>
            )}
          </div>
          {settings.showAssignees && (
            <div className="shrink-0">
              <Assignees ids={task.assignees} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanColumn({
  title,
  tasks,
  onSelect,
  settings,
}: {
  title: string;
  tasks: Task[];
  onSelect: (t: Task) => void;
  settings: SettingsState;
}) {
  return (
    <div className="flex min-h-[420px] w-full flex-col rounded-2xl border border-neutral-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-semibold text-neutral-800">{title}</div>
        <Badge variant="secondary" className="bg-neutral-100 text-neutral-700">
          {tasks.length}
        </Badge>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onSelect={onSelect} settings={settings} />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
            No tasks here yet.
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white">
      <div className="text-lg font-semibold text-neutral-800">No results</div>
      <p className="mt-1 text-neutral-500">Try adjusting filters or search terms.</p>
    </div>
  );
}

function NewTaskModal({ onCreate }: { onCreate: (t: Task) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [due, setDue] = useState<string>("");

  function create() {
    if (!title.trim()) return;
    const t: Task = {
      id: Math.random().toString(36).slice(2),
      title: title.trim(),
      description: desc.trim() || undefined,
      status,
      priority,
      tags: [],
      assignees: ["u1"],
      due: due ? new Date(due).toISOString() : undefined,
      comments: 0,
      attachments: 0,
    };
    onCreate(t);
    setOpen(false);
    setTitle("");
    setDesc("");
    setDue("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>Add details so your team knows what to do.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Build Users Market chat" />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Add context, goals, acceptance criteria…" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Task["status"]) }>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"]) }>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["low", "medium", "high", "urgent"].map((p) => (
                    <SelectItem key={p} value={p}>{PRIORITY_LABEL[p as Task["priority"]]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Due date</Label>
              <Input type="date" className="mt-1" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={create}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------- Settings Dialog ----------------
function SettingsDialog({
  open,
  onOpenChange,
  settings,
  setSettings,
  onApplyDefaultTab,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
  onApplyDefaultTab: (tab: ViewTab) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Task Center – Settings</DialogTitle>
          <DialogDescription>Configure board, cards, notifications, sharing, integrations, calendar, and more.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-2">
          <TabsList className="flex flex-wrap gap-1 bg-neutral-100">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="cards">Cards & Fields</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="sharing">Sharing</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="mt-3 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-12">
              <div className="space-y-2">
                <Label>Default view</Label>
                <Select value={settings.defaultTab} onValueChange={(v) => { setSettings((s) => ({ ...s, defaultTab: v as ViewTab })); onApplyDefaultTab(v as ViewTab); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="board">Team Board</SelectItem>
                    <SelectItem value="list">My Tasks</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-neutral-500">This view opens first when Task Center loads.</p>
              </div>

              <div className="space-y-2">
                <Label>Alerts</Label>
                <div className="flex items-center gap-2">
                  <Switch checked={settings.alertsEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, alertsEnabled: !!v }))} />
                  <span className="text-sm">Enable in-app alerts</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Card density</Label>
                <Select value={settings.cardDensity} onValueChange={(v) => setSettings((s) => ({ ...s, cardDensity: v as SettingsState["cardDensity"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="cozy">Cozy</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Board */}
          <TabsContent value="board" className="mt-8">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
              {STATUS_ORDER.map((s) => (
                <div key={s} className="flex items-center justify-between rounded-xl border p-3">
                  <div className="text-sm font-medium">{STATUS_LABEL[s]}</div>
                  <Switch checked={settings.statusVisible[s]} onCheckedChange={(v) => setSettings((prev) => ({ ...prev, statusVisible: { ...prev.statusVisible, [s]: !!v } }))} />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-500">Toggle which columns are visible on the board.</p>
          </TabsContent>

          {/* Cards & Fields */}
          <TabsContent value="cards" className="mt-3 space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-xl border p-3"><span>Show Tags</span><Switch checked={settings.showTags} onCheckedChange={(v) => setSettings((s) => ({ ...s, showTags: !!v }))} /></div>
              <div className="flex items-center justify-between rounded-xl border p-3"><span>Show Due Date</span><Switch checked={settings.showDue} onCheckedChange={(v) => setSettings((s) => ({ ...s, showDue: !!v }))} /></div>
              <div className="flex items-center justify-between rounded-xl border p-3"><span>Show Comments</span><Switch checked={settings.showComments} onCheckedChange={(v) => setSettings((s) => ({ ...s, showComments: !!v }))} /></div>
              <div className="flex items-center justify-between rounded-xl border p-3"><span>Show Attachments</span><Switch checked={settings.showAttachments} onCheckedChange={(v) => setSettings((s) => ({ ...s, showAttachments: !!v }))} /></div>
              <div className="flex items-center justify-between rounded-xl border p-3"><span>Show Assignees</span><Switch checked={settings.showAssignees} onCheckedChange={(v) => setSettings((s) => ({ ...s, showAssignees: !!v }))} /></div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Title lines</Label>
                <Select value={String(settings.titleClamp)} onValueChange={(v) => setSettings((s) => ({ ...s, titleClamp: Number(v) as SettingsState["titleClamp"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description lines</Label>
                <Select value={String(settings.descClamp)} onValueChange={(v) => setSettings((s) => ({ ...s, descClamp: Number(v) as SettingsState["descClamp"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-3 space-y-3">
            <div className="flex items-center justify-between rounded-xl border p-3"><span>Enable in-app alerts</span><Switch checked={settings.alertsEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, alertsEnabled: !!v }))} /></div>
            <div className="rounded-xl border p-3 text-sm text-neutral-600">
              <p>Coming soon: Email and desktop notifications (wire to your real system).</p>
            </div>
          </TabsContent>

          {/* Sharing */}
          <TabsContent value="sharing" className="mt-3 space-y-3">
            <div className="flex items-center justify-between rounded-xl border p-3"><span>Allow public link</span><Switch checked={settings.allowPublicLink} onCheckedChange={(v) => setSettings((s) => ({ ...s, allowPublicLink: !!v }))} /></div>
            <div className="flex items-center justify-between rounded-xl border p-3"><span>Allow comments by anyone with link</span><Switch checked={settings.allowCommentsByAnyone} onCheckedChange={(v) => setSettings((s) => ({ ...s, allowCommentsByAnyone: !!v }))} /></div>
            <div className="flex items-center justify-between rounded-xl border p-3"><span>Allow edits by assignees</span><Switch checked={settings.allowAssigneeEdits} onCheckedChange={(v) => setSettings((s) => ({ ...s, allowAssigneeEdits: !!v }))} /></div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border p-3"><span>Feed / News</span><Switch checked={settings.connectFeed} onCheckedChange={(v) => setSettings((s) => ({ ...s, connectFeed: !!v }))} /></div>
            <div className="flex items-center justify-between rounded-xl border p-3"><span>Users Market</span><Switch checked={settings.connectUsersMarket} onCheckedChange={(v) => setSettings((s) => ({ ...s, connectUsersMarket: !!v }))} /></div>
            <div className="flex items-center justify-between rounded-xl border p-3"><span>Platform Store</span><Switch checked={settings.connectPlatformStore} onCheckedChange={(v) => setSettings((s) => ({ ...s, connectPlatformStore: !!v }))} /></div>
            <div className="flex items-center justify-between rounded-xl border p-3"><span>Shqipet AI Assistant</span><Switch checked={settings.connectLuna} onCheckedChange={(v) => setSettings((s) => ({ ...s, connectLuna: !!v }))} /></div>
          </TabsContent>

          {/* Calendar */}
          <TabsContent value="calendar" className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Week starts on</Label>
              <Select value={settings.weekStartsOn} onValueChange={(v) => setSettings((s) => ({ ...s, weekStartsOn: v as SettingsState["weekStartsOn"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-between rounded-xl border p-3 md:col-span-2">
              <span>Show week numbers</span>
              <Switch checked={settings.showWeekNumbers} onCheckedChange={(v) => setSettings((s) => ({ ...s, showWeekNumbers: !!v }))} />
            </div>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="mt-3">
            <div className="rounded-xl border p-3 text-sm text-neutral-600">This page uses the white/light theme globally per your preference. Accent controls can be wired later if needed.</div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------- Page ----------------
export default function TaskCenterPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Task["status"] | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Task["priority"] | "all">("all");
  const [selected, setSelected] = useState<Task | null>(null);
  const [copied, setCopied] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [tab, setTab] = useState<ViewTab>(INITIAL_SETTINGS.defaultTab);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesQ = [t.title, t.description, t.tags.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesS = statusFilter === "all" ? true : t.status === statusFilter;
      const matchesP = priorityFilter === "all" ? true : t.priority === priorityFilter;
      return matchesQ && matchesS && matchesP;
    });
  }, [tasks, query, statusFilter, priorityFilter]);

  const byStatus: Record<Task["status"], Task[]> = useMemo(() => {
    return {
      backlog: filtered.filter((t) => t.status === "backlog"),
      todo: filtered.filter((t) => t.status === "todo"),
      inprogress: filtered.filter((t) => t.status === "inprogress"),
      review: filtered.filter((t) => t.status === "review"),
      done: filtered.filter((t) => t.status === "done"),
    };
  }, [filtered]);

  function addTask(newTask: Task) {
    setTasks((prev) => [newTask, ...prev]);
  }

  function copyShareLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://shqipet.com/task-center");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  const visibleStatuses = STATUS_ORDER.filter((s) => settings.statusVisible[s]);

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-[1200px] px-5 py-6 pt-20 text-neutral-900">
        {/* Header */}
        <div className="sticky top-0 z-20 -mx-5 mb-4 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <StatusDot />
              <div>
                <div className="text-xl font-bold tracking-tight">Task Center</div>
                <div className="text-xs text-neutral-500">All tasks · Teams · Calendar · Activity</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks, tags, people…"
                  className="w-[320px] bg-white"
                />
              </div>

              {/* Connect dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="gap-2">
                    <LinkIcon className="h-4 w-4" /> Connect
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-2 py-1.5 text-xs font-medium text-neutral-500">Link to</div>
                  <DropdownMenuItem>
                    <Globe className="mr-2 h-4 w-4" /> Feed / News
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ListChecks className="mr-2 h-4 w-4" /> Users Market
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ListChecks className="mr-2 h-4 w-4" /> Platform Store
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" /> Shqipet AI Assistant
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Share dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="px-3 py-2">
                    <div className="text-sm font-semibold">Share Task Center</div>
                    <p className="text-xs text-neutral-500">Invite collaborators or copy a view‑only link.</p>
                  </div>
                  <DropdownMenuItem onClick={copyShareLink}>
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "Copied!" : "Copy public link"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" /> Invite via email…
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-3 pb-2">
                    <Label className="text-xs text-neutral-500">Permissions</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <Badge variant="outline" className="justify-center">View</Badge>
                      <Badge variant="outline" className="justify-center">Comment</Badge>
                      <Badge variant="outline" className="justify-center">Edit</Badge>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* New task modal */}
              <NewTaskModal onCreate={addTask} />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1">
                    <Bell className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              {/* Settings button opens full Settings dialog */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} aria-label="Open settings">
                    <SettingsIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Filters row (always visible below header) */}
        <div className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-neutral-200 bg-white p-3 md:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 md:hidden">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              placeholder="Search tasks, tags, people…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs text-neutral-500">Status</Label>
            <Select onValueChange={(v) => setStatusFilter(v as any)} value={statusFilter}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {STATUS_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-neutral-500">Priority</Label>
            <Select onValueChange={(v) => setPriorityFilter(v as any)} value={priorityFilter}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {["low", "medium", "high", "urgent"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRIORITY_LABEL[p as Task["priority"]]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-500" />
              <Checkbox id="mine" />
              <Label htmlFor="mine" className="text-sm">Assigned to me</Label>
            </div>
          </div>

          <div className="flex items-end justify-between md:col-span-1 md:justify-end">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Alerts</Label>
                <Switch checked={notificationsOn} onCheckedChange={setNotificationsOn} />
              </div>
            </div>
          </div>
        </div>

        {/* Main body */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as ViewTab)}>
          <TabsList className="mb-3 bg-neutral-100">
            <TabsTrigger value="board">Team Board</TabsTrigger>
            <TabsTrigger value="list">My Tasks</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Kanban Board */}
          <TabsContent value="board">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                {visibleStatuses.map((s) => (
                  <KanbanColumn key={s} title={STATUS_LABEL[s]} tasks={byStatus[s]} onSelect={setSelected} settings={settings} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* List view */}
          <TabsContent value="list">
            <Card className="border-neutral-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Tasks</CardTitle>
                <CardDescription>Compact table for personal focus.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-y text-neutral-500">
                        <th className="p-2">Task</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Priority</th>
                        <th className="p-2">Due</th>
                        <th className="p-2">Tags</th>
                        <th className="p-2">Assignees</th>
                        <th className="p-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((t) => (
                        <tr key={t.id} className="border-b last:border-0 hover:bg-neutral-50">
                          <td className="p-2 font-medium text-neutral-900 break-words max-w-[360px]">{t.title}</td>
                          <td className="p-2 text-neutral-700">{STATUS_LABEL[t.status]}</td>
                          <td className="p-2"><Badge variant="outline" className={cn("border", PRIORITY_TONE[t.priority])}>{PRIORITY_LABEL[t.priority]}</Badge></td>
                          <td className="p-2 text-neutral-700">{t.due ? new Date(t.due).toLocaleDateString() : "—"}</td>
                          <td className="p-2 text-neutral-700 break-words max-w-[240px]">{t.tags.map((x) => `#${x}`).join(", ")}</td>
                          <td className="p-2">{settings.showAssignees ? <Assignees ids={t.assignees} /> : "—"}</td>
                          <td className="p-2 text-right">
                            <Button size="icon" variant="ghost" onClick={() => setSelected(t)}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar view */}
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
              <Card className="border-neutral-200 bg-white md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Calendar</CardTitle>
                  <CardDescription>Plan by due dates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={calendarDate} onSelect={setCalendarDate} className="rounded-md border" />
                </CardContent>
              </Card>

              <Card className="border-neutral-200 bg-white md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming</CardTitle>
                  <CardDescription>Tasks sorted by nearest due date.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {tasks
                    .filter((t) => t.due)
                    .sort((a, b) => new Date(a.due!).getTime() - new Date(b.due!).getTime())
                    .map((t) => (
                      <div key={t.id} className="flex items-center justify-between rounded-xl border p-3">
                        <div>
                          <div className="font-medium text-neutral-900">{t.title}</div>
                          <div className="text-xs text-neutral-500">{STATUS_LABEL[t.status]} · {PRIORITY_LABEL[t.priority]}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="bg-neutral-100 text-neutral-700">
                            {new Date(t.due!).toLocaleDateString()}
                          </Badge>
                          <Button variant="secondary" onClick={() => setSelected(t)}>Open</Button>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity log */}
          <TabsContent value="activity">
            <Card className="border-neutral-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Activity</CardTitle>
                <CardDescription>Recent task changes across your workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Luna moved 'Connect to Posts & Marketplace' to Review.", "Andi created 'Add sharable links + invites'.", "Arber uploaded an attachment to 'Activity log + notifications'."].map((line, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={i % 2 ? USERS.u2.avatar : USERS.u1.avatar} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm text-neutral-800">{line}</div>
                        <div className="text-xs text-neutral-500">{new Date().toLocaleString()}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Right-side details drawer (inline) */}
        {selected && (
          <div className="fixed right-5 top-[84px] z-30 w-[380px] max-w-[92vw] rounded-2xl border border-neutral-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <div className="min-w-0">
                <div className="text-sm uppercase tracking-wide text-neutral-400">Task</div>
                <div className="text-lg font-semibold text-neutral-900 break-words line-clamp-2">{selected.title}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelected(null)} aria-label="Close details">
                ✕
              </Button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <Label>Description</Label>
                <Textarea className="mt-1" defaultValue={selected.description} rows={4} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <Select defaultValue={selected.status}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_ORDER.map((s) => (
                        <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select defaultValue={selected.priority}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["low", "medium", "high", "urgent"].map((p) => (
                        <SelectItem key={p} value={p}>{PRIORITY_LABEL[p as Task["priority"]]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Due date</Label>
                <Input type="date" className="mt-1" defaultValue={selected.due ? new Date(selected.due).toISOString().split('T')[0] : ""} />
              </div>

              <div>
                <Label>Tags</Label>
                <Input className="mt-1" defaultValue={selected.tags.join(", ")} placeholder="ui, desktop, backend..." />
              </div>

              {selected.linked && selected.linked.length > 0 && (
                <div>
                  <Label>Connected to</Label>
                  <div className="mt-1 space-y-2">
                    {selected.linked.map((link, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <ExternalLink className="h-4 w-4 text-neutral-500" />
                        <span className="text-neutral-600">{link.type}:</span>
                        <span className="font-medium">{link.ref}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">Save changes</Button>
                <Button size="sm" variant="outline" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Dialog */}
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          settings={settings}
          setSettings={setSettings}
          onApplyDefaultTab={(tab) => setTab(tab)}
        />
      </div>
    </TooltipProvider>
  );
}
