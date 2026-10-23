export type ToolInput =
  | { tool: "email"; data: Record<string, string> }
  | { tool: "meeting"; data: Record<string, string> }
  | { tool: "tasks"; data: Record<string, string> };

const RULES =
  "Write in plain text (no markdown tables). Be concise, professional and specific to the user's context. Do not invent facts beyond what is given; mark unknowns as [TBD].";

export function buildPrompt(input: ToolInput): { system: string; user: string } {
  const d = input.data;
  if (input.tool === "email") {
    return {
      system: `You are an expert workplace communication assistant. Draft a complete email with a "Subject:" line, greeting, body and sign-off. Tone guide — Formal: polished and respectful; Friendly: warm and approachable; Persuasive: benefit-led with a clear call to action. ${RULES}`,
      user: `Tone: ${d.tone}\nRecipient: ${d.recipient}\nPurpose: ${d.purpose}\nKey points / context:\n${d.context}\nSender name: ${d.sender || "[Your name]"}`,
    };
  }
  if (input.tool === "meeting") {
    return {
      system: `You are an expert meeting analyst. From raw meeting notes produce these sections, each headed in CAPS: SUMMARY (3-5 sentences), KEY DECISIONS (bullets), ACTION ITEMS (each line: "- Task — Owner: name — Deadline: date"; use [TBD] if missing), OPEN QUESTIONS. ${RULES}`,
      user: `Meeting title: ${d.title || "Untitled"}\nNotes:\n${d.notes}`,
    };
  }
  return {
    system: `You are a productivity coach. Build a realistic ${d.period === "weekly" ? "weekly (Mon–Fri)" : "daily"} schedule from the tasks given. Order by priority (High first) and deadlines, include short breaks, respect working hours, and end with a "TIPS" section of 2-3 focus tips. Use time blocks like "09:00–10:30 — Task (Priority)". ${RULES}`,
    user: `Period: ${d.period}\nWorking hours: ${d.hours}\nTasks (task | priority | deadline):\n${d.tasks}`,
  };
}

export function demoOutput(input: ToolInput): string {
  const d = input.data;
  const tag = "[DEMO MODE — sample template, not AI-generated]\n\n";
  if (input.tool === "email") {
    const opener =
      d.tone === "Friendly" ? `Hi ${d.recipient},\n\nHope you're doing well!` : d.tone === "Persuasive" ? `Dear ${d.recipient},\n\nI'd like to share an opportunity that I believe will make a real difference.` : `Dear ${d.recipient},\n\nI hope this message finds you well.`;
    return `${tag}Subject: ${d.purpose}\n\n${opener}\n\nI'm writing regarding ${d.purpose.toLowerCase()}.\n\n${d.context}\n\n${d.tone === "Persuasive" ? "Could we schedule a short call this week to move this forward?" : "Please let me know if you have any questions."}\n\n${d.tone === "Friendly" ? "Cheers" : "Kind regards"},\n${d.sender || "[Your name]"}`;
  }
  if (input.tool === "meeting") {
    const lines = d.notes.split("\n").map((l) => l.trim()).filter(Boolean);
    const decisions = lines.filter((l) => /decid|agree|approv/i.test(l));
    const actions = lines.filter((l) => /will|todo|action|assign|by /i.test(l));
    return `${tag}SUMMARY\n${d.title || "Meeting"} covered ${lines.length} note line(s). First point: ${lines[0] ?? "—"}\n\nKEY DECISIONS\n${(decisions.length ? decisions : ["[TBD]"]).map((l) => `- ${l}`).join("\n")}\n\nACTION ITEMS\n${(actions.length ? actions : ["[TBD]"]).map((l) => `- ${l} — Owner: [TBD] — Deadline: [TBD]`).join("\n")}\n\nOPEN QUESTIONS\n- [TBD]`;
  }
  const tasks = d.tasks.split("\n").map((l) => l.trim()).filter(Boolean);
  const rank = (t: string) => (/high/i.test(t) ? 0 : /med/i.test(t) ? 1 : 2);
  const sorted = [...tasks].sort((a, b) => rank(a) - rank(b));
  let h = 9;
  const blocks = sorted.map((t) => {
    const s = `${String(h).padStart(2, "0")}:00–${String(h + 1).padStart(2, "0")}:00 — ${t}`;
    h += h === 11 ? 2 : 1;
    return s;
  });
  return `${tag}${d.period === "weekly" ? "WEEKLY" : "DAILY"} PLAN (${d.hours})\n${blocks.join("\n")}\n\nTIPS\n- Tackle high-priority work first.\n- Take a 5-minute break every hour.`;
}
