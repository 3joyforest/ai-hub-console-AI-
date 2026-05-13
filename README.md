# AI Hub Console

AI Hub Console is a local-first dashboard prototype for tracking AI tool usage, quotas, credits, and sound alerts.

The first version focuses on a lightweight personal dashboard:

- AI tool usage statistics
- Daily, weekly, and monthly views
- Monthly plan and daily spending limit
- Extra credit balance tracking
- Token and cost trends
- Sound alerts for task completion, approvals, and quota warnings
- Tool data-source connection states

This is currently a static frontend MVP. It does not yet read real Codex, Claude Code, Cursor, OpenAI, or Anthropic usage data.

## Preview

Open `index.html` directly in a browser, or run a local static server.

## Local Setup

No package installation is required.

```bash
git clone <your-repo-url>
cd <repo-folder>
```

Then open:

```bash
open index.html
```

On Windows, double-click `index.html` or open it from your browser.

## Local Deployment

For a more realistic local environment, serve the folder with a static server.

Using Python:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

Using Node.js:

```bash
npx serve .
```

Then open the URL printed by `serve`.

## Current Features

### Usage Dashboard

- View total token usage
- View estimated cost
- Switch between today, this week, and this month
- Compare usage across Codex, Claude Code, ChatGPT, and Local Llama

### Budget And Balance

- Monthly plan display
- Daily spending limit
- Remaining daily budget
- Monthly token allowance
- Remaining token estimate
- Extra credit balance
- Estimated top-up deduction when daily budget is exceeded

### Tool Connections

The UI separates tools by realistic data-source connection types:

- Codex: detect local install, change data directory, rescan
- Claude Code: choose log directory, change log directory, rescan
- ChatGPT/OpenAI: add API key, switch key, resync
- Local Llama: choose local service, switch service, test connection

These actions are simulated in the static MVP.

### Sound Alerts

The prototype includes browser-based sound alerts for:

- Task completion
- Approval required
- Daily cost warning
- Monthly token warning
- Low top-up balance

You can test alert sounds directly from the notification center.

### Trends

The dashboard includes lightweight charts without external libraries:

- 7-day cost trend
- 7-day token usage trend
- Recent tool share trend

## What Is Not Implemented Yet

This prototype does not yet:

- Read real Codex or Claude Code local logs
- Authenticate with OpenAI, Anthropic, or Gemini
- Store API keys
- Save settings after refresh
- Run as a desktop app
- Send system-level notifications
- Run in the background

## Recommended Roadmap

1. Save settings with `localStorage`
2. Add manual usage import through JSON or CSV
3. Add real local data readers for Codex and Claude Code
4. Add OpenAI/Anthropic API key support
5. Add background monitoring and system notifications
6. Package as a Tauri or Electron desktop app

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
└── README.md
```

## GitHub Pages Deployment

This project can be deployed directly to GitHub Pages because it is a static site.

1. Push the repository to GitHub.
2. Open the repository settings.
3. Go to **Pages**.
4. Set source to the main branch.
5. Select the root folder.
6. Save and wait for GitHub Pages to publish the site.

## License

MIT
