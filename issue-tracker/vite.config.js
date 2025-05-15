import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules compatibility
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Configure the server for history API fallback (useful for client-side routing in React)
  server: {
    historyApiFallback: true,
  },

  resolve: {
    // Define aliases to simplify import paths
    alias: {
      '@': path.resolve(__dirname, 'src'), // This is used to resolve imports like '@/components/MyComponent'
    },
  },

  build: {
    outDir: 'dist',  // Output directory for the build
    assetsDir: 'assets',  // Directory for assets like images and styles
    rollupOptions: {
      input: 'index.html',  // Explicitly set the input HTML file
    },
    // Enable manifest to help with file references in production
    manifest: true,
    // Optional: Set chunk size limit to avoid large bundles
    chunkSizeWarningLimit: 1000,
  },

  // Optional: Include environment variables or custom build settings (if needed)
  envPrefix: 'VITE_', // Prefix for environment variables to expose to the client-side
});
