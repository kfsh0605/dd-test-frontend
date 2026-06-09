export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface IdentityApi {
  login(req: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Test credentials: any email + password "wrongpass" triggers auth error
export const identityApi: IdentityApi = {
  async login({ email, password }) {
    await delay(800);

    if (password === 'wrongpass') {
      throw new Error('Invalid email or password');
    }

    return {
      token: 'mock-jwt-token-xyz',
      user: {
        id: 'user-1',
        email,
        name: 'Alex Player',
      },
    };
  },

  async logout() {
    await delay(300);
  },
};
