import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: "../../",
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "kairos-nexus-global",
  project: process.env.SENTRY_PROJECT || "landing-page-nextj",
  silent: !process.env.CI,
});
