"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/app/login/components/login-form";

export default function LoginModal() {
  const router = useRouter();

  return (
    <div
      className="w-full h-dvh fixed top-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm"
      onClick={() => router.back()}
    >
      <main
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-2xl flex flex-col items-center justify-center p-8 mx-4"
      >
        <div className="w-full space-y-4">
          <div className="text-center">
            <Image
              src="https://i.postimg.cc/j5dW4vFd/Mvpblocks.webp"
              alt="Logo"
              width={80}
              height={100}
              className="mx-auto"
            />
            <h3 className="text-2xl font-bold mt-5">Log in to your account</h3>
          </div>

          {/* Reuses the exact same LoginForm as the actual login page */}
          <LoginForm />

          <div className="text-center">
            <Link href="#" className="text-sm hover:text-rose-600">
              Forgot password?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
