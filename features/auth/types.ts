// Add account-specific types here as the feature is developed.

export type AccountStatus = "active" | "inactive" | "frozen";

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
}

// Local dummy auth types
export interface LocalAuthAccount {
  id: string;
  name: string;
  phone: string;
  password: string;
  createdAt: string;
}

export interface LocalAuthSession {
  accountId: string;
  username?: string;
  createdAt: string;
}

export interface ForgotPasswordRequest {
  phoneNumber: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  code: string;
}

export interface ChangePasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SignUpRequest {
  username: string;
  phone: string;
  password: string;
}

export interface SignUpResponse {
  id?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  message?: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user_id: string;
  id: string;
  username?: string;
  message?: string;
}
