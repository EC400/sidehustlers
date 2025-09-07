/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Hinweis: Hier gehören i. d. R. NPM-Package-Namen rein (z. B. 'lucide-react'),
    // keine lokalen Aliase wie '@/components'. Lass es drin, falls es bei dir bewusst so genutzt wird.
    optimizePackageImports: ['@/components', '@/lib'],
  },

  async headers() {
    const authHeaders = [
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
    ];

    const cacheHeaders = [
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ];

    return [
      // Auth-/Login-Seiten: COOP/COEP nur hier setzen
      { source: '/login', headers: authHeaders },
      { source: '/register', headers: authHeaders },
      { source: '/auth/:path*', headers: authHeaders },

      // Dashboard: Cache-Header
      { source: '/dashboard/:path*', headers: cacheHeaders },
    ];
  },



// Falls du next.config.ts verwendest:
// export default nextConfig;


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
