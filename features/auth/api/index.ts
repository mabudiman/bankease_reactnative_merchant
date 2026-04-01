import type { SignUpRequest, SignUpResponse, SignInRequest, SignInResponse } from '../types';

const AUTH_API_BASE = 'http://4.193.104.245:3000';

async function signIn(payload: SignInRequest): Promise<SignInResponse> {
  let response: Response;
  try {
    response = await fetch(`${AUTH_API_BASE}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
      }),
    });
  } catch {
    throw new Error('NETWORK_ERROR');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('INVALID_CREDENTIALS');
    }
    throw new Error('GENERIC_ERROR');
  }

  return response.json() as Promise<SignInResponse>;
}

async function signUp(payload: SignUpRequest): Promise<SignUpResponse> {
  let response: Response;
  try {
    response = await fetch(`${AUTH_API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: payload.username,
        phone: payload.phone,
        password: payload.password,
      }),
    });
  } catch {
    throw new Error('NETWORK_ERROR');
  }

  if (!response.ok) {
    const status = response.status;
    if (status === 409 || status === 422) {
      let body: { message?: string } = {};
      try { body = await response.json(); } catch { /* ignore */ }
      const msg = body.message?.toLowerCase() ?? '';
      if (msg.includes('email')) throw new Error('EMAIL_TAKEN');
      if (msg.includes('phone')) throw new Error('PHONE_TAKEN');
      throw new Error('EMAIL_TAKEN'); // default to email for 409
    }
    throw new Error('GENERIC_ERROR');
  }

  return response.json() as Promise<SignUpResponse>;
}

export const authApi = { signIn, signUp };
