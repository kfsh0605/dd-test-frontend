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

const MOCK_BALANCE: BillingBalance = {
  amount: 1250.0,
  currency: 'USD',
  lastUpdated: new Date().toISOString(),
};

const MOCK_TRANSACTIONS: BillingTransaction[] = [
  { id: 'tx-1', type: 'deposit', amount: 500, currency: 'USD', status: 'completed', createdAt: '2025-01-10T10:00:00Z' },
  { id: 'tx-2', type: 'bonus', amount: 50, currency: 'USD', status: 'completed', createdAt: '2025-01-11T12:00:00Z' },
  { id: 'tx-3', type: 'withdrawal', amount: 200, currency: 'USD', status: 'pending', createdAt: '2025-01-12T09:30:00Z' },
  { id: 'tx-4', type: 'deposit', amount: 900, currency: 'USD', status: 'completed', createdAt: '2025-01-13T15:00:00Z' },
];

export const billingApi: BillingApi = {
  async getBalance() {
    await delay(600);
    return MOCK_BALANCE;
  },

  async getTransactions() {
    await delay(800);
    return MOCK_TRANSACTIONS;
  },

  async deposit({ amount }) {
    await delay(1000);
    if (amount <= 0) throw new Error('Amount must be greater than 0');
    if (amount > 10000) throw new Error('Maximum deposit amount is $10,000');
  },
};
