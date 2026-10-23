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
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      { name: "description", content: "Generate formal, friendly or persuasive workplace emails with AI." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Context-aware workplace emails in three tones." },
    ],
  }),
  component: EmailPage,
});

const tones = ["Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const { settings } = useApp();
  const g = useGenerate("email");
  const [f, setF] = useState({ tone: settings.defaultTone, recipient: "", purpose: "", context: "", sender: settings.name });
  const [err, setErr] = useState<{ recipient?: string; purpose?: string; context?: string }>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: { recipient?: string; purpose?: string; context?: string } = {};
    if (f.recipient.trim().length < 2) er.recipient = "Enter who the email is for.";
    if (f.purpose.trim().length < 3) er.purpose = "Describe the purpose (min 3 characters).";
    if (f.context.trim().length < 10) er.context = "Add some key points (min 10 characters).";
    setErr(er);
    if (Object.keys(er).length) return;
    g.run(f, f.purpose);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Smart Email Generator" desc="Describe your email and pick a tone." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="surface-card space-y-4 p-5" noValidate>
          <div>
            <Label>Tone</Label>
            <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup">
              {tones.map((t) => (
                <Button key={t} type="button" role="radio" aria-checked={f.tone === t} variant={f.tone === t ? "default" : "outline"} onClick={() => setF({ ...f, tone: t })}>{t}</Button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="recipient">Recipient</Label>
            <Input id="recipient" className="mt-1" placeholder="e.g. Sarah, Head of Marketing" value={f.recipient} onChange={(e) => setF({ ...f, recipient: e.target.value })} />
            <FieldError msg={err.recipient} />
          </div>
          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Input id="purpose" className="mt-1" placeholder="e.g. Request budget approval for Q4 campaign" value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })} />
            <FieldError msg={err.purpose} />
          </div>
          <div>
            <Label htmlFor="context">Key points / context</Label>
            <Textarea id="context" className="mt-1 min-h-[140px]" maxLength={4000} placeholder="What should the email say?" value={f.context} onChange={(e) => setF({ ...f, context: e.target.value })} />
            <FieldError msg={err.context} />
          </div>
          <div>
            <Label htmlFor="sender">Your name (optional)</Label>
            <Input id="sender" className="mt-1" value={f.sender} onChange={(e) => setF({ ...f, sender: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" disabled={g.loading}><Sparkles className="h-4 w-4" /> Generate email</Button>
        </form>
        <OutputPanel result={g.result} loading={g.loading} onRegenerate={g.regenerate} onClear={g.clear} />
      </div>
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
