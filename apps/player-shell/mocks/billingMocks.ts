import type { BillingBalance, BillingTransaction } from '@/adapters/billingApi';

export const mockBalance: BillingBalance = {
  amount: 1250.0,
  currency: 'USD',
  lastUpdated: new Date().toISOString(),
};

export const mockTransactions: BillingTransaction[] = [
  { id: 'tx-1', type: 'deposit', amount: 500, currency: 'USD', status: 'completed', createdAt: '2025-01-10T10:00:00Z' },
  { id: 'tx-2', type: 'bonus', amount: 50, currency: 'USD', status: 'completed', createdAt: '2025-01-11T12:00:00Z' },
  { id: 'tx-3', type: 'withdrawal', amount: 200, currency: 'USD', status: 'pending', createdAt: '2025-01-12T09:30:00Z' },
  { id: 'tx-4', type: 'deposit', amount: 900, currency: 'USD', status: 'completed', createdAt: '2025-01-13T15:00:00Z' },
];
