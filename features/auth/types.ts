// Add account-specific types here as the feature is developed.

export type AccountStatus = "active" | "inactive" | "frozen";

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
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
