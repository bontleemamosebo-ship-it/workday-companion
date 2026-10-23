import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Disclaimer } from "@/components/OutputPanel";
import { PageHeader } from "@/components/FieldError";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Assistant" },
      { name: "description", content: "Personalise your AI workplace assistant." },
      { property: "og:title", content: "Settings — AI Workplace Assistant" },
      { property: "og:description", content: "Set your name, default tone and demo mode." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, setSettings, clearOutputs } = useApp();
  const [s, setS] = useState(settings);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" desc="Settings last for this browser session only." />
      <div className="surface-card space-y-6 p-6">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" className="mt-1" maxLength={60} value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="tone">Default email tone</Label>
          <select id="tone" className="mt-1 h-9 w-full rounded-md border border-input bg-card px-2 text-sm" value={s.defaultTone} onChange={(e) => setS({ ...s, defaultTone: e.target.value })}>
            <option>Formal</option><option>Friendly</option><option>Persuasive</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="demo">Demo mode</Label>
            <p className="text-xs text-muted-foreground">Use sample templates instead of AI. Outputs are clearly labelled.</p>
          </div>
          <Switch id="demo" checked={s.forceDemo} onCheckedChange={(v) => setS({ ...s, forceDemo: v })} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { setSettings({ ...s, name: s.name.trim() }); toast.success("Settings saved"); }}>Save settings</Button>
          <Button variant="outline" onClick={() => { clearOutputs(); toast.success("Recent outputs cleared"); }}>Clear recent outputs</Button>
        </div>
      </div>
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
