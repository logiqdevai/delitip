import { z } from "zod";

export const businessSignUpSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type BusinessSignUpFormData = z.infer<typeof businessSignUpSchema>;

export const businessSignInSchema = z.object({
  email: z.string().trim().email("Enter a valid work email"),
  password: z.string().min(1, "Password is required"),
});

export type BusinessSignInFormData = z.infer<typeof businessSignInSchema>;

export const employeeSignInSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type EmployeeSignInFormData = z.infer<typeof employeeSignInSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password !== data.current_password, {
    message: "New password must be different from your current password",
    path: ["password"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
