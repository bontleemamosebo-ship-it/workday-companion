<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- AI calls go through `generateContent` server function (src/lib/ai.functions.ts) via raw fetch to the gateway; it falls back to labelled demo output from src/lib/prompts.ts so the key never reaches the browser.
- App state (outputs, settings) is in-memory React context (src/lib/store.tsx); the user asked for no database or login.
