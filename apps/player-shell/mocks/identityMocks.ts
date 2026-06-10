import type { LoginResponse } from '@/adapters/identityApi';

export const mockLoginResponse: LoginResponse = {
  token: 'mock-jwt-token-xyz',
  user: {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Alex Player',
  },
};
