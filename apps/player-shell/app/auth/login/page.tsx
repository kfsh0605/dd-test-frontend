'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { identityApi } from '@/adapters/identityApi';
import { BrandButton } from 'theme-tenant-alpha';

// Zod schema - single source of truth for validation rules and TypeScript types
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Type is derived from schema - no manual duplication
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await identityApi.login(data);
      router.push('/account/billing');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-4)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)', textAlign: 'center' }}>
          Welcome back
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          Sign in to your account
        </p>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-8)' }}>

          {/* Server-level error (wrong credentials etc) */}
          {serverError && (
            <div role="alert" style={{ backgroundColor: 'rgba(255,77,77,0.1)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)', marginBottom: 'var(--spacing-6)', color: 'var(--color-error)', fontSize: 'var(--font-size-sm)' }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div style={{ marginBottom: 'var(--spacing-5)' }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  backgroundColor: 'var(--color-bg-input)',
                  border: `1px solid ${errors.email ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-md)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.email && (
                <p role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-1)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Min. 8 characters"
                {...register('password')}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  backgroundColor: 'var(--color-bg-input)',
                  border: `1px solid ${errors.password ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-md)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.password && (
                <p role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-1)' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <BrandButton type="submit" fullWidth isLoading={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </BrandButton>

          </form>
        </div>
      </div>
    </main>
  );
}
