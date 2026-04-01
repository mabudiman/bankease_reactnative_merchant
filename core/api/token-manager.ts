import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth:token';

/** In-memory cache — allows synchronous reads inside request() */
let _token: string | null = null;

/**
 * Persist and cache the given token.
 * Pass `null` to clear it (e.g. on sign-out).
 */
async function setToken(token: string | null): Promise<void> {
  _token = token;
  if (token === null) {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
}

/** Synchronous read from the in-memory cache. Use inside request() headers. */
function getToken(): string | null {
  return _token;
}

/** Wipe both the in-memory value and the persisted value. */
async function clearToken(): Promise<void> {
  await setToken(null);
}

/**
 * Call once at app boot (before any authenticated API request).
 * Reads the persisted token from AsyncStorage into memory.
 */
async function loadToken(): Promise<void> {
  const stored = await AsyncStorage.getItem(TOKEN_KEY);
  _token = stored;
}

export const tokenManager = { setToken, getToken, clearToken, loadToken };
