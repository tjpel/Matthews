/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  rewrites: async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error(
        'The environment variable NEXT_PUBLIC_BACKEND_URL is required but was not provided.'
      );
    }

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`
      }
    ];
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh']
  }
};

module.exports = nextConfig;
