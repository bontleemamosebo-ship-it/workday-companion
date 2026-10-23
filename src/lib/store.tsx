import { createContext, useContext, useState, type ReactNode } from "react";

export type OutputItem = { id: string; tool: "email" | "meeting" | "tasks"; title: string; text: string; mode: "ai" | "demo"; at: Date };
type Settings = { name: string; forceDemo: boolean; defaultTone: string };

type Ctx = {
  outputs: OutputItem[];
  addOutput: (o: Omit<OutputItem, "id" | "at">) => void;
  clearOutputs: () => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [settings, setSettings] = useState<Settings>({ name: "", forceDemo: false, defaultTone: "Formal" });
  return (
    <AppCtx.Provider
      value={{
        outputs,
        addOutput: (o) => setOutputs((p) => [{ ...o, id: crypto.randomUUID(), at: new Date() }, ...p].slice(0, 20)),
        clearOutputs: () => setOutputs([]),
        settings,
        setSettings,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
