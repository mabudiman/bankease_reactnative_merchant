# API Contract: Forgot Password Flow

**Base URL:** `http://4.193.104.245:8080`
**Content-Type:** `application/json` (all requests and responses)
**Auth:** None required — these are unauthenticated endpoints

---

## Flow Overview

```
Sign In Screen
     │
     │  user taps "Forgot your password?"
     │  phone number passed via router params
     ▼
[1] POST /api/auth/forgot-password  ──► OTP SMS sent to phone
     │
     │  user types 4–6 digit code on ForgotPasswordScreen
     ▼
[2] POST /api/auth/verify-otp  ──► returns short-lived reset token
     │
     │  user types new password on ChangePasswordScreen
     ▼
[3] POST /api/auth/reset-password  ──► password updated
     │
     ▼
Change Password Success Screen  ──► router.replace('/')  ──► Sign In
```

**Resend OTP:** same as step 1 — call `POST /api/auth/forgot-password` again with the same phone number. Backend handles cooldown via 429.

---

## Endpoint 1 — Request OTP

### `POST /api/auth/forgot-password`

Triggers an OTP SMS to the user's registered phone number, starting the password reset flow.

#### Request Body

| Field         | Type     | Required | Notes                                                   |
| ------------- | -------- | -------- | ------------------------------------------------------- |
| `phoneNumber` | `string` | ✅       | Raw local format, e.g. `081234567890`. No `+62` prefix. |

```json
{
  "phoneNumber": "081234567890"
}
```

#### Success Response — `200 OK`

```json
{
  "message": "OTP sent"
}
```

#### Error Responses

| HTTP Status             | Error Code             | Description                                                       |
| ----------------------- | ---------------------- | ----------------------------------------------------------------- |
| `404 Not Found`         | `PHONE_NOT_REGISTERED` | No account is associated with this phone number.                  |
| `429 Too Many Requests` | `RATE_LIMITED`         | OTP was requested too recently. Caller must wait before retrying. |

```json
// 404
{
  "error": "PHONE_NOT_REGISTERED"
}

// 429
{
  "error": "RATE_LIMITED",
  "retryAfter": 60
}
```

> `retryAfter` is in seconds — the minimum wait before calling this endpoint again for the same phone.

---

## Endpoint 2 — Verify OTP

### `POST /api/auth/verify-otp`

Validates the OTP code entered by the user. On success, returns a short-lived, single-use reset token used in the next step.

#### Request Body

| Field         | Type     | Required | Notes                                   |
| ------------- | -------- | -------- | --------------------------------------- |
| `phoneNumber` | `string` | ✅       | Same phone number used in step 1.       |
| `code`        | `string` | ✅       | 4–6 digit OTP code entered by the user. |

```json
{
  "phoneNumber": "081234567890",
  "code": "123456"
}
```

#### Success Response — `200 OK`

```json
{
  "token": "eyJhbG...<reset-token>",
  "expiresAt": "2026-03-30T10:15:00Z"
}
```

| Field       | Type                | Notes                                                               |
| ----------- | ------------------- | ------------------------------------------------------------------- |
| `token`     | `string`            | Opaque reset token. Frontend stores in memory and passes to step 3. |
| `expiresAt` | `string` (ISO 8601) | Token expiry timestamp. Recommended: 15 minutes from issue.         |

#### Error Responses

| HTTP Status             | Error Code              | Description                                                               |
| ----------------------- | ----------------------- | ------------------------------------------------------------------------- |
| `400 Bad Request`       | `INVALID_OTP`           | The provided code does not match.                                         |
| `400 Bad Request`       | `EXPIRED_OTP`           | The OTP code has passed its validity window. User must request a new one. |
| `429 Too Many Requests` | `MAX_ATTEMPTS_EXCEEDED` | Too many wrong code attempts for this phone.                              |

```json
// 400 — wrong code
{
  "error": "INVALID_OTP"
}

// 400 — code expired
{
  "error": "EXPIRED_OTP"
}

// 429 — brute-force protection
{
  "error": "MAX_ATTEMPTS_EXCEEDED"
}
```

