import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.MODE || "development";

// Only initialize Sentry in staging and production environments
const shouldInitializeSentry = () => {
  const allowedEnvironments = ["staging", "production"];
  return SENTRY_DSN && allowedEnvironments.includes(ENVIRONMENT);
};

export const initSentry = () => {
  if (!shouldInitializeSentry()) {
    console.log(
      `Sentry not initialized. Environment: ${ENVIRONMENT}, DSN present: ${!!SENTRY_DSN}`,
    );
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,

    // Performance Monitoring
    integrations: [
      // Browser tracing for performance monitoring
      Sentry.browserTracingIntegration(),
      // Replay integration for session replays
      Sentry.replayIntegration({
        // Mask all text content by default for privacy
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Tracing
    // Capture 100% of transactions for performance monitoring
    tracesSampleRate: 1.0,

    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/.*\.kairos/],

    // Session Replay
    // Capture 10% of all sessions
    replaysSessionSampleRate: 0.1,
    // Capture 100% of sessions with errors
    replaysOnErrorSampleRate: 1.0,

    // Enable debug mode in non-production environments
    debug: ENVIRONMENT === "staging",

    // Attach user info if available
    beforeSend(event) {
      // You can modify the event here before it's sent
      return event;
    },
  });

  console.log(`Sentry initialized for ${ENVIRONMENT} environment`);
};

// Re-export Sentry for use throughout the app
export { Sentry };
