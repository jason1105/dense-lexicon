import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 仓库保持整洁：不自动生成 AGENTS.md
  agentRules: false,
};

export default nextConfig;