---

## Endpoint 3 — Reset Password

### `POST /api/auth/reset-password`

Sets a new password for the account. Requires the reset token from step 2. The token is single-use and invalidated after this call.

#### Request Body

| Field             | Type     | Required | Notes                                           |
| ----------------- | -------- | -------- | ----------------------------------------------- |
| `token`           | `string` | ✅       | Reset token returned by `/api/auth/verify-otp`. |
| `newPassword`     | `string` | ✅       | The desired new password. Min 6 characters.     |
| `confirmPassword` | `string` | ✅       | Must be identical to `newPassword`.             |

```json
{
  "token": "eyJhbG...<reset-token>",
  "newPassword": "myNewPass123",
  "confirmPassword": "myNewPass123"
}
```

#### Success Response — `200 OK`

```json
{
  "message": "Password changed"
}
```

#### Error Responses

| HTTP Status        | Error Code               | Description                                                            |
| ------------------ | ------------------------ | ---------------------------------------------------------------------- |
| `400 Bad Request`  | `PASSWORDS_DO_NOT_MATCH` | `newPassword` and `confirmPassword` values are not identical.          |
| `400 Bad Request`  | `PASSWORD_TOO_WEAK`      | Password does not meet minimum requirements (see rules below).         |
| `401 Unauthorized` | `INVALID_TOKEN`          | Token is malformed, not recognised, or has already been used.          |
| `401 Unauthorized` | `EXPIRED_TOKEN`          | Token was issued more than 15 minutes ago. User must restart the flow. |

```json
// 400 — mismatch
{
  "error": "PASSWORDS_DO_NOT_MATCH"
}

// 400 — too short / weak
{
  "error": "PASSWORD_TOO_WEAK",
  "detail": "Password must be at least 6 characters."
}

// 401 — bad / used token
{
  "error": "INVALID_TOKEN"
}

// 401 — timed out
{
  "error": "EXPIRED_TOKEN"
}
```

---

## Shared Notes

### Phone Number Format

Phones are stored in raw local Indonesian format — no country code prefix.

| Format           | Accepted? |
| ---------------- | --------- |
| `081234567890`   | ✅        |
| `+6281234567890` | ❌        |
| `6281234567890`  | ❌        |

This matches the storage convention in `features/auth/services/auth-service.ts` and the Sign Up / Sign In screens (`autoCapitalize="none"`, no visual prefix).

### Password Rules

| Rule           | Value                        |
| -------------- | ---------------------------- |
| Minimum length | 6 characters                 |
| Maximum length | 128 characters (recommended) |

Consistent with `isFormValid` check in `ChangePasswordScreen` (`newPassword.trim().length >= 6`).

### Reset Token

| Property  | Value                                                                                     |
| --------- | ----------------------------------------------------------------------------------------- |
| Lifetime  | 15 minutes from issue                                                                     |
| Use limit | Single-use — invalidated immediately after a successful password reset                    |
| Transport | Returned in response body; stored in frontend memory only (not persisted to AsyncStorage) |

### Rate Limiting

| Endpoint                         | Recommended limit                                         |
| -------------------------------- | --------------------------------------------------------- |
| `POST /api/auth/forgot-password` | 3 requests per phone per 5 minutes                        |
| `POST /api/auth/verify-otp`      | 5 attempts per OTP session before `MAX_ATTEMPTS_EXCEEDED` |

---

## TypeScript Types (Frontend Reference)

Defined in `features/auth/types.ts`:

```typescript
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
```

---

## Out of Scope (Frontend Tasks — Separate Work)

- `features/auth/api/` — API call functions using `core/api/client.ts`
- `mocks/handlers.ts` — MSW mock handlers for these endpoints
- Wiring `ForgotPasswordScreen` and `ChangePasswordScreen` to real API calls (replace current `setTimeout` stubs)
- Passing phone number via router params from Sign In → Forgot Password screen
