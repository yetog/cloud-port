
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Configure static file serving for apps
    middlewareMode: false,
    fs: {
      allow: ['..']
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configure static asset handling for subfolders
  publicDir: 'public',
  build: {
    // Ensure apps are copied to dist
    copyPublicDir: true,
  },
  // Configure routing for apps
  define: {
    // This helps with any environment variables the apps might need
    'process.env': {}
  }
}));
