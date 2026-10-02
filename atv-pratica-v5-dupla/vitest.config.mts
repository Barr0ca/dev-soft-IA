import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      include: ['src/**/*.{ts,js}'],
      exclude: ['src/**/*.spec.ts'],
    },
  },
});
