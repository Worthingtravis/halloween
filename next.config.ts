import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ezrv1qwxe8bpehpd.public.blob.vercel-storage.com',
                port: '',
                pathname: '/*',
            },
        ],
    },
};

export default nextConfig;
