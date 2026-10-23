import { useEffect, useState } from "react";
import { Copy, RotateCcw, Trash2, Sparkles, Loader2, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AiResult } from "@/lib/ai.functions";

export function OutputPanel({ result, loading, onRegenerate, onClear }: { result: AiResult | null; loading: boolean; onRegenerate: () => void; onClear: () => void }) {
  const [text, setText] = useState("");
  useEffect(() => setText(result?.text ?? ""), [result]);

  return (
    <div className="surface-card flex h-full flex-col p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold">Output</h2>
        {result && (
          result.mode === "ai" ? (
            <span className="badge-ai"><Sparkles className="h-3 w-3" /> AI-generated</span>
          ) : (
            <span className="badge-demo"><FlaskConical className="h-3 w-3" /> Demo mode</span>
          )
        )}
      </div>
      {result?.mode === "demo" && result.notice && (
        <p className="mb-3 rounded-lg bg-warning-soft px-3 py-2 text-xs text-warning-foreground">{result.notice} Showing a sample template instead.</p>
      )}
      {loading ? (
        <div className="flex min-h-[320px] flex-1 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating…
        </div>
      ) : (
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your generated content will appear here. You can edit it freely."
          className="min-h-[320px] flex-1 resize-y font-mono text-sm leading-relaxed"
          aria-label="Editable output"
        />
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!text || loading}
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="h-4 w-4" /> Copy
        </Button>
        <Button variant="outline" size="sm" disabled={!result || loading} onClick={onRegenerate}>
          <RotateCcw className="h-4 w-4" /> Regenerate
        </Button>
        <Button variant="ghost" size="sm" disabled={(!text && !result) || loading} onClick={() => { setText(""); onClear(); }}>
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-lg border border-border bg-muted px-4 py-3 text-xs text-muted-foreground">
      <strong className="text-foreground">Responsible AI:</strong> Always review and verify generated content before using it. Do not enter confidential, personal or sensitive workplace information.
    </p>
  );
}
