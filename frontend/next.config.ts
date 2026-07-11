import type { NextConfig } from "next";

/**
 * Mirror backend TEST_PAYMENT_MODE into the client bundle so pricing UI
 * shows ₹1 while the server charges ₹1 — one env flag for both.
 * Production: leave unset / false → real catalog prices.
 */
const testPaymentMode =
  process.env.NEXT_PUBLIC_TEST_PAYMENT_MODE ||
  process.env.TEST_PAYMENT_MODE ||
  "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_TEST_PAYMENT_MODE: testPaymentMode,
  },
  images: {
    qualities: [25, 50, 60, 75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/s2/favicons/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
