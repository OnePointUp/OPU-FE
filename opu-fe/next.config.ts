import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "d3ouuaxqisq2ks.cloudfront.net",
            },
        ],
    },

    async rewrites() {
        return [
            {
                source: "/api/(.*)",
                destination: "https://api.onepointup.site/$1",
            },
        ];
    },
};

export default nextConfig;
