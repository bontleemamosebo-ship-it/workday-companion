import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, CalendarCheck, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/OutputPanel";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Your AI workspace for emails, meeting summaries and task plans." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Generate emails, summarize meetings and plan tasks with AI." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft context-aware emails in Formal, Friendly or Persuasive tones." },
  { to: "/meetings", icon: NotebookPen, title: "Meeting Summarizer", desc: "Turn raw notes into decisions, action items, owners and deadlines." },
  { to: "/tasks", icon: CalendarCheck, title: "AI Task Planner", desc: "Build daily or weekly schedules from priorities and deadlines." },
] as const;

const toolLabel = { email: "Email", meeting: "Meeting", tasks: "Plan" };

function Dashboard() {
  const { outputs, settings, clearOutputs } = useApp();
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section>
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{greet}{settings.name ? `, ${settings.name}` : ""} 👋</h1>
        <p className="mt-1 text-muted-foreground">What would you like to get done today?</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="surface-card group p-6 transition hover:-translate-y-0.5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><t.icon className="h-5 w-5" /></div>
            <h2 className="font-display font-semibold">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-foreground">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </section>

      <section className="surface-card p-6">
        <h2 className="mb-4 font-display font-semibold">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild><Link to="/email"><Plus className="h-4 w-4" /> New email</Link></Button>
          <Button asChild variant="outline"><Link to="/meetings"><Plus className="h-4 w-4" /> Summarize notes</Link></Button>
          <Button asChild variant="outline"><Link to="/tasks"><Plus className="h-4 w-4" /> Plan my day</Link></Button>
        </div>
      </section>

      <section className="surface-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-semibold">Recent outputs</h2>
          {outputs.length > 0 && <Button variant="ghost" size="sm" onClick={clearOutputs}>Clear all</Button>}
        </div>
        {outputs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing yet. Outputs from this session will appear here.</p>
        ) : (
          <ul className="divide-y divide-border">
            {outputs.map((o) => (
              <li key={o.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">{toolLabel[o.tool]}: {o.title}</span>
                  <span className={o.mode === "ai" ? "badge-ai" : "badge-demo"}>{o.mode === "ai" ? "AI" : "Demo"}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{o.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{o.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Disclaimer />
    </div>
  );
}
