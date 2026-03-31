import { authApi } from '../index';

const AUTH_BASE = 'http://4.193.104.245:3031';

// ─── Mock global.fetch — bypasses MSW which only handles localhost:3000 ──────
// We replace global.fetch directly so MSW interceptors don't see these requests

let originalFetch: typeof global.fetch;
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

beforeAll(() => {
  originalFetch = global.fetch;
  global.fetch = mockFetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

beforeEach(() => {
  mockFetch.mockReset();
});

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

// ─── authApi.signIn ───────────────────────────────────────────────────────────

describe('authApi.signIn', () => {
  it('returns token and user_id on success', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ token: 'jwt-abc', user_id: 'user-001' }));
    const result = await authApi.signIn({ username: 'merchant', password: 'pass123' });
    expect(result.token).toBe('jwt-abc');
    expect(result.user_id).toBe('user-001');
  });

  it('sends username and password in request body', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ token: 't', user_id: 'u' }));
    await authApi.signIn({ username: 'user1', password: 'mypass' });
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/auth/signin');
    const body = JSON.parse(options.body as string);
    expect(body.username).toBe('user1');
    expect(body.password).toBe('mypass');
  });

  it('uses POST method', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ token: 't', user_id: 'u' }));
    await authApi.signIn({ username: 'u', password: 'p' });
    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(options.method).toBe('POST');
  });

  it('throws INVALID_CREDENTIALS on 401', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(null, 401));
    await expect(authApi.signIn({ username: 'x', password: 'y' }))
      .rejects.toThrow('INVALID_CREDENTIALS');
  });

  it('throws INVALID_CREDENTIALS on 403', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(null, 403));
    await expect(authApi.signIn({ username: 'x', password: 'y' }))
      .rejects.toThrow('INVALID_CREDENTIALS');
  });

  it('throws GENERIC_ERROR on 500', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(null, 500));
    await expect(authApi.signIn({ username: 'x', password: 'y' }))
      .rejects.toThrow('GENERIC_ERROR');
  });

  it('throws GENERIC_ERROR on 404', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(null, 404));
    await expect(authApi.signIn({ username: 'x', password: 'y' }))
      .rejects.toThrow('GENERIC_ERROR');
  });

  it('throws NETWORK_ERROR when fetch rejects', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Network request failed'));
    await expect(authApi.signIn({ username: 'x', password: 'y' }))
      .rejects.toThrow('NETWORK_ERROR');
  });
});

// ─── authApi.signUp ───────────────────────────────────────────────────────────

describe('authApi.signUp', () => {
  it('returns signup response on 200', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ id: 'u-100', message: 'created' }));
    const result = await authApi.signUp({ username: 'alice', phone: '082111222333', password: 'pass123' });
    expect(result).toMatchObject({ id: 'u-100', message: 'created' });
  });

  it('sends username, phone, and password in request body', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ id: 'u' }));
    await authApi.signUp({ username: 'Bob', phone: '087654321', password: 'secure' });
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/auth/signup');
    const body = JSON.parse(options.body as string);
    expect(body.username).toBe('Bob');
    expect(body.phone).toBe('087654321');
    expect(body.password).toBe('secure');
  });

  it('throws EMAIL_TAKEN on 409 with email in message', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ message: 'Email already exists' }, 409));
    await expect(authApi.signUp({ username: 'x', phone: '0', password: 'p' }))
      .rejects.toThrow('EMAIL_TAKEN');
  });

  it('throws PHONE_TAKEN on 409 with phone in message', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ message: 'Phone number taken' }, 409));
    await expect(authApi.signUp({ username: 'x', phone: '0', password: 'p' }))
      .rejects.toThrow('PHONE_TAKEN');
  });

  it('throws EMAIL_TAKEN (default) on 409 with unrecognized message', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ message: 'duplicate entry' }, 409));
    await expect(authApi.signUp({ username: 'x', phone: '0', password: 'p' }))
      .rejects.toThrow('EMAIL_TAKEN');
  });

  it('throws EMAIL_TAKEN (default) on 422', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}, 422));
    await expect(authApi.signUp({ username: 'x', phone: '0', password: 'p' }))
      .rejects.toThrow('EMAIL_TAKEN');
  });

  it('throws EMAIL_TAKEN when json parse fails for 409', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: () => Promise.reject(new SyntaxError('bad json')),
    } as unknown as Response);
    await expect(authApi.signUp({ username: 'x', phone: '0', password: 'p' }))
      .rejects.toThrow('EMAIL_TAKEN');
  });

  it('throws GENERIC_ERROR on 500', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(null, 500));
    await expect(authApi.signUp({ username: 'x', phone: '0', password: 'p' }))
      .rejects.toThrow('GENERIC_ERROR');
  });

  it('throws NETWORK_ERROR when fetch rejects', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Network request failed'));
    await expect(authApi.signUp({ username: 'x', phone: '0', password: 'p' }))
      .rejects.toThrow('NETWORK_ERROR');
  });
});

