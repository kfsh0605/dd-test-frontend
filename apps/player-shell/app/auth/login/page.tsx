'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { identityApi } from '@/adapters/identityApi';
import { BrandButton } from 'theme-tenant-alpha';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
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
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <div className="w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Welcome back
        </h1>
        <p className="text-center mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Sign in to your account
        </p>

        <div
          className="rounded-xl p-8 border"
          style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border-default)' }}
        >
          {serverError && (
            <div
              role="alert"
              className="rounded-lg px-4 py-3 mb-6 text-sm border"
              style={{ backgroundColor: 'rgba(255,77,77,0.1)', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                className="w-full px-4 py-3 rounded-lg text-base outline-none box-border"
                style={{
                  backgroundColor: 'var(--color-bg-input)',
                  border: `1px solid ${errors.email ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
                  color: 'var(--color-text-primary)',
                }}
              />
              {errors.email && (
                <p role="alert" className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Min. 8 characters"
                {...register('password')}
                className="w-full px-4 py-3 rounded-lg text-base outline-none box-border"
                style={{
                  backgroundColor: 'var(--color-bg-input)',
                  border: `1px solid ${errors.password ? 'var(--color-border-error)' : 'var(--color-border-default)'}`,
                  color: 'var(--color-text-primary)',
                }}
              />
              {errors.password && (
                <p role="alert" className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
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
