import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Safely get cwd, fallback to dot if process is undefined (rare in build context but good practice)
  const cwd = typeof process !== 'undefined' && typeof (process as any).cwd === 'function' ? (process as any).cwd() : '.';
  const env = loadEnv(mode, cwd, '');

  return {
    plugins: [react()],
    base: '/', // Ensure base path is root for Firebase Hosting
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': '/src', 
      },
    },
    define: {
      // Safely stringify the env object to inject it into the browser
      // This prevents "process is not defined" errors while still allowing process.env.VAR usage
      'process.env': JSON.stringify(env)
    }
  };
});