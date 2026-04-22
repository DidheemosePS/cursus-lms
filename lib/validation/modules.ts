import { z } from "zod";

const moduleFormSchema = z
  .object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(20, "Title must be at most 20 characters"),
    description: z
      .string()
      .min(2, "Description must be at least 2 characters")
      .max(50, "Description must be at most 32 characters"),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date is required"),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date is required"),
  })
  .refine((d) => new Date(d.startDate) <= new Date(d.dueDate), {
    path: ["dueDate"],
    message: "Due date must be after start date",
  });

export const modulesFormSchema = z.array(moduleFormSchema);

const moduleDbSchema = z.object({
  courseId: z.uuid(),
  position: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  dueDate: z.coerce.date(),
});

export const modulesDbSchema = z.array(moduleDbSchema);
