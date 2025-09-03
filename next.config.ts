/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(login|register|auth/:path*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy", 
            value: "unsafe-none",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { 
        source: "/auth/login", 
        destination: "/login", 
        permanent: false 
      },
      { 
        source: "/auth/register", 
        destination: "/register", 
        permanent: false 
      },
    ];
  },

  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.ignoreWarnings = [
        /Critical dependency: the request of a dependency is an expression/,
        /node_modules\/@google-cloud\/firestore/,
        /node_modules\/firebase-admin/,
      ];
    }
    return config;
  },

  // KORRIGIERTE Experimental Settings für Next.js 15
  serverExternalPackages: [  // Geändert von experimental.serverComponentsExternalPackages
    'firebase-admin',
    '@google-cloud/firestore',
    '@google-cloud/storage',
  ],

  transpilePackages: [
    'firebase',
    '@firebase/app',
    '@firebase/auth', 
    '@firebase/firestore',
  ],

  // Output-Tracking für Monorepo korrigieren
  outputFileTracingRoot: process.cwd(),
};

module.exports = nextConfig;