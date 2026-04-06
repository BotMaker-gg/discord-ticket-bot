# Discord Ticket Bot - Free Open-Source Support Ticket System

A free, open-source Discord ticket bot with button panels, automatic ticket channels, role-based permissions, and close confirmations. A lightweight, self-hostable alternative to [Ticket Tool](https://tickettool.xyz/), [Helper.gg](https://helper.gg/), and other premium ticket bots.

Built with [BotMaker.gg](https://botmaker.gg) - the AI-powered Discord bot builder.

## Features

- **Button-based ticket panels** - No reactions needed. Users click a button to open a ticket
- **Automatic ticket channels** - Creates private channels with proper permissions
- **Role-based access** - Auto-creates and assigns a "Support" staff role
- **Ticket categories** - Organizes tickets under a "Tickets" category
- **Close confirmations** - Prevents accidental ticket closures
- **Duplicate prevention** - One ticket per user at a time
- **Permission controls** - Only admins can create panels, only staff/creator can close tickets
- **Auto-cleanup** - Channels are deleted 5 seconds after closing
- **Lightweight** - No database required for basic operation, SQLite included for extensions
- **Self-hosted** - You own the bot, your data stays on your server

## Commands

| Command | Permission | Description |
|---------|-----------|-------------|
| `/ticket-panel` | Manage Channels | Creates a ticket panel with an "Open Ticket" button |

## Quick Start

### 1. Create a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** and name it
3. Go to **Bot** tab and click **Reset Token** - copy the token
4. Enable **Message Content Intent** under Privileged Gateway Intents
5. Go to **OAuth2 > URL Generator**, select `bot` + `applications.commands`
6. Select permissions: `Manage Channels`, `Manage Roles`, `Send Messages`, `View Channels`
7. Copy the invite URL and add the bot to your server

### 2. Install and Run

```bash
git clone https://github.com/BotMakerGG/discord-ticket-bot.git
cd discord-ticket-bot
npm install
```

Create a `.env` file:

```env
DISCORD_TOKEN=your_bot_token_here
GUILD_ID=your_server_id_here
```

Start the bot:

```bash
node src/index.js
```

### 3. Create a Ticket Panel

Run `/ticket-panel` in any channel. Users can click the button to open support tickets.

## How It Works

1. Admin runs `/ticket-panel` in a channel
2. Bot posts an embed with an "Open Ticket" button
3. User clicks the button - bot creates a private `ticket-username` channel
4. Only the user, the bot, and anyone with the "Support" role can see the channel
5. Staff or the ticket creator can click "Close Ticket" to close it
6. After confirmation, the channel is deleted

## Project Structure

```
src/
  index.js                      # Bot startup, command/event loader
  db.js                         # SQLite database helper (for extensions)
  commands/
    ticket-panel.js             # /ticket-panel slash command
  events/
    interactionCreate.js        # Button interaction handler (open/close tickets)
  utils/
    format.js                   # Number formatting utilities
```

## Customization

This bot is fully open-source. Fork it and add:

- **Ticket transcripts** - Save conversation logs before closing
- **Ticket categories** - Multiple panel types (billing, technical, general)
- **Claim system** - Staff can claim tickets to prevent duplicate responses
- **Auto-close** - Close inactive tickets after X hours
- **Feedback/ratings** - Ask users to rate support after closing
- **Ticket logs** - Send ticket summaries to a log channel
- **Priority levels** - High/medium/low priority tickets

Or use [BotMaker.gg](https://botmaker.gg) to add these features with AI - describe what you want in plain English and deploy in seconds.

## One-Click Deploy with BotMaker.gg

Don't want to self-host? Clone this bot on [BotMaker.gg](https://botmaker.gg) and get:

- **Free hosting** with one-click deploy
- **AI-powered customization** - add features by describing them
- **Web-based code editor** - modify the source in your browser
- **24/7 uptime** - no need to keep your computer running

[Clone this bot on BotMaker.gg](https://botmaker.gg/bots)

## Tech Stack

- [Discord.js](https://discord.js.org/) v14 - Discord API library
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - Embedded database
- Node.js 18+ with ES modules

## Alternatives Comparison

| Feature | This Bot | Ticket Tool | Helper.gg |
|---------|----------|-------------|-----------|
| Price | **Free** | Free / $4/mo | $5/mo+ |
| Open Source | **Yes** | No | No |
| Self-Hosted | **Yes** | No | No |
| Custom Code | **Yes** | No | No |
| Button Panels | Yes | Yes | Yes |
| Transcripts | Add yourself | Premium | Yes |
| Forms | Add yourself | Premium | Yes |
| No vendor lock-in | **Yes** | No | No |

## License

MIT License - use it however you want.

## Links

- [BotMaker.gg](https://botmaker.gg) - AI-powered Discord bot builder
- [Clone this bot](https://botmaker.gg/bots) - One-click deploy, no coding required
- [Discord.js Guide](https://discordjs.guide/) - Learn Discord bot development
