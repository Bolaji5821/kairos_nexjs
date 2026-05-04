import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), "");

  // Only upload sourcemaps in staging and production
  const shouldUploadSourcemaps =
    env.VITE_APP_ENVIRONMENT === "staging" ||
    env.VITE_APP_ENVIRONMENT === "production";

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Only include Sentry plugin when we should upload sourcemaps
      shouldUploadSourcemaps &&
        sentryVitePlugin({
          org: "kairos-nexus-global",
          project: "kairos-frontend",
          authToken: env.SENTRY_AUTH_TOKEN,
          sourcemaps: {
            // Upload all source files including sourcemaps
            filesToDeleteAfterUpload: ["**/*.map"],
          },
          release: {
            // Use git commit SHA or deploy ID as release name
            name: env.VITE_RELEASE_VERSION || undefined,
          },
        }),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      sourcemap: true,
    },
  };
});
