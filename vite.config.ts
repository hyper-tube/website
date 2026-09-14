import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: './server/app.ts',
        },
      },
    },
  },
  server: {
    allowedHosts: true,
  },
  plugins: [tailwindcss(), Icons({ compiler: 'jsx', jsx: 'react' }), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
