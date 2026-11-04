import { z } from "zod";
import { vmsg } from "@/lib/validation-message";

export const businessSignUpSchema = z.object({
  fullName: z.string().trim().min(1, vmsg("fullNameRequired")),
  email: z.string().trim().email(vmsg("workEmailInvalid")),
  password: z.string().min(8, vmsg("passwordMinLength", { min: 8 })),
});

export type BusinessSignUpFormData = z.infer<typeof businessSignUpSchema>;

export const businessSignInSchema = z.object({
  email: z.string().trim().email(vmsg("workEmailInvalid")),
  password: z.string().min(1, vmsg("passwordRequired")),
});

export type BusinessSignInFormData = z.infer<typeof businessSignInSchema>;

export const employeeSignInSchema = z.object({
  email: z.string().trim().email(vmsg("emailInvalid")),
  password: z.string().min(1, vmsg("passwordRequired")),
});

export type EmployeeSignInFormData = z.infer<typeof employeeSignInSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(vmsg("emailInvalid")),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, vmsg("passwordMinLength", { min: 8 })),
    confirmPassword: z.string().min(1, vmsg("confirmPassword")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: vmsg("passwordsMismatch"),
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, vmsg("currentPasswordRequired")),
    password: z.string().min(8, vmsg("passwordMinLength", { min: 8 })),
    confirmPassword: z.string().min(1, vmsg("confirmNewPassword")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: vmsg("passwordsMismatch"),
    path: ["confirmPassword"],
  })
  .refine((data) => data.password !== data.current_password, {
    message: vmsg("newPasswordDifferent"),
    path: ["password"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
