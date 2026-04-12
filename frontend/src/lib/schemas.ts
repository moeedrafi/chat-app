import { z } from "zod";

/* REGISTER */
export const registerSchema = z.object({
  username: z.string().min(3, "username is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password should be 6 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/* LOGIN */
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password should be 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/* FORGOT PASSWORD */
export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/* RESET PASSWORD */
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password should be 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
