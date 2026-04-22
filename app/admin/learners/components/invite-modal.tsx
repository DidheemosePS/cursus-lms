"use client";

import { useState, useTransition, useRef } from "react";
import Plus from "@/assets/icons/plus.svg";
import Close from "@/assets/icons/close.svg";
import { inviteLearner } from "@/actions/admin-learner.actions";

export default function InviteLearnerModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const name = nameRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";

    if (!name) return setError("Name is required");
    if (!email) return setError("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Enter a valid email address");

    setError(null);
    startTransition(async () => {
      const result = await inviteLearner(name, email);
      if (!result.success) {
        setError(result.message ?? "Something went wrong");
        return;
      }
      setSuccess(result.message ?? "Invite sent");
      if (nameRef.current) nameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
    });
  }

  function handleClose() {
    setOpen(false);
    setError(null);
    setSuccess(null);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 px-5 h-10 rounded-lg bg-[#135BEC] text-white font-bold text-sm shadow-sm hover:bg-[#135BEC]/90 transition-colors shrink-0"
      >
        <Plus className="size-4" />
        <span>Add Learner</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={handleClose}
        />
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f2f4]">
              <div>
                <p className="text-base font-bold text-[#111318]">
                  Invite Learner
                </p>
                <p className="text-xs text-[#617789] mt-0.5">
                  They will receive an invite to set up their account.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full text-[#617789] hover:bg-gray-100 transition-colors"
              >
                <Close className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-6">
              {success ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="size-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <p className="text-sm font-bold text-[#111318]">{success}</p>
                  <p className="text-xs text-[#617789]">
                    The learner will appear as Pending Invite.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-2 px-6 py-2 rounded-lg bg-[#111318] text-white text-sm font-semibold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#111318]">
                      Full Name
                    </label>
                    <input
                      ref={nameRef}
                      type="text"
                      placeholder="e.g. John Smith"
                      className="w-full px-4 py-2.5 rounded-lg text-sm text-[#111318] outline-0 ring ring-[#dbe1e6] focus:ring-[#135BEC] placeholder:text-[#617789] transition-shadow"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#111318]">
                      Email Address
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-2.5 rounded-lg text-sm text-[#111318] outline-0 ring ring-[#dbe1e6] focus:ring-[#135BEC] placeholder:text-[#617789] transition-shadow"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 font-medium">{error}</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleClose}
                      className="flex-1 py-2.5 rounded-lg border border-[#dbe1e6] text-sm font-semibold text-[#111318] hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="flex-1 py-2.5 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-sm font-semibold transition-colors disabled:opacity-60"
                    >
                      {isPending ? "Sending…" : "Send Invite"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
