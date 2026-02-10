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
        className="rounded-lg bg-white p-5 relative flex justify-center items-center text-[48px] font-medium overflow-y-scroll"
      >
        {children}
        <button
          onClick={onDismiss}
          className="absolute top-2.5 right-2.5 w-12 h-12 bg-transparent rounded-lg cursor-pointer flex justify-center items-center font-medium text-[24px] hover:bg-[#eee] after:content-['X']"
        />
      </dialog>
    </div>
  );
}
