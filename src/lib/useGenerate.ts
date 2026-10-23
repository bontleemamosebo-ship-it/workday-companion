import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateContent, type AiResult } from "./ai.functions";
import { useApp } from "./store";

export function useGenerate(tool: "email" | "meeting" | "tasks") {
  const fn = useServerFn(generateContent);
  const { settings, addOutput } = useApp();
  const [result, setResult] = useState<AiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<{ data: Record<string, string>; title: string } | null>(null);

  const run = async (data: Record<string, string>, title: string) => {
    setLoading(true);
    setLast({ data, title });
    try {
      const r = await fn({ data: { tool, data, forceDemo: settings.forceDemo } });
      setResult(r);
      addOutput({ tool, title, text: r.text, mode: r.mode });
    } catch {
      setResult({ mode: "demo", text: "", notice: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    loading,
    run,
    regenerate: () => last && run(last.data, last.title),
    clear: () => setResult(null),
  };
}
