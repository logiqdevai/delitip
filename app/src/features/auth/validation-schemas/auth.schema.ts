import { z } from "zod";
import { StoreIndustries } from "@/features/stores/interfaces/stores.interfaces";
import { TeamSizes } from "@/config/constants/dropdowns/businesses/team-size-form.options";

const storeIndustryValues = Object.values(StoreIndustries) as [
  (typeof StoreIndustries)[keyof typeof StoreIndustries],
  ...(typeof StoreIndustries)[keyof typeof StoreIndustries][],
];

const teamSizeValues = Object.values(TeamSizes) as [
  (typeof TeamSizes)[keyof typeof TeamSizes],
  ...(typeof TeamSizes)[keyof typeof TeamSizes][],
];

export const businessSignUpSchema = z.object({
  venueName: z.string().trim().min(1, "Business name is required"),
  businessType: z.enum(storeIndustryValues),
  teamSize: z.enum(teamSizeValues),
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
