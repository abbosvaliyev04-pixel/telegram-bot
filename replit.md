# Telegram Bot

A Telegram bot with two main features: list numbering and AI-powered grammar/spell checking in multiple languages.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server + Telegram bot (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Bot: node-telegram-bot-api (polling mode)
- AI: Replit AI Integrations → OpenAI gpt-5-mini for grammar correction
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/bot/index.ts` — main bot logic, command handlers, user mode state
- `artifacts/api-server/src/bot/numbering.ts` — list numbering feature
- `artifacts/api-server/src/bot/grammar.ts` — AI grammar/spell check feature
- `artifacts/api-server/src/index.ts` — server entry point, bot startup

## Bot Features

1. **/number** — User sends a list of words/items (one per line); bot returns them numbered 1 to N
2. **/grammar** — User sends any text; bot auto-detects the language and returns the corrected version (supports English, German, Russian, Uzbek, and more)
3. **/help** — Shows available commands

## Architecture decisions

- Bot runs in polling mode alongside the Express server in the same process
- User mode state is stored in a `Map<chatId, mode>` in memory — lightweight and sufficient for a single-instance bot
- Grammar correction uses `gpt-5-mini` for cost efficiency while maintaining quality
- Grammar/spell check returns the text unchanged if no errors are found

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Requires `TELEGRAM_BOT_TOKEN` secret (set via Replit Secrets)
- Requires `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY` (auto-provisioned via Replit AI Integrations)
- Bot uses polling mode — only one running instance is supported at a time

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
