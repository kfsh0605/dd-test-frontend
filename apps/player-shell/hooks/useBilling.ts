import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi } from '@/adapters/billingApi';
import { useTenant } from '@/context/TenantContext';

export function useBilling() {
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
    },
  });

  return { balanceQuery, transactionsQuery, depositMutation };
}
