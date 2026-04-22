import Pusher from "pusher";
import PusherClient from "pusher-js";

// Lazy singletons — instantiated on first use, not at import time.
// This prevents Next.js from crashing during build when env vars
// are not available in the build stage.

let _pusher: Pusher | null = null;
let _pusherClient: PusherClient | null = null;

export function getPusher(): Pusher {
  if (!_pusher) {
    if (!process.env.PUSHER_APP_ID)
      throw new Error("Missing env: PUSHER_APP_ID");
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY)
      throw new Error("Missing env: NEXT_PUBLIC_PUSHER_KEY");
    if (!process.env.PUSHER_SECRET)
      throw new Error("Missing env: PUSHER_SECRET");

    _pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: "eu",
      useTLS: true,
    });
  }
  return _pusher;
}

export function getPusherClient(): PusherClient {
  if (!_pusherClient) {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY)
      throw new Error("Missing env: NEXT_PUBLIC_PUSHER_KEY");

    _pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });
  }
  return _pusherClient;
}
