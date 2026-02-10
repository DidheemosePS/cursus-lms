import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/login-form";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (session && session.isLoggedIn) {
    redirect(`/${session.role}`);
  }

  return (
    <main className="bg-background flex min-h-screen w-full flex-col items-center justify-center sm:px-4">
      <div className="w-full space-y-4 sm:max-w-md">
        <div className="text-center">
          <Image
            src="https://i.postimg.cc/j5dW4vFd/Mvpblocks.webp"
            alt="MVPBlocks Logo"
            width={80}
            height={100}
            className="mx-auto"
          />
          <h3 className="text-2xl font-bold sm:text-3xl mt-5 space-y-2">
            Log in to your account
          </h3>
        </div>
        {/* Login Form */}
        <LoginForm />
        <div className="text-center">
          <Link href="#" className="hover:text-rose-600">
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}
