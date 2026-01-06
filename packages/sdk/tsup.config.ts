import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
  },
  {
    entry: {
      'react/index': 'src/react/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    external: ['react'],
    splitting: false,
    sourcemap: true,
  },
  {
    entry: {
      'vue/index': 'src/vue/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    external: ['vue'],
    splitting: false,
    sourcemap: true,
  },
]);
