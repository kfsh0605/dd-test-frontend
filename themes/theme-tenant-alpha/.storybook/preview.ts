import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/tokens.css';

const withThemeBackground = (Story: React.ComponentType) =>
  React.createElement(
    'div',
    {
      style: {
        backgroundColor: 'var(--color-bg-base)',
        padding: '2rem',
      },
    },
    React.createElement(Story),
  );

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    docs: {
      canvas: {
        style: { backgroundColor: 'var(--color-bg-base)' },
      },
    },
  },
  decorators: [withThemeBackground],
};

export default preview;
