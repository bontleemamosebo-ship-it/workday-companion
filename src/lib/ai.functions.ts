import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildPrompt, demoOutput, type ToolInput } from "./prompts";

const schema = z.object({
  tool: z.enum(["email", "meeting", "tasks"]),
  data: z.record(z.string(), z.string().max(12000)),
  forceDemo: z.boolean().optional(),
});

export type AiResult = { mode: "ai" | "demo"; text: string; notice?: string };

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }): Promise<AiResult> => {
    const input = { tool: data.tool, data: data.data } as ToolInput;
    const key = process.env["LOVABLE_API_KEY"];
    if (data.forceDemo || !key) {
      return { mode: "demo", text: demoOutput(input), notice: data.forceDemo ? "Demo mode is on in Settings." : "AI is not configured." };
    }
    const { system, user } = buildPrompt(input);
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          instructions: system,
          input: user,
          stream: true,
          store: false,
          reasoning: { effort: "low" },
        }),
      });
      if (!res.ok || !res.body) {
        let msg = `AI request failed (${res.status}).`;
        try {
          const j = await res.json();
          msg = j?.error?.message || j?.message || msg;
        } catch {}
        if (res.status === 402) msg = "AI credits are used up. " + msg;
        if (res.status === 429) msg = "Too many requests right now. Please wait a moment and try again.";
        return { mode: "demo", text: demoOutput(input), notice: msg };
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const ev = JSON.parse(payload);
            if (ev.type === "response.output_text.delta") text += ev.delta ?? "";
          } catch {}
        }
      }
      if (!text.trim()) return { mode: "demo", text: demoOutput(input), notice: "The AI returned an empty response." };
      return { mode: "ai", text: text.trim() };
    } catch {
      return { mode: "demo", text: demoOutput(input), notice: "Could not reach the AI service." };
    }
  });
