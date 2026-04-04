import Pusher from "pusher";
import PusherClient from "pusher-js";

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: "eu",
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  {
    cluster: "eu",
  },
);
