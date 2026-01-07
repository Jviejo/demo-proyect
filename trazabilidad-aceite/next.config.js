/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'standalone',
    swcMinify: true,
    reactStrictMode: true,
    experimental: {
        // Habilitar características experimentales si es necesario
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
