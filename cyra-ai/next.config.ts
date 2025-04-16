import { i18n } from './next-i18next.config';
import nextI18NextConfig from './next-i18next.config';

const nextConfig = {
  i18n,
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
