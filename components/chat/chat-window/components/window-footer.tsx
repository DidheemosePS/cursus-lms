import Send from "@/assets/icons/send.svg";
import { handleChatInput } from "@/actions/chat.actions";

export function WindowFooter({ chatId }: { chatId: string }) {
  return (
    <footer className="p-4 bg-white border-t border-[#f0f2f4]">
      <form
        action={handleChatInput.bind(null, chatId)}
        className="flex gap-2 max-w-240 mx-auto"
        autoComplete="off"
      >
        <input
          name="chat-input"
          placeholder="Type a message…"
          className="flex-1 max-h-32 rounded-3xl bg-[#f0f2f4] px-4 py-2 text-[#111318] placeholder:text-[#616f89] transition-all outline-0 focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors flex items-center justify-center shrink-0"
        >
          <Send className="size-5" />
        </button>
      </form>
    </footer>
  );
}
