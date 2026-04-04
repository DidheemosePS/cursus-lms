import Image from "next/image";
import { timeStampStyling } from "@/utils/timestamp-formatter";
import { ChatMessagesProps } from "./chat-messages";

export function MessageBoxLeft({ message }: { message: ChatMessagesProps }) {
  const { timePart } = timeStampStyling(message.createdAt);
  return (
    <div className="flex gap-3 max-w-[85%] md:max-w-[70%]">
      <div className="rounded-full size-8 self-end mb-1 shrink-0 overflow-hidden">
        <Image
          src={message.sender.avatar}
          alt="avatar"
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-[#616f89] ml-1 font-medium">
          {message?.sender.name}
        </span>
        <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-[#e5e7eb] shadow-sm text-[#111318] text-sm leading-relaxed">
          {message?.content}
        </div>
        <span className="text-[10px] text-[#616f89]">{timePart}</span>
      </div>
    </div>
  );
}

export function MessageBoxRight({ message }: { message: ChatMessagesProps }) {
  const { timePart } = timeStampStyling(message.createdAt);
  return (
    <div className="flex gap-3 max-w-[85%] md:max-w-[70%] ml-auto flex-row-reverse">
      <div className="flex flex-col gap-1 items-end">
        <div
          className={`bg-blue-500 p-3 rounded-2xl rounded-br-none border border-[#e5e7eb] shadow-sm text-white text-sm leading-relaxed`}
        >
          {message.content}
        </div>
        <div className="flex items-center gap-1 mr-1">
          <span className="text-[10px] text-[#616f89]">{timePart}</span>
        </div>
      </div>
    </div>
  );
}
