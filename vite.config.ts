import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";


// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: PluginOption[] = [react()];

  if (mode === "development") {
    try {
      const { componentTagger } = await import("lovable-tagger");
      plugins.push(componentTagger());
    } catch (err) {
      console.warn("[vite] lovable-tagger not available; skipping in development.");
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      // Memory-efficient build settings
      rollupOptions: {
        output: {
          manualChunks: undefined, // Let Vite handle chunking automatically
        },
      },
      // Disable sourcemaps in development builds to save memory
      sourcemap: false,
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 2000,
    },
    optimizeDeps: {
      exclude: ["workbox-window"],
    },
  };
});