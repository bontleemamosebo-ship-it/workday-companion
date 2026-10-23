# Workday Companion

Build a modern, responsive web application called AI Workplace Productivity Assistant to help professionals generate emails, summarize meetings, and plan tasks efficiently.

Design

Use a clean SaaS design with light-grey backgrounds, dark-charcoal text, white cards, subtle shadows, rounded corners, professional typography, and a responsive layout for desktop, tablet, and mobile.

 Dashboard

Create a sidebar with Dashboard, Email Generator, Meeting Summarizer, Task Planner, and Settings. The main dashboard should include a welcome message, tool cards, quick actions, and recent outputs.

Features

Smart Email Generator: Generate context-specific emails with Formal, Friendly, and Persuasive tones.

Meeting Notes Summarizer: Summarize pasted notes and extract decisions, action items, owners, and deadlines.

AI Task Planner: Create daily or weekly schedules based on tasks, priorities, and deadlines.

Make outputs editable and provide Copy, Clear, and Regenerate buttons.

AI Used

Use real AI-generated, context-aware responses through a compatible AI API if configured. Create structured prompts for each tool. Never expose secret API keys. If AI is unavailable, clearly label demo mode instead of pretending responses are AI-generated.

Requirements

Use React and Tailwind CSS. Build a frontend-only application with no backend, database, or authentication. Store temporary data in client-side state. Ensure all navigation and buttons work, forms validate inputs, and the interface is fully responsive.

Include a responsible AI disclaimer: users must verify generated content and avoid entering confidential workplace information.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/762b1603-5b6d-4ba7-88f4-386780041d0a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
