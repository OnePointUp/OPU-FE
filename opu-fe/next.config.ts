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
                destination:
                    "http://ec2-13-209-4-254.ap-northeast-2.compute.amazonaws.com:8080/api/v1/:path*",
            },
        ];
    },
};

export default nextConfig;
