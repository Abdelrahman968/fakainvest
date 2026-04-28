import { z } from "zod";

export const signUpSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(40, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(80, "Email is too long"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Password is too long"),
});

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(80, "Email is too long"),
  password: z.string().min(1, "Enter your password"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;