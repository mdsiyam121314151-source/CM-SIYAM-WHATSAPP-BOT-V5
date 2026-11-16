
# RJ-siyam whatsapp-botV5

Author: 𝐑𝐉 𝐬𝐢𝐲𝐚𝐦

Version: 5.0.0

## Requirements

- Node.js 20 or newer
- npm
- WhatsApp account

## Installation

Run:

npm install

## Environment Configuration

Create a file named .env in the root folder.

Example:

BOT_PHONE_NUMBER=8801XXXXXXXXX
OWNER_NUMBER=8801XXXXXXXXX
BOT_ADMINS=8801XXXXXXXXX
WHITELIST=8801XXXXXXXXX
BOT_PREFIX=.
MESSAGE_MODE=all
LOG_LEVEL=info

Use your own phone numbers.

## Start

npm start

## Pairing

1. Start the bot.
2. Wait for the pairing code in the terminal.
3. Open WhatsApp.
4. Go to Linked Devices.
5. Select Link a Device.
6. Select Link with phone number instead.
7. Enter the pairing code.

## Commands

Put command files inside:

scripts/cmds/

## Events

Put event files inside:

scripts/events/

## Session

WhatsApp session files are stored inside:

session/

Keep this folder persistent.

## Important

Do not share your session folder or credentials.

This project uses an unofficial WhatsApp connection library.
Account restrictions and hosting limitations are possible.
