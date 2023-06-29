/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.ytimg.com'
            }
        ]
    },
    env: {
        NEXT_PUBLIC_YT_API_KEY: process.env.NEXT_PUBLIC_YT_API_KEY
    }
};

module.exports = nextConfig;
