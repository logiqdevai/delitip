export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface LoginEmailPayload {
  email: string;
  password: string;
}

export interface RegisterEmailPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface WaitlistPayload {
  email: string;
}
