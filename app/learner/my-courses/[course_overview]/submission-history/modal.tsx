"use client";

import { useEffect, useRef } from "react";

export interface DialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}

export default function Dialog({ children, isOpen, closeModal }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current) return;

    if (isOpen) dialogRef.current.showModal();
    else dialogRef.current.close();
  }, [isOpen]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={closeModal}
      onClick={handleOutsideClick}
      className="m-auto w-full p-0 border-0 bg-transparent backdrop:bg-black/40"
    >
      {children}
    </dialog>
  );
}
