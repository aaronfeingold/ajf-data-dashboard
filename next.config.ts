import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This tells Next.js which files to consider as pages
  // It will ignore any files that don't match these patterns
  pageExtensions: ["tsx", "ts", "jsx", "js"].filter(
    (ext) =>
      // Only include files that aren't in the fakers directory
      !ext.includes("fakers")
  ),
};

export default nextConfig;
