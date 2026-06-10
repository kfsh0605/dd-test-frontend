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

function BalanceSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-9 w-40 rounded-lg animate-pulse"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
      />
      <div
        className="h-4 w-56 rounded-lg animate-pulse"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
      />
    </div>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-14 rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        />
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="text-center py-8">
      <p className="text-base mb-4" style={{ color: 'var(--color-error)' }}>{message}</p>
      <BrandButton variant="ghost" size="sm" onClick={onRetry}>Try again</BrandButton>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-10">
      <p className="text-3xl mb-4">💳</p>
      <p className="text-lg mb-2" style={{ color: 'var(--color-text-secondary)' }}>No transactions yet</p>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Make your first deposit to get started</p>
    </div>
  );
}

export default function BillingPage() {
  const { currency } = useTenant();
  const queryClient = useQueryClient();

  const balanceQuery = useQuery({
    queryKey: ['billing', 'balance'],
    queryFn: () => billingApi.getBalance(),
  });

  const transactionsQuery = useQuery({
    queryKey: ['billing', 'transactions'],
    queryFn: () => billingApi.getTransactions(),
  });

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
    <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-sm no-underline" style={{ color: 'var(--color-text-muted)' }}>
            &larr; Home
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Billing
          </h1>
        </div>

        <BrandCard variant="elevated" header="Your Balance" style={{ marginBottom: 'var(--spacing-6)' }}>
          <div className="min-h-16">
            {balanceQuery.isLoading && <BalanceSkeleton />}
            {balanceQuery.isError && <ErrorState message="Failed to load balance" onRetry={() => balanceQuery.refetch()} />}
            {balanceQuery.data && (
              <div>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)', lineHeight: 'var(--line-height-tight)' }}>
                  ${balanceQuery.data.amount.toLocaleString()}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-normal)' }}>
                  {balanceQuery.data.currency} - updated {new Date(balanceQuery.data.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        </BrandCard>

        <BrandCard header="Deposit Funds" style={{ marginBottom: 'var(--spacing-6)' }}>
          {depositMutation.isSuccess && (
            <div
              role="status"
              className="rounded-lg px-4 py-3 mb-4 text-sm border"
              style={{ backgroundColor: 'rgba(44,182,125,0.1)', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
            >
              Deposit successful!
            </div>
          )}
          {depositMutation.isError && (
            <div
              role="alert"
              className="rounded-lg px-4 py-3 mb-4 text-sm border"
              style={{ backgroundColor: 'rgba(255,77,77,0.1)', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
            >
              {depositMutation.error instanceof Error ? depositMutation.error.message : 'Deposit failed'}
            </div>
          )}
          <form onSubmit={handleSubmit(onDeposit)} noValidate>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <label
                  htmlFor="amount"
                  className="block text-sm mb-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Amount ({currency})
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  {...register('amount')}
                  className="w-full px-4 py-3 rounded-lg text-base outline-none box-border"
                  style={{
                    backgroundColor: 'var(--color-bg-input)',
                    border: `1px solid ${errors.amount ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
                    color: 'var(--color-text-primary)',
                  }}
                />
                <p role="alert" className="text-xs mt-1 min-h-4" style={{ color: 'var(--color-error)' }}>
                  {errors.amount?.message ?? ''}
                </p>
              </div>
              <div className="pt-8">
                <BrandButton type="submit" isLoading={depositMutation.isPending}>Deposit</BrandButton>
              </div>
            </div>
          </form>
        </BrandCard>

        <BrandCard header="Transaction History">
          <div className="min-h-48">
            {transactionsQuery.isLoading && <TransactionsSkeleton />}
            {transactionsQuery.isError && <ErrorState message="Failed to load transactions" onRetry={() => transactionsQuery.refetch()} />}
            {transactionsQuery.data && transactionsQuery.data.length === 0 && <EmptyState />}
            {transactionsQuery.data && transactionsQuery.data.length > 0 && (
              <div className="flex flex-col gap-2">
                {transactionsQuery.data.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center px-4 py-3 rounded-lg"
                    style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium capitalize"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {tx.type}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: tx.type === 'withdrawal' ? 'var(--color-error)' : 'var(--color-success)' }}
                      >
                        {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount}
                      </p>
                      <p
                        className="text-xs capitalize"
                        style={{ color: tx.status === 'pending' ? 'var(--color-warning)' : 'var(--color-text-muted)' }}
                      >
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </BrandCard>

      </div>
    </main>
  );
}
