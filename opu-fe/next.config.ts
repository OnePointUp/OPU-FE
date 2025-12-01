import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "d3ouuaxqisq2ks.cloudfront.net",
            },
        ],
    },
};

export default nextConfig;
