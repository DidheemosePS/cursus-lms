"use client";

import Eye from "@/assets/icons/eye.svg";
import EyeOff from "@/assets/icons/eyeoff.svg";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { signInSchema } from "@/lib/validation/signin";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    invalid?: string;
  }>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error)?.fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const response = await res.json();

      if (!res.ok || !response.success) {
        setErrors({ invalid: response.error || "Sign in failed" });
        return;
      }

      // Hard navigation — bypasses intercepting route so modal
      // doesn't intercept the role-based redirect after login
      window.location.href = `/${response.user.role}`;
    } catch (error) {
      console.error("Signin error:", error);
      setErrors({ invalid: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-4 py-6 shadow sm:rounded-lg sm:p-6"
    >
      <div>
        <label className="font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 shadow-sm outline-none focus:border-rose-600"
        />
        {errors?.email && (
          <p className="text-xs mt-2 text-red-600">{errors.email}</p>
        )}
      </div>

      <div className="relative">
        <label className="font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 shadow-sm outline-none focus:border-rose-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 mt-2 mr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="text-secondary size-5" />
            ) : (
              <Eye className="text-secondary size-5" />
            )}
          </button>
        </div>
        {errors?.password && (
          <p className="text-xs mt-2 text-red-600">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-rose-600 px-4 py-2 font-medium text-white duration-150 hover:bg-rose-500 active:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in…" : "Sign in"}
      </button>

      {errors?.invalid && (
        <p className="mx-auto text-xs text-red-600">{errors.invalid}</p>
      )}
    </form>
  );
}
