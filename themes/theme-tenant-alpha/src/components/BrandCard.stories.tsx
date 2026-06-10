import type { Meta, StoryObj } from '@storybook/react';
import { BrandCard } from './BrandCard';
import { BrandButton } from './BrandButton';

const meta: Meta<typeof BrandCard> = {
  title: 'Theme/BrandCard',
  component: BrandCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
    },
    noPadding: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof BrandCard>;

export const Default: Story = {
  args: {
    variant: 'default',
    header: 'Your Balance',
    children: (
      <div>
        <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
          $1,250.00
        </p>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-1)' }}>
          USD - updated 10:25:48
        </p>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    header: 'Transaction History',
    children: (
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
        No transactions yet
      </p>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    header: 'Deposit Funds',
    children: (
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
        Enter an amount to deposit
      </p>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    variant: 'default',
    header: 'Deposit Funds',
    children: (
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
        Min. $10 — Max. $10,000
      </p>
    ),
    footer: (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
        <BrandButton variant="ghost" size="sm">Cancel</BrandButton>
        <BrandButton variant="primary" size="sm">Confirm</BrandButton>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {(['default', 'elevated', 'outlined'] as const).map((variant) => (
        <BrandCard key={variant} variant={variant} header={`Variant: ${variant}`}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Card content for {variant} variant
          </p>
        </BrandCard>
      ))}
    </div>
  ),
};
