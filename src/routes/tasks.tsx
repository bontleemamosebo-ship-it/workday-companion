import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OutputPanel, Disclaimer } from "@/components/OutputPanel";
import { FieldError, PageHeader } from "@/components/FieldError";
import { useGenerate } from "@/lib/useGenerate";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      { name: "description", content: "Create daily or weekly schedules from tasks, priorities and deadlines." },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Plan your day or week around priorities and deadlines." },
    ],
  }),
  component: TasksPage,
});

type Task = { name: string; priority: string; deadline: string };
const empty: Task = { name: "", priority: "Medium", deadline: "" };

function TasksPage() {
  const g = useGenerate("tasks");
  const [period, setPeriod] = useState("daily");
  const [hours, setHours] = useState({ start: "09:00", end: "17:00" });
  const [tasks, setTasks] = useState<Task[]>([{ ...empty }]);
  const [err, setErr] = useState<string>();

  const update = (i: number, t: Partial<Task>) => setTasks(tasks.map((x, j) => (j === i ? { ...x, ...t } : x)));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const valid = tasks.filter((t) => t.name.trim());
    if (!valid.length) return setErr("Add at least one task.");
    if (hours.start >= hours.end) return setErr("End time must be after start time.");
    setErr(undefined);
    g.run(
      { period, hours: `${hours.start}–${hours.end}`, tasks: valid.map((t) => `${t.name} | ${t.priority} | ${t.deadline || "none"}`).join("\n") },
      `${period === "daily" ? "Daily" : "Weekly"} plan (${valid.length} tasks)`,
    );
  };

  const selectCls = "h-9 rounded-md border border-input bg-card px-2 text-sm";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="AI Task Planner" desc="List your tasks and get a realistic schedule." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="surface-card space-y-4 p-5" noValidate>
          <div className="grid grid-cols-2 gap-2">
            {["daily", "weekly"].map((p) => (
              <Button key={p} type="button" variant={period === p ? "default" : "outline"} onClick={() => setPeriod(p)} className="capitalize">{p}</Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="start">Start</Label><Input id="start" type="time" className="mt-1" value={hours.start} onChange={(e) => setHours({ ...hours, start: e.target.value })} /></div>
            <div><Label htmlFor="end">End</Label><Input id="end" type="time" className="mt-1" value={hours.end} onChange={(e) => setHours({ ...hours, end: e.target.value })} /></div>
          </div>
          <div className="space-y-3">
            <Label>Tasks</Label>
            {tasks.map((t, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_auto_auto_auto]">
                <Input aria-label="Task name" placeholder="Task" value={t.name} maxLength={200} onChange={(e) => update(i, { name: e.target.value })} className="col-span-2 sm:col-span-1" />
                <select aria-label="Priority" className={selectCls} value={t.priority} onChange={(e) => update(i, { priority: e.target.value })}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
                <Input aria-label="Deadline" type="date" value={t.deadline} onChange={(e) => update(i, { deadline: e.target.value })} className="w-auto" />
                <Button type="button" variant="ghost" size="icon" aria-label="Remove task" disabled={tasks.length === 1} onClick={() => setTasks(tasks.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setTasks([...tasks, { ...empty }])} disabled={tasks.length >= 20}><Plus className="h-4 w-4" /> Add task</Button>
          </div>
          <FieldError msg={err} />
          <Button type="submit" className="w-full" disabled={g.loading}><Sparkles className="h-4 w-4" /> Create plan</Button>
        </form>
        <OutputPanel result={g.result} loading={g.loading} onRegenerate={g.regenerate} onClear={g.clear} />
      </div>
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
