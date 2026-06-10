import { mockBalance, mockTransactions } from '@/mocks/billingMocks';

export interface BillingBalance {
  amount: number;
  currency: string;
  lastUpdated: string;
}

export interface BillingTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bonus';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface DepositRequest {
  amount: number;
  currency: string;
}

export interface BillingApi {
  getBalance(): Promise<BillingBalance>;
  getTransactions(): Promise<BillingTransaction[]>;
  deposit(req: DepositRequest): Promise<void>;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const billingApi: BillingApi = {
  async getBalance() {
    await delay(600);
    return mockBalance;
  },

  async getTransactions() {
    await delay(800);
    return mockTransactions;
  },

  async deposit({ amount }) {
    await delay(1000);
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    if (amount > 10000) throw new Error('Maximum deposit amount is $10,000');
  },
};
