/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Aviso: esta opção permite ignorar erros de ESLint durante o build
    // Use com cuidado - isso é útil para o deploy, mas pode mascarar problemas
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig; 