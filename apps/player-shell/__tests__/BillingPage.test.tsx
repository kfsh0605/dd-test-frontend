import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { BillingBalance, BillingTransaction } from '@/adapters/billingApi';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}));

vi.mock('@/context/TenantContext', () => ({
  useTenant: () => ({ brandId: 'alpha', locale: 'en', currency: 'USD' }),
  TenantProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

// Mock as vi.fn() so we can use mockReturnValue in each test
vi.mock('@/hooks/useBilling', () => ({
  useBilling: vi.fn(),
}));

vi.mock('theme-tenant-alpha', () => ({
  BrandButton: ({ children, isLoading, ...props }: { children: React.ReactNode; isLoading?: boolean; [key: string]: unknown }) =>
    React.createElement('button', { 'data-loading': isLoading, ...props }, children),
  BrandCard: ({ children, header }: { children: React.ReactNode; header?: string }) =>
    React.createElement('div', null, header && React.createElement('h2', null, header), children),
}));

import BillingPage from '@/app/account/billing/page';
import { useBilling } from '@/hooks/useBilling';

const MOCK_BALANCE: BillingBalance = {
  amount: 1250,
  currency: 'USD',
  lastUpdated: new Date().toISOString(),
};

const MOCK_TRANSACTIONS: BillingTransaction[] = [
  { id: 'tx-1', type: 'deposit', amount: 500, currency: 'USD', status: 'completed', createdAt: '2025-01-10T10:00:00Z' },
  { id: 'tx-2', type: 'withdrawal', amount: 200, currency: 'USD', status: 'pending', createdAt: '2025-01-12T09:30:00Z' },
];

const DEFAULT_MUTATION = {
  isPending: false,
  isSuccess: false,
  isError: false,
  error: null,
  mutate: vi.fn(),
};

function setupBilling(overrides: Partial<ReturnType<typeof useBilling>> = {}) {
  vi.mocked(useBilling).mockReturnValue({
    balanceQuery: { isLoading: false, isError: false, data: MOCK_BALANCE, refetch: vi.fn() } as never,
    transactionsQuery: { isLoading: false, isError: false, data: MOCK_TRANSACTIONS, refetch: vi.fn() } as never,
    depositMutation: DEFAULT_MUTATION as never,
    ...overrides,
  });
}

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(React.createElement(QueryClientProvider, { client: queryClient }, ui));
}

describe('BillingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeletons when balance is loading', () => {
    vi.mocked(useBilling).mockReturnValue({
      balanceQuery: { isLoading: true, isError: false, data: undefined, refetch: vi.fn() } as never,
      transactionsQuery: { isLoading: true, isError: false, data: undefined, refetch: vi.fn() } as never,
      depositMutation: DEFAULT_MUTATION as never,
    });

    renderWithQuery(React.createElement(BillingPage));

    expect(screen.getByText('Your Balance')).toBeInTheDocument();
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
  });

  it('displays balance after successful load', async () => {
    setupBilling();
    renderWithQuery(React.createElement(BillingPage));

    await waitFor(() => {
      expect(screen.getByText(/1.?250/)).toBeInTheDocument();
    });

    expect(screen.getByText(/USD - updated/)).toBeInTheDocument();
  });

  it('displays transactions after successful load', async () => {
    setupBilling();
    renderWithQuery(React.createElement(BillingPage));

    await waitFor(() => {
      expect(screen.getByText('+$500')).toBeInTheDocument();
    });

    expect(screen.getByText('-$200')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('shows empty state when no transactions', async () => {
    setupBilling({
      transactionsQuery: { isLoading: false, isError: false, data: [], refetch: vi.fn() } as never,
    });

    renderWithQuery(React.createElement(BillingPage));

    await waitFor(() => {
      expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    });
  });

  it('shows error state when balance fetch fails', async () => {
    setupBilling({
      balanceQuery: { isLoading: false, isError: true, data: undefined, refetch: vi.fn() } as never,
    });

    renderWithQuery(React.createElement(BillingPage));

    await waitFor(() => {
      expect(screen.getByText('Failed to load balance')).toBeInTheDocument();
    });

    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('shows error state when transactions fetch fails', async () => {
    setupBilling({
      transactionsQuery: { isLoading: false, isError: true, data: undefined, refetch: vi.fn() } as never,
    });

    renderWithQuery(React.createElement(BillingPage));

    await waitFor(() => {
      expect(screen.getByText('Failed to load transactions')).toBeInTheDocument();
    });
  });

  it('shows validation error when submitting empty deposit form', async () => {
    setupBilling();
    const user = userEvent.setup();
    renderWithQuery(React.createElement(BillingPage));

    const depositButton = screen.getByRole('button', { name: /deposit/i });
    await user.click(depositButton);

    // z.number() treats empty field as NaN
    await waitFor(() => {
      expect(screen.getByText('Must be a number')).toBeInTheDocument();
    });
  });

  it('shows validation error for amount exceeding maximum', async () => {
    setupBilling();
    const user = userEvent.setup();
    renderWithQuery(React.createElement(BillingPage));

    const input = screen.getByPlaceholderText('0.00');
    await user.type(input, '99999');

    const depositButton = screen.getByRole('button', { name: /deposit/i });
    await user.click(depositButton);

    await waitFor(() => {
      expect(screen.getByText('Maximum deposit is $10,000')).toBeInTheDocument();
    });
  });

  it('shows success message after successful deposit', async () => {
    setupBilling({
      depositMutation: { isPending: false, isSuccess: true, isError: false, error: null, mutate: vi.fn() } as never,
    });

    renderWithQuery(React.createElement(BillingPage));

    await waitFor(() => {
      expect(screen.getByText('Deposit successful!')).toBeInTheDocument();
    });
  });
});
