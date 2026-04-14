import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress Anthropic SDK server-only warning in edge
  serverExternalPackages: ['@anthropic-ai/sdk'],
};

export default nextConfig;
