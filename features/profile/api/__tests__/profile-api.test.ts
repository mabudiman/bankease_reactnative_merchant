import { profileApi } from '../profile-api';
import { MOCK_PROFILE_API_RESPONSE } from '@/mocks/data';

// token-manager imports AsyncStorage — mock it to prevent native module errors
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

// MSW handlers for GET /api/profile/:id and PUT /api/profile/:id
// are registered globally via jest.setup.js → mocks/server.node.ts → mocks/handlers.ts

describe('profileApi.getProfile', () => {
  it('returns a mapped UserProfile with correct fields', async () => {
    const result = await profileApi.getProfile('da08ecfe-de3b-42b1-b1ce-018e144198f5');
    expect(result).toMatchObject({
      accountId: expect.any(String),
      bankName: expect.any(String),
      branchName: expect.any(String),
      transactionName: expect.any(String),
      cardNumber: expect.any(String),
      cardProvider: expect.any(String),
      balance: expect.any(Number),
      currency: expect.any(String),
    });
  });

  it('converts balance from major to minor units (* 100)', async () => {
    const result = await profileApi.getProfile('da08ecfe-de3b-42b1-b1ce-018e144198f5');
    expect(result.balance).toBe(MOCK_PROFILE_API_RESPONSE.balance * 100);
  });

  it('returns bankName matching mock', async () => {
    const result = await profileApi.getProfile('da08ecfe-de3b-42b1-b1ce-018e144198f5');
    expect(result.bankName).toBe(MOCK_PROFILE_API_RESPONSE.bank);
  });

  it('returns branchName matching mock', async () => {
    const result = await profileApi.getProfile('da08ecfe-de3b-42b1-b1ce-018e144198f5');
    expect(result.branchName).toBe(MOCK_PROFILE_API_RESPONSE.branch);
  });

  it('returns transactionName matching mock', async () => {
    const result = await profileApi.getProfile('da08ecfe-de3b-42b1-b1ce-018e144198f5');
    expect(result.transactionName).toBe(MOCK_PROFILE_API_RESPONSE.name);
  });

  it('returns cardProvider matching mock', async () => {
    const result = await profileApi.getProfile('da08ecfe-de3b-42b1-b1ce-018e144198f5');
    expect(result.cardProvider).toBe(MOCK_PROFILE_API_RESPONSE.card_provider);
  });
});

describe('profileApi.updateProfile', () => {
  const UPDATE_INPUT = {
    bankName: 'Mandiri',
    branchName: 'Surabaya',
    transactionName: 'Updated Name',
    cardNumber: '9999888877776666',
    cardProvider: 'MASTERCARD',
    currency: 'IDR',
  };

  it('returns a UserProfile after update', async () => {
    const result = await profileApi.updateProfile('da08ecfe-de3b-42b1-b1ce-018e144198f5', UPDATE_INPUT);
    expect(result).toMatchObject({
      accountId: expect.any(String),
      bankName: expect.any(String),
      balance: expect.any(Number),
    });
  });

  it('returns response with balance converted to minor units', async () => {
    const result = await profileApi.updateProfile('da08ecfe-de3b-42b1-b1ce-018e144198f5', UPDATE_INPUT);
    expect(typeof result.balance).toBe('number');
    expect(result.balance).toBeGreaterThanOrEqual(0);
  });

  it('includes all required UserProfile fields in response', async () => {
    const result = await profileApi.updateProfile('da08ecfe-de3b-42b1-b1ce-018e144198f5', UPDATE_INPUT);
    const requiredFields = ['accountId', 'bankName', 'branchName', 'transactionName', 'cardNumber', 'cardProvider', 'balance', 'currency'];
    for (const field of requiredFields) {
      expect(result).toHaveProperty(field);
    }
  });
});
