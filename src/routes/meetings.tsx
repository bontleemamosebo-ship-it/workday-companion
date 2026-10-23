import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OutputPanel, Disclaimer } from "@/components/OutputPanel";
import { FieldError, PageHeader } from "@/components/FieldError";
import { useGenerate } from "@/lib/useGenerate";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      { name: "description", content: "Summarize meeting notes and extract decisions, action items, owners and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      { property: "og:description", content: "Turn raw notes into clear decisions and action items." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const g = useGenerate("meeting");
  const [f, setF] = useState({ title: "", notes: "" });
  const [err, setErr] = useState<string>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (f.notes.trim().length < 30) return setErr("Paste at least 30 characters of meeting notes.");
    setErr(undefined);
    g.run(f, f.title || "Meeting notes");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Meeting Notes Summarizer" desc="Paste your notes to get a summary, decisions and action items." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="surface-card space-y-4 p-5" noValidate>
          <div>
            <Label htmlFor="title">Meeting title (optional)</Label>
            <Input id="title" className="mt-1" placeholder="e.g. Weekly product sync" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea id="notes" className="mt-1 min-h-[280px]" maxLength={10000} placeholder={"- Team agreed to launch on 12 Nov\n- Thabo will finalise the pricing page by Friday\n- Open question: do we need legal review?"} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
            <div className="flex justify-between"><FieldError msg={err} /><span className="ml-auto mt-1 text-xs text-muted-foreground">{f.notes.length}/10000</span></div>
          </div>
          <Button type="submit" className="w-full" disabled={g.loading}><Sparkles className="h-4 w-4" /> Summarize notes</Button>
        </form>
        <OutputPanel result={g.result} loading={g.loading} onRegenerate={g.regenerate} onClear={g.clear} />
      </div>
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
