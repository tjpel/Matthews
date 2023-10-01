/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/api/:path*'  // For local development
            : 'https://matthews-backend.fly.dev/api/:path*',  // For production
      },
    ];
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh'],
  },
};

module.exports = nextConfig;
