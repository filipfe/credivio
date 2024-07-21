## Run Locally

Install dependencies

```bash
  npm install
```

Start Supabase

```bash
  npm run supabase:dev
```

Start the Next server

```bash
  npm run web
```

### Receipts scanning and Telegram Bot

To use any of these feature locally install [Ngrok](https://ngrok.com/download). Set your auth-token, tunnel the Supabase API and update env variables:

```bash
  ngrok config add-authtoken <token>
  ngrok http 54321
```

```env
  NGROK_URL=https://<assigned_subdomain>.ngrok-free.app
```

Create a new Telegram Bot through [Bot Father](https://web.telegram.org/k/#@BotFather) and update env variables:

```env
  TELEGRAM_BOT_TOKEN=<bot:token>
  TELEGRAM_BOT_SECRET=<new_password_to_your_bot>
```

Set up a webhook, replace fields with your env variables and enter the following URL in the browser:

```bash
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<NGROK_URL>/functions/v1/telegram-bot?secret=<TELEGRAM_BOT_SECRET>
```

Restart the Edge Functions runtime

```bash
  npm run supabase:dev
```

## Deployment

To deploy a new feature:

- Branch off from master with a new feature _<platform>/<feat>_
- Create a Pull Request to _staging_ branch
- Github Actions will automatically handle migrations and edge functions

## Known Issues

### supabase start

Sometimes on Windows, after running _supabase start_, one of the ports is being blocked by winnat:

```cmd
failed to start docker container: Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:54322 -> 0.0.0.0:0: listen tcp 0.0.0.0:54322: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
```

To resolve this:

```cmd
net stop winnat
// start the supabase container
npm run supabase:dev
net start winnat
```
