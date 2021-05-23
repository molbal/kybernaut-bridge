<center><img src="logo.png" width=250 height=250></center>

# Kybernaut Bridge

This is a bridge to push zKillboard littlekill events from its websocket to the Abyss Tracker via a webhook.

## Config

ENV variables:
- `HOST_URL`: Abyss Tracker webhook listen endpoint **(mandatory)**
- `PASSCODE`: Passcode specified by the Abyss Tracker **(mandatory)**
- `REGION_IDS`: Region IDs, separated by semicolons (`;`) **(mandatory)**
- `ZKILLBOARD_HOST` Set to use any other host than `wss://zkillboard.com/websocket/` *(optional)*
