import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password mush be 8 to 22 characters")
    .max(22, "Password should not be more than 22 characters"),
});
