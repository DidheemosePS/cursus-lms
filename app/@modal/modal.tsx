"use client";

import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function onDismiss() {
    router.back();
  }

  return (
    <div
      className="fixed inset-0 z-100 bg-[#000000b3] flex justify-center items-center"
      onClick={onDismiss}
    >
      <dialog
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90dvh] rounded-lg shadow-md"
      >
        {children}
      </dialog>
    </div>
  );
}
