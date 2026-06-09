'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { billingApi } from '@/adapters/billingApi';
import { BrandButton, BrandCard } from 'theme-tenant-alpha';
import { useTenant } from '@/context/TenantContext';
import Link from 'next/link';

const depositSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)), 'Must be a number')
    .refine((val) => Number(val) > 0, 'Amount must be greater than 0')
    .refine((val) => Number(val) <= 10000, 'Maximum deposit is $10,000'),
});

type DepositFormData = z.infer<typeof depositSchema>;

// -- Loading skeleton --
function BalanceSkeleton() {
  return (
    <div style={{ animation: 'brand-spin 1.5s ease-in-out infinite' }}>
      <div style={{ height: '2rem', width: '12rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-2)' }} />
      <div style={{ height: '1rem', width: '8rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)' }} />
    </div>
  );
}

// -- Error state --
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" style={{ textAlign: 'center', padding: 'var(--spacing-10)' }}>
      <p style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
        {message}
      </p>
      <BrandButton variant="ghost" onClick={onRetry}>Try again</BrandButton>
    </div>
  );
}

// -- Empty state --
function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--spacing-10)' }}>
      <p style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-4)' }}>💳</p>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-2)' }}>
        No transactions yet
      </p>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
        Make your first deposit to get started
      </p>
    </div>
  );
}

export default function BillingPage() {
  const { currency } = useTenant();
  const queryClient = useQueryClient();

  // React Query manages loading/error/data states automatically
  const balanceQuery = useQuery({
    queryKey: ['billing', 'balance'],
    queryFn: () => billingApi.getBalance(),
  });

  const transactionsQuery = useQuery({
    queryKey: ['billing', 'transactions'],
    queryFn: () => billingApi.getTransactions(),
  });

  // useMutation for deposit - invalidates balance cache on success
  const depositMutation = useMutation({
    mutationFn: (amount: number) => billingApi.deposit({ amount, currency }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      reset();
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
  });

  const onDeposit = (data: DepositFormData) => {
    depositMutation.mutate(Number(data.amount));
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-base)', padding: 'var(--spacing-8)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
          <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>
            &larr; Home
          </Link>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
            Billing
          </h1>
        </div>

        {/* Balance card */}
        <BrandCard variant="elevated" header="Your Balance" style={{ marginBottom: 'var(--spacing-6)' }}>
          {balanceQuery.isLoading && <BalanceSkeleton />}
          {balanceQuery.isError && (
            <ErrorState
              message="Failed to load balance"
              onRetry={() => balanceQuery.refetch()}
            />
          )}
          {balanceQuery.data && (
            <div>
              <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                ${balanceQuery.data.amount.toLocaleString()}
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-1)' }}>
                {balanceQuery.data.currency} - updated {new Date(balanceQuery.data.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          )}
        </BrandCard>

        {/* Deposit form */}
        <BrandCard header="Deposit Funds" style={{ marginBottom: 'var(--spacing-6)' }}>
          {depositMutation.isSuccess && (
            <div role="status" style={{ backgroundColor: 'rgba(44,182,125,0.1)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)', marginBottom: 'var(--spacing-4)', color: 'var(--color-success)', fontSize: 'var(--font-size-sm)' }}>
              Deposit successful!
            </div>
          )}
          {depositMutation.isError && (
            <div role="alert" style={{ backgroundColor: 'rgba(255,77,77,0.1)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)', marginBottom: 'var(--spacing-4)', color: 'var(--color-error)', fontSize: 'var(--font-size-sm)' }}>
              {depositMutation.error instanceof Error ? depositMutation.error.message : 'Deposit failed'}
            </div>
          )}
          <form onSubmit={handleSubmit(onDeposit)} noValidate>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="amount" style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                  Amount ({currency})
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  {...register('amount')}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    backgroundColor: 'var(--color-bg-input)',
                    border: `1px solid ${errors.amount ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-md)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.amount && (
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-1)' }}>
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div style={{ paddingTop: 'var(--spacing-8)' }}>
                <BrandButton type="submit" isLoading={depositMutation.isPending}>
                  Deposit
                </BrandButton>
              </div>
            </div>
          </form>
        </BrandCard>

        {/* Transactions */}
        <BrandCard header="Transaction History">
          {transactionsQuery.isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: '3rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          )}
          {transactionsQuery.isError && (
            <ErrorState
              message="Failed to load transactions"
              onRetry={() => transactionsQuery.refetch()}
            />
          )}
          {transactionsQuery.data && transactionsQuery.data.length === 0 && <EmptyState />}
          {transactionsQuery.data && transactionsQuery.data.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {transactionsQuery.data.map((tx) => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3) var(--spacing-4)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', textTransform: 'capitalize' }}>
                      {tx.type}
                    </p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: tx.type === 'withdrawal' ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
                      {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: tx.status === 'pending' ? 'var(--color-warning)' : 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BrandCard>

      </div>
    </main>
  );
}
