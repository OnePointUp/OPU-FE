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
                source: "/api/v1/:path*",
                destination: "https://api.onepointup.site/api/v1/:path*",
            },
        ];
    },
};

export default nextConfig;
