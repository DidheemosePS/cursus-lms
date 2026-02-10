import crypto from "crypto";
import { cookies } from "next/headers";
import { promisify } from "util";
import { getIronSession } from "iron-session";
import prisma from "@/lib/prisma";

export async function signin(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const isValid = await verifyPassword(
      password,
      user.passwordHash,
      user.salt
    );

    if (!isValid) return { success: false, error: "Invalid email or password" };

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  } catch (error) {
    console.log("Sign in error:", error);
    return { success: false, error: "Failed to sign in" };
  }
}

const scryptAsync = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
) {
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), derivedKey);
}

// Hash Password Function
export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return { salt, hash: derivedKey.toString("hex") };
}

export type SessionData = {
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  organizationId: string;
  isLoggedIn: boolean;
};

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "auth-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  },
};

export const getSession = async () => {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }
  return session;
};

export async function SignOut() {
  const session = await getSession();
  session.destroy();
}
