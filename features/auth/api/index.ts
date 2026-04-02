import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  ValidateOtpRequest,
  ValidateOtpResponse,
} from "../types";

const AUTH_API_BASE = "http://4.193.104.245:3000";

async function signIn(payload: SignInRequest): Promise<SignInResponse> {
  if (__DEV__) console.log(`[api] POST ${AUTH_API_BASE}/api/auth/signin`);
  let response: Response;
  try {
    response = await fetch(`${AUTH_API_BASE}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
      }),
    });
  } catch {
    throw new Error("NETWORK_ERROR");
  }

  if (__DEV__) console.log(`[api] response status: ${response.status}`);
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("INVALID_CREDENTIALS");
    }
    throw new Error("GENERIC_ERROR");
  }

  return response.json() as Promise<SignInResponse>;
}

async function signUp(payload: SignUpRequest): Promise<SignUpResponse> {
  if (__DEV__) console.log(`[api] POST ${AUTH_API_BASE}/api/auth/signup`);
  let response: Response;
  try {
    response = await fetch(`${AUTH_API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: payload.username,
        phone: payload.phone,
        password: payload.password,
      }),
    });
  } catch {
    throw new Error("NETWORK_ERROR");
  }

  if (!response.ok) {
    const status = response.status;
    if (status === 409 || status === 422) {
      let body: { message?: string } = {};
      try {
        body = await response.json();
      } catch {
        /* ignore */
      }
      const msg = body.message?.toLowerCase() ?? "";
      if (msg.includes("email")) throw new Error("EMAIL_TAKEN");
      if (msg.includes("phone")) throw new Error("PHONE_TAKEN");
      throw new Error("EMAIL_TAKEN"); // default to email for 409
    }
    throw new Error("GENERIC_ERROR");
  }

  return response.json() as Promise<SignUpResponse>;
}

async function validateOtp(payload: ValidateOtpRequest): Promise<ValidateOtpResponse> {
  if (__DEV__) console.log(`[api] POST ${AUTH_API_BASE}/api/auth/validate-otp`);
  let response: Response;
  try {
    response = await fetch(`${AUTH_API_BASE}/api/auth/validate-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: payload.username }),
    });
  } catch {
    throw new Error("NETWORK_ERROR");
  }

  if (!response.ok) {
    if (response.status === 404) throw new Error("USER_NOT_FOUND");
    throw new Error("GENERIC_ERROR");
  }

  const data = (await response.json()) as ValidateOtpResponse;
  if (__DEV__) console.log("[api] validate-otp response:", JSON.stringify(data));
  return data;
}

export const authApi = { signIn, signUp, validateOtp };
