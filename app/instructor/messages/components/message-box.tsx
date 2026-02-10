import Image from "next/image";
import Refresh from "@/assets/icons/refresh.svg";

interface MessageBoxProps {
  id: number;
  user_id: number;
  avatar: string;
  name: string;
  message: string;
  timestamp: string;
  status: string;
}

export function MessageBoxLeft({ message }: { message: MessageBoxProps }) {
  return (
    <div className="flex gap-3 max-w-[85%] md:max-w-[70%]">
      <div className="aspect-square rounded-full size-8 self-end mb-1 shrink-0 overflow-hidden">
        <Image
          src={message.avatar}
          alt="avatar"
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-[#616f89] ml-1 font-medium">
          {message?.name}
        </span>
        <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-[#e5e7eb] shadow-sm text-[#111318] text-sm leading-relaxed">
          {message?.message}
        </div>
        <span className="text-[10px] text-[#616f89]">{message?.timestamp}</span>
      </div>
    </div>
  );
}

export function MessageBoxRight({ message }: { message: MessageBoxProps }) {
  return (
    <div className="flex gap-3 max-w-[85%] md:max-w-[70%] ml-auto flex-row-reverse">
      <div className="flex flex-col gap-1 items-end">
        <div
          className={`${
            message?.status.toUpperCase() === "DELIVERED"
              ? "bg-[#135BEC]"
              : "bg-[#135BEC]/50"
          } p-3 rounded-2xl rounded-br-none border border-[#e5e7eb] shadow-sm text-white text-sm leading-relaxed`}
        >
          {message.message}
        </div>
        <div className="flex items-center gap-1 mr-1">
          {message?.status.toUpperCase() === "DELIVERED" ? (
            <>
              <span className="text-[10px] text-[#616f89] font-medium">
                {message.status}
              </span>
              <span className="text-[10px] text-[#616f89]">
                {message?.timestamp}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-1 mr-1 text-red-500 cursor-pointer">
              <Refresh className="size-3.5" />
              <span className="text-[10px] font-medium">Failed to send</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
